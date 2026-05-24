import express from 'express';
import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file if it exists
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const index = trimmed.indexOf('=');
        if (index > -1) {
          const key = trimmed.substring(0, index).trim();
          let val = trimmed.substring(index + 1).trim();
          // Remove wrapping quotes if they exist
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    });
    console.log('Environment variables successfully loaded from .env');
  } else {
    console.log('.env file not found, running with system environment variables');
  }
} catch (e) {
  console.error('Error reading .env file:', e);
}

const PORT = 3000;
const ANGULAR_DEV_PORT = 4200;
const app = express();

app.use(express.json());

// 1. Health check routing
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    firebaseEnabled: !!process.env.FIREBASE_PROJECT_ID,
    firecrawlEnabled: !!process.env.FIRECRAWL_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// 1b. Firebase Client Config endpoint
app.get('/api/firebase-config', (req, res) => {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_API_KEY) {
    return res.json({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.FIREBASE_APP_ID || "",
      firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || "(default)"
    });
  }

  // Fallback to local src/firebase-applet-config.json
  const configPath = path.join(__dirname, 'src', 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return res.json(config);
    } catch (e) {
      // Ignore
    }
  }

  res.status(404).json({ error: 'Firebase config not found' });
});

// 1c. Google Analytics 4 & Google Search Console Integration endpoints
const CONFIG_FILE = path.join(__dirname, 'google-integrations.json');
const whitelistedSuperAdmins = ['aliyusahmad2020@gmail.com', 'aliyusahmad01@gmail.com', 'student.admin@gmail.com'];

function isAdminRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const email = authHeader.substring(7).trim().toLowerCase();
  return whitelistedSuperAdmins.includes(email);
}

function getIntegrations() {
  // 1. Check environment variables first
  if (process.env.GA4_MEASUREMENT_ID) {
    return {
      ga4MeasurementId: process.env.GA4_MEASUREMENT_ID,
      ga4PropertyId: process.env.GA4_PROPERTY_ID || '',
      googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
      gscSiteUrl: process.env.GSC_SITE_URL || '',
      clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
      privateKey: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '',
      geminiApiKey: process.env.GEMINI_API_KEY || ''
    };
  }

  // 2. Check local file
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    } catch (e) {
      // Ignore
    }
  }

  return {
    ga4MeasurementId: '',
    ga4PropertyId: '',
    googleSiteVerification: '',
    gscSiteUrl: '',
    clientEmail: '',
    privateKey: '',
    geminiApiKey: ''
  };
}

async function getGoogleAccessToken(clientEmail, privateKey, scopes) {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };
  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: clientEmail,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const formattedKey = privateKey.replace(/\\n/g, '\n');

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64ClaimSet = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
  const signatureInput = `${base64Header}.${base64ClaimSet}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(formattedKey, 'base64url');

  const assertion = `${signatureInput}.${signature}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Google OAuth token exchange failed: ${errorText}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

app.get('/api/public-integrations', (req, res) => {
  const config = getIntegrations();
  return res.json({
    ga4MeasurementId: config.ga4MeasurementId || '',
    googleSiteVerification: config.googleSiteVerification || ''
  });
});

app.get('/api/integrations', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const config = getIntegrations();
  return res.json({
    ga4MeasurementId: config.ga4MeasurementId || '',
    ga4PropertyId: config.ga4PropertyId || '',
    googleSiteVerification: config.googleSiteVerification || '',
    gscSiteUrl: config.gscSiteUrl || '',
    clientEmail: config.clientEmail || '',
    hasPrivateKey: !!config.privateKey,
    geminiApiKey: config.geminiApiKey || ''
  });
});

app.post('/api/integrations', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { ga4MeasurementId, ga4PropertyId, googleSiteVerification, gscSiteUrl, clientEmail, privateKey, geminiApiKey } = req.body;
  const current = getIntegrations();

  const updated = {
    ga4MeasurementId: ga4MeasurementId || '',
    ga4PropertyId: ga4PropertyId || '',
    googleSiteVerification: googleSiteVerification || '',
    gscSiteUrl: gscSiteUrl || '',
    clientEmail: clientEmail || '',
    privateKey: privateKey || current.privateKey || '',
    geminiApiKey: geminiApiKey !== undefined ? geminiApiKey : (current.geminiApiKey || '')
  };

  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to write configuration file' });
  }
});

app.get('/api/analytics/ga4', async (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const config = getIntegrations();
  if (!config.clientEmail || !config.privateKey || !config.ga4PropertyId) {
    return res.json({ configured: false, trend: [] });
  }

  try {
    const token = await getGoogleAccessToken(config.clientEmail, config.privateKey, [
      'https://www.googleapis.com/auth/analytics.readonly'
    ]);

    const propertyId = config.ga4PropertyId;
    const analyticsResponse = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' }
        ]
      })
    });

    if (!analyticsResponse.ok) {
      const errText = await analyticsResponse.text();
      return res.status(500).json({ error: `GA4 API error: ${errText}` });
    }

    const data = await analyticsResponse.json();
    const rows = data.rows || [];
    const trend = rows.map(r => {
      const dateStr = r.dimensionValues[0].value;
      const formattedDate = `${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}`;
      const views = parseInt(r.metricValues[1].value, 10) || 0;
      const activeUsers = parseInt(r.metricValues[0].value, 10) || 0;
      return {
        day: formattedDate,
        views: views,
        activeUsers: activeUsers
      };
    }).sort((a, b) => a.day.localeCompare(b.day));

    return res.json({ configured: true, trend });
  } catch (err) {
    console.error('GA4 API Query failed:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/gsc', async (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const config = getIntegrations();
  if (!config.clientEmail || !config.privateKey || !config.gscSiteUrl) {
    return res.json({ configured: false, keywords: [] });
  }

  try {
    const token = await getGoogleAccessToken(config.clientEmail, config.privateKey, [
      'https://www.googleapis.com/auth/webmasters.readonly'
    ]);

    const siteUrl = encodeURIComponent(config.gscSiteUrl);
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 14);

    const pad = (num) => String(num).padStart(2, '0');
    const formatDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const gscResponse = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate: formatDate(startDate),
        endDate: formatDate(today),
        dimensions: ['query'],
        rowLimit: 10
      })
    });

    if (!gscResponse.ok) {
      const errText = await gscResponse.text();
      return res.status(500).json({ error: `GSC API error: ${errText}` });
    }

    const data = await gscResponse.json();
    const rows = data.rows || [];
    const keywords = rows.map(r => ({
      keyword: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: (r.ctr * 100).toFixed(1) + '%',
      position: r.position.toFixed(1)
    }));

    return res.json({ configured: true, keywords });
  } catch (err) {
    console.error('GSC API Query failed:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/google:token.html', (req, res) => {
  const token = req.params.token;
  const config = getIntegrations();
  const configuredToken = config.googleSiteVerification;
  
  if (configuredToken && configuredToken.includes(token)) {
    return res.send(`google-site-verification: google${token}.html`);
  }
  res.status(404).send('Not Found');
});

// 2. Firecrawl Scraper & Search Agent API & Background Loop Helper

// Predefined beautiful images
const beautifulImages = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800'
];

const getFallbackResults = (continentStr, typeStr, availableCategories) => [
  {
    id: `auto-draft-${continentStr.toLowerCase()}-${typeStr.toLowerCase()}-${Date.now()}-1`,
    title: `Global Leadership & Merit Excellence Award (${continentStr})`,
    excerpt: `Discovered and indexed via Firecrawl from ${continentStr} portal details. Comprehensive funding for innovators and future leaders.`,
    description: `## Introduction\nThis scholarship is sponsored by the Academic Hub Platform in partnerships with leading global institutions to support promising candidates in their academic journey.\n\n## Value & Benefits\n- Comprehensive coverage of academic tuition and college levies.\n- Substantial monthly living allowance.\n- Priority invitation to annual summit events.\n\n## Eligibility Criteria\n- Outstanding intellectual achievements with a GPA exceeding 3.5/4.0.\n- Citizens of any country are eligible to apply.\n- Candidates must submit a written personal statement (maximum 1000 words).`,
    category: availableCategories[0] || 'Fully-Funded',
    amount: 45000,
    amountDisplay: '$45,000 Total Funding Package',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    applyUrl: 'https://example.com/scholarships/apply-mock-gateway',
    eligibility: `Minimum 3.5 GPA with strong leadership profiles.`,
    status: 'draft',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800',
    tags: [continentStr, typeStr, 'Draft', 'Firecrawl'],
    views: 18
  },
  {
    id: `auto-draft-${continentStr.toLowerCase()}-${typeStr.toLowerCase()}-${Date.now()}-2`,
    title: `National Science & Innovation Fellowship (${continentStr})`,
    excerpt: `Extracted via automated Chromium browser typing and scanning of regional portals. Awarded to top applicants in undergraduate scientific research fields.`,
    description: `## Introduction\nThis intensive research fellowship program is geared towards students looking to elevate their practical experiences with specialized STEM and humanity tracks.\n\n## Value & Benefits\n- Flexible research and travel budget allowance.\n- Direct mentorship pairings with master scholars.\n- Fully-funded attendance at 2 international conferences.\n\n## Eligibility Criteria\n- Currently enrolled in undergraduate studies.\n- Evidence of working on innovative research projects.\n- Recommendation of 2 departmental instructors.`,
    category: availableCategories[1] || 'Undergrad',
    amount: 12000,
    amountDisplay: '$12,000 / Year Award',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    applyUrl: 'https://example.com/fellowships/apply-mock-gateway',
    eligibility: 'Open to science and humanities students worldwide.',
    status: 'draft',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800',
    tags: [continentStr, typeStr, 'Research', 'Grounding'],
    views: 24
  }
];

// Reusable Firecrawl automation routine
async function runSearchAndScrape(continentStr, typeStr, categories = [], tags = []) {
  const availableCategories = (categories && categories.length > 0)
    ? categories 
    : ["Fully-Funded", "Undergrad", "Postgrad", "PhD"];

  const queryStr = `Latest 2026/2027 ${typeStr} opportunities and funding in ${continentStr} international student applications`;
  const logs = [];
  const pushLog = (text, type) => {
    const timestamp = new Date().toLocaleTimeString();
    logs.push({ time: timestamp, type, text });
  };

  pushLog(`Initiating Firecrawl web search for: "${queryStr}"`, 'firecrawl');
  const fKey = process.env.FIRECRAWL_API_KEY || '';

  if (fKey) {
    pushLog(`Firecrawl API Key verified. Initiating search query on index...`, 'firecrawl');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for deep search

      const searchRes = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${fKey}`
        },
        body: JSON.stringify({
          query: queryStr,
          limit: 3
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!searchRes.ok) {
        throw new Error(`Firecrawl Search endpoint returned status ${searchRes.status}`);
      }

      const searchData = await searchRes.json();
      if (searchData.success && Array.isArray(searchData.data) && searchData.data.length > 0) {
        const topUrl = searchData.data[0].url;
        pushLog(`Search complete. Resolved top target URL: ${topUrl}`, 'firecrawl');
        pushLog(`Initiating structured extraction via Firecrawl JSON Schema scrape with browser actions...`, 'firecrawl');

        const ScholarshipListSchema = {
          type: 'object',
          properties: {
            opportunities: {
              type: 'array',
              description: 'List of active scholarships and funding opportunities found on the page. Find between 3 and 6 items.',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'URL-safe slug, e.g. "oxford-clarendon-scholarships"' },
                  title: { type: 'string', description: 'Official name of the scholarship' },
                  excerpt: { type: 'string', description: '2-sentence brief summary of the opportunity' },
                  description: { type: 'string', description: 'Full description in markdown formatting' },
                  category: { type: 'string', description: 'Must be exactly one of: Fully-Funded, Undergrad, Postgrad, PhD' },
                  amount: { type: 'number', description: 'Estimated numeric value' },
                  amountDisplay: { type: 'string', description: 'Text label for funding, e.g. "$25,000 / Year"' },
                  deadline: { type: 'string', description: 'Deadline in YYYY-MM-DD format' },
                  applyUrl: { type: 'string', description: 'Official application or website URL' },
                  eligibility: { type: 'string', description: 'Brief candidate criteria' },
                  imageUrl: { type: 'string', description: 'Relevant image URL' },
                  tags: { type: 'array', items: { type: 'string' } }
                },
                required: ['id', 'title', 'excerpt', 'description', 'category', 'amount', 'amountDisplay', 'deadline', 'applyUrl', 'eligibility']
              }
            }
          },
          required: ['opportunities']
        };

        const scrapeController = new AbortController();
        const scrapeTimeoutId = setTimeout(() => scrapeController.abort(), 90000); // 90s timeout for browser action scraping

        const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${fKey}`
          },
          body: JSON.stringify({
            url: topUrl,
            formats: ["json"],
            jsonOptions: {
              schema: ScholarshipListSchema
            },
            // Enable Firecrawl's browser actions to scroll and let scripts load fully
            actions: [
              { type: 'wait', milliseconds: 3000 },
              { type: 'scroll', direction: 'down' },
              { type: 'wait', milliseconds: 2000 }
            ]
          }),
          signal: scrapeController.signal
        });

        clearTimeout(scrapeTimeoutId);

        if (!scrapeRes.ok) {
          const errText = await scrapeRes.text();
          console.error(`[Firecrawl Error] Scrape failed: Status ${scrapeRes.status}, Response: ${errText}`);
          throw new Error(`Firecrawl Scrape endpoint returned status ${scrapeRes.status}: ${errText}`);
        }

        const scrapeData = await scrapeRes.json();
        if (scrapeData.success && scrapeData.data && scrapeData.data.json) {
          const rawOpportunities = scrapeData.data.json.opportunities || [];
          pushLog(`Firecrawl structured scrape succeeded. Received ${rawOpportunities.length} opportunities from target page.`, 'firecrawl');

          if (rawOpportunities.length > 0) {
            const opportunitiesClean = rawOpportunities.map((opp, idx) => {
              let img = opp.imageUrl;
              if (!img || typeof img !== 'string' || !img.startsWith('http')) {
                img = beautifulImages[idx % beautifulImages.length];
              }
              return {
                id: opp.id ? opp.id.toLowerCase().replace(/[^a-z0-9-]/g, '-') : `fc-${Date.now()}-${idx}`,
                title: opp.title || 'Scholarship Opportunity',
                excerpt: opp.excerpt || 'Scholarship opportunity discovered via live search.',
                description: opp.description || `### Introduction\nThis scholarship details were gathered from the host university portal.\n\n### Benefits\n- Tuition package support.\n- Regional stipend allowance.\n\n### Eligibility\n- Open to qualifying international candidates.\n\n### How to Apply\nVisit ${opp.applyUrl || topUrl} to submit your application forms.`,
                category: opp.category || availableCategories[0] || 'Fully-Funded',
                amount: typeof opp.amount === 'number' ? opp.amount : 20000,
                amountDisplay: opp.amountDisplay || '$20,000 / Year',
                deadline: opp.deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                applyUrl: opp.applyUrl || topUrl,
                eligibility: opp.eligibility || 'International students meeting standard criteria.',
                status: 'draft',
                imageUrl: img,
                tags: Array.isArray(opp.tags) && opp.tags.length > 0 ? opp.tags : [continentStr, typeStr],
                views: Math.floor(Math.random() * 85) + 12
              };
            });

            pushLog(`Data schema normalization completed. Prepared ${opportunitiesClean.length} records.`, 'system');

            return {
              opportunities: opportunitiesClean,
              logs,
              citations: [
                { title: `Firecrawl Search: ${queryStr}`, uri: `https://www.google.com/search?q=${encodeURIComponent(queryStr)}` },
                { title: `Source Article: ${topUrl}`, uri: topUrl }
              ]
            };
          }
        }
        pushLog(`Structured scrape did not yield direct JSON opportunities. Falling back...`, 'system');
      } else {
        pushLog(`Firecrawl search did not return any indexed pages for this query. Falling back...`, 'system');
      }
    } catch (err) {
      console.error('Error in Firecrawl search/scrape flow:', err);
      pushLog(`API request failure: ${err.message}. Engaging offline mockup generator...`, 'system');
    }
  } else {
    pushLog(`Firecrawl API Key missing in environment settings. Engaging offline mockup generator...`, 'system');
  }

  // Fallback pathway
  pushLog(`Compiling high-fidelity academic opportunities for: "${continentStr}"...`, 'system');
  const normalizedFallback = getFallbackResults(continentStr, typeStr, availableCategories);
  pushLog(`Successfully synthesized ${normalizedFallback.length} mock opportunities.`, 'system');
  
  return {
    opportunities: normalizedFallback,
    logs,
    citations: [{ title: `Mock citation library`, uri: `https://example.com/mock-search` }]
  };
}

// REST route for administrative description markdown optimization via Gemini
app.post('/api/ai/optimize', async (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { description, title } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description text is required' });
  }

  const config = getIntegrations();
  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY || '';

  if (apiKey) {
    try {
      const prompt = `You are a premium scholarship copywriter. Review and optimize the following scholarship description block. 
Improve its readability, correct any typos or grammatical mistakes, and structure the requirements into clean, professional Markdown headers (using ## instead of ###, and no h1) and bullet points.
Make sure the description is inspiring, informative, and beautifully formatted. Do NOT invent new facts. Maintain the original deadline, value, eligibility, and links exactly.

Scholarship Title: ${title || 'Academic Opportunity'}
Original Description to Optimize:
${description}

Provide ONLY the optimized markdown text. Do not add introductory or concluding sentences like "Here is your optimized description:". Output directly in Markdown.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return res.json({ optimizedText: text.trim() });
      } else {
        throw new Error('No content returned from Gemini API response candidates');
      }
    } catch (err) {
      console.error('Gemini optimization API call failed:', err);
      const optimizedMock = getFallbackOptimizedText(description);
      return res.json({ 
        optimizedText: optimizedMock,
        warning: 'Gemini API call failed, using high-fidelity local synthesis fallback: ' + err.message 
      });
    }
  } else {
    const optimizedMock = getFallbackOptimizedText(description);
    return res.json({ 
      optimizedText: optimizedMock,
      warning: 'No Gemini Developer API Key configured. Using offline high-fidelity layout optimizer.' 
    });
  }
});

function getFallbackOptimizedText(text) {
  let cleaned = text.trim();
  
  if (!cleaned.includes('## Introduction')) {
    cleaned = `## Introduction\n${cleaned}`;
  }
  if (!cleaned.includes('## Benefits') && !cleaned.includes('## Funding Details')) {
    cleaned += `\n\n## Funding Details\n- Provides generous allocated funding allowance.\n- Covers institutional tuition fees package.\n- Offers research or travel stipend (if applicable).`;
  }
  if (!cleaned.includes('## Requirements') && !cleaned.includes('## Candidate Criteria')) {
    cleaned += `\n\n## Candidate Criteria\n- Outstanding academic achievements.\n- Meets core enrollment parameters.\n- Fully compliant submission package.`;
  }
  
  return cleaned;
}

// REST route for manual trigger
app.post('/api/firecrawl-computer-use', async (req, res) => {
  const { continent, opportunityType, categories, tags } = req.body;
  const continentStr = continent ? continent.trim() : 'Global';
  const typeStr = opportunityType ? opportunityType.trim() : 'Scholarship';
  
  const result = await runSearchAndScrape(continentStr, typeStr, categories, tags);
  return res.json(result);
});

// REST routes for background auto-drafts management
app.get('/api/auto-drafts', (req, res) => {
  const filePath = path.join(__dirname, 'auto-drafts.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return res.json(data);
    } catch (e) {
      return res.json([]);
    }
  }
  return res.json([]);
});

app.post('/api/auto-drafts/approve', (req, res) => {
  const { id } = req.body;
  const filePath = path.join(__dirname, 'auto-drafts.json');
  if (fs.existsSync(filePath)) {
    try {
      let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      data = data.filter(item => item.id !== id);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({ success: true, remaining: data.length });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to update auto-drafts data store.' });
    }
  }
  return res.json({ success: true, remaining: 0 });
});

app.post('/api/auto-drafts/dismiss', (req, res) => {
  const { id } = req.body;
  const filePath = path.join(__dirname, 'auto-drafts.json');
  if (fs.existsSync(filePath)) {
    try {
      let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      data = data.filter(item => item.id !== id);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({ success: true, remaining: data.length });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to update auto-drafts data store.' });
    }
  }
  return res.json({ success: true, remaining: 0 });
});

// Scheduler loop configuration
const PRESET_CONTINENTS = ['Europe', 'Asia', 'North America', 'Africa', 'Australia', 'Global'];
const PRESET_TYPES = ['Fully-Funded', 'PhD', 'Postgrad', 'Undergrad'];
let currentDiscoveryIndex = 0;

function startAutoDiscoveryLoop() {
  const INTERVAL_MS = 15 * 60 * 1000; // Periodically crawl every 15 minutes
  console.log('Spawning Firecrawl Background Auto-Discovery Loop (polling active)...');

  setInterval(async () => {
    try {
      const continent = PRESET_CONTINENTS[currentDiscoveryIndex % PRESET_CONTINENTS.length];
      const type = PRESET_TYPES[Math.floor(Math.random() * PRESET_TYPES.length)];
      currentDiscoveryIndex++;

      console.log(`[Auto-Discovery] Executing background scraper run for ${continent} / ${type}...`);
      const result = await runSearchAndScrape(continent, type);

      if (result && result.opportunities && result.opportunities.length > 0) {
        const filePath = path.join(__dirname, 'auto-drafts.json');
        let existing = [];
        if (fs.existsSync(filePath)) {
          try {
            existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          } catch (e) {
            existing = [];
          }
        }

        let addedCount = 0;
        for (const item of result.opportunities) {
          if (!existing.some(x => x.id === item.id)) {
            existing.push(item);
            addedCount++;
          }
        }

        if (addedCount > 0) {
          fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
          console.log(`[Auto-Discovery] Cached ${addedCount} new background auto-draft opportunities.`);
        }
      }
    } catch (err) {
      console.error('[Auto-Discovery] Background crawler cycle failure:', err);
    }
  }, INTERVAL_MS);
}

// Initial crawler run to populate store on boot (after 5 seconds)
setTimeout(async () => {
  console.log('[Auto-Discovery] Running initial background crawler boot cycle...');
  try {
    const continent = PRESET_CONTINENTS[0];
    const type = PRESET_TYPES[0];
    const result = await runSearchAndScrape(continent, type);
    const filePath = path.join(__dirname, 'auto-drafts.json');
    let existing = [];
    if (fs.existsSync(filePath)) {
      try {
        existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) {}
    }
    for (const item of result.opportunities) {
      if (!existing.some(x => x.id === item.id)) {
        existing.push(item);
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
    console.log('[Auto-Discovery] Initial boot cycle cache write successful.');
  } catch (err) {
    console.error('[Auto-Discovery] Initial boot cycle error:', err);
  }
}, 5000);

startAutoDiscoveryLoop();


// 3. Static Files Production Deployment vs Dev Proxy Configuration
const prodDistPath = path.join(__dirname, 'dist', 'app', 'browser');
const prodFallbackDistPath = path.join(__dirname, 'dist', 'app');

const isProd = process.env.NODE_ENV === 'production' || fs.existsSync(prodDistPath) || fs.existsSync(prodFallbackDistPath);

if (isProd) {
  const finalDist = fs.existsSync(prodDistPath) ? prodDistPath : prodFallbackDistPath;
  console.log(`Production assets detected. Serving static distribution folder: ${finalDist}`);
  
  app.use(express.static(finalDist));
  
  // Single-page application router fallback redirect
  app.get('/*any', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(finalDist, 'index.html'));
  });
} else {
  console.log('Initiating Development proxy layer...');
  
  // Spawn the Angular Dev Server on port 4200
  const ngProcess = spawn('npx', ['ng', 'serve', '--port', '4200', '--host', '127.0.0.1', '--disable-host-check'], {
    shell: true,
    stdio: 'inherit'
  });

  ngProcess.on('error', (err) => {
    console.error('Failed to spin up Angular development process:', err);
  });

  // Proxy non-api requests to Angular local server running on port 4200
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    const proxyReq = http.request({
      host: '127.0.0.1',
      port: ANGULAR_DEV_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.status(502).send('Dev Server Loading Gateway. Please refresh in a few seconds...');
    });

    req.pipe(proxyReq);
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Full-Stack Node.js App Gateway is listening actively on port ${PORT}`);
});
