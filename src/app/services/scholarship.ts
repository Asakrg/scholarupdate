import { Injectable, signal, computed } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocFromServer,
  increment,
  Firestore
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Define standard types/schemas
export interface Scholarship {
  id: string; // url slug e.g. 'cambridge-undergraduate-award'
  title: string;
  excerpt: string;
  description: string; // Markdown supported detail text
  category: string;
  amount: number;
  amountDisplay: string; // e.g. '$26,500 / Year + travel allowance'
  deadline: string; // YYYY-MM-DD format
  applyUrl: string; // official application url
  eligibility: string; // short summary bullet or condition
  status: 'published' | 'draft';
  imageUrl: string;
  tags: string[];
  views: number; // dynamically incremented counter
  lastViewedAt?: string; // ISO string of most recent index retrieval
  metaTitle?: string; // custom manual SEO title
  metaDescription?: string; // custom manual SEO description
  featured?: boolean; // editorially curated staff pick
  country?: string; // country/region e.g. 'UK', 'USA', 'Global'
  field?: string; // field of study e.g. 'STEM', 'Arts', 'Business'
  fundingType?: string; // e.g. 'Fully-Funded', 'Partial', 'Tuition-Waiver'
  demographic?: string; // e.g. 'International', 'Women', 'First-Gen'
}

export interface AdProvider {
  id: string; // 'adsense' | 'ezoic' | 'mediavine' | 'adsterra'
  name: string;
  enabled: boolean;
  placements: {
    leaderboard: boolean; // details page top
    sidebar: boolean;     // details page right side
    inFeed: boolean;      // homepage feed slot
  };
  credentials?: {
    publisherId?: string;
    slotId?: string;
    siteId?: string;
    bannerId?: string;
  };
}

export interface AdEarningsData {
  today: number;
  yesterday: number;
  month: number;
  impressions: number;
  clicks: number;
  views: number;
  ecpm: number;
  trend: { day: string; earnings: number; views: number; impressions: number; clicks: number }[];
}

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

export interface WhitelistedUser {
  email: string;
  role: 'super-admin' | 'content-editor';
  password?: string;
  blocked?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown details
  category: 'Guide' | 'Tip' | 'FAQ';
  views: number;
  publishedAt: string; // ISO string
  status: 'published' | 'draft';
}

export interface AppToast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  durationMs?: number;
}

export interface LoggedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'super-admin' | 'content-editor';
  blocked?: boolean;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Beautiful Pre-populated high-quality scholarship opportunities!
const PRE_POPULATED_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'oxford-rhodes-scholarship',
    title: 'Rhodes Trust Postgraduate Scholarship at Oxford',
    excerpt: 'One of the oldest and most prestigious international fellowship awards supporting exceptional postgraduate degrees at Oxford University.',
    description: `## Overview\nThe Rhodes Scholarship is a fully funded, full-time postgraduate award which enables talented young people from around the world to study at the University of Oxford.\n\n## Benefits and Allocations\n- **Full Tuition Coverage:** Covers all college and university fees.\n- **Monthly Living Stipend:** Generous stipend to cover accommodation, food, and personal expenses.\n- **Travel Allowance:** Round-trip economy flight tickets.\n- **Global Network:** Access to an elite community of scholars worldwide.\n\n## Eligibility Criteria\n- Exceptional academic high-standing with a GPA of 3.8/4.0 or above.\n- Demonstrated integrity of character, leadership potential.\n- Under 27 years of age at the time of entry.`,
    category: 'Postgrad',
    amount: 55000,
    amountDisplay: '$55,000 / Year Package',
    deadline: '2026-10-15',
    applyUrl: 'https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/',
    eligibility: 'Must have min GPA of 3.8, leadership potential, age 18-27.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    tags: ['Oxford', 'Postgraduate', 'Fully Funded', 'UK'],
    views: 412,
    lastViewedAt: '2026-05-21T07:15:00Z',
    featured: true,
    country: 'UK',
    field: 'STEM',
    fundingType: 'Fully-Funded',
    demographic: 'International'
  },
  {
    id: 'stanford-knight-hennessy',
    title: 'Knight-Hennessy Scholars Program at Stanford',
    excerpt: 'A multidisciplinary scholarship program that empowers graduate leaders across all Stanford graduate schools and disciplines.',
    description: `## Overview\nKnight-Hennessy Scholars recruits, develops, and supports a diverse, multidisciplinary community of Stanford graduate students.\n\n## Financial Support Package\n- Comprehensive funding for up to three years of graduate education.\n- Generous stipend covering living and academic travel expenditures.\n- Leadership development workshops and exclusive guest speaker events.`,
    category: 'PhD',
    amount: 68000,
    amountDisplay: '$68,000 / Year + Tuition',
    deadline: '2026-10-08',
    applyUrl: 'https://knight-hennessy.stanford.edu/',
    eligibility: 'Acceptance into any Stanford graduate degree program.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1592066981608-a8975249a26b?auto=format&fit=crop&w=800&q=80',
    tags: ['Stanford', 'PhD / Graduate', 'USA', 'Leadership'],
    views: 298,
    lastViewedAt: '2026-05-20T18:30:12Z',
    featured: true,
    country: 'USA',
    field: 'STEM',
    fundingType: 'Fully-Funded',
    demographic: 'International'
  },
  {
    id: 'mit-undergrad-fully-funded',
    title: 'MIT International Excellence Undergraduate Award',
    excerpt: 'High-impact undergraduate grants aimed at global innovators and STEM prodigies regardless of financial constraints.',
    description: `## Scholarship Concept\nMIT believes that financial standing should never restrict the most brilliant minds from changing the world.\n\n## What is Provided\n- Full undergraduate academic tuition coverage for 4 full years.\n- Accommodation inside MIT campus residence halls.\n- Medical insurance coverage and laboratory experiment resources.`,
    category: 'Undergrad',
    amount: 82000,
    amountDisplay: '$82,000 / Year Need-Blind Coverage',
    deadline: '2026-11-01',
    applyUrl: 'https://mitadmissions.org/',
    eligibility: 'Olympiad participants, high SAT/ACT, international freshmen.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=80',
    tags: ['MIT', 'Undergraduate', 'USA', 'STEM'],
    views: 519,
    lastViewedAt: '2026-05-21T08:12:45Z',
    featured: true,
    country: 'USA',
    field: 'STEM',
    fundingType: 'Fully-Funded',
    demographic: 'International'
  },
  {
    id: 'gates-cambridge-fellowship',
    title: 'Gates Cambridge Fully Funded Scholarships',
    excerpt: 'Offering full-cost awards for outstanding applicants from outside the UK to pursue a full-time postgraduate degree at University of Cambridge.',
    description: `## About Gates Cambridge\nEstablished in 2000 with a $210 million donation from the Bill and Melinda Gates Foundation.\n\n## Scholarship Benefits\n- **University Composition Fee:** Full tuition coverage.\n- **Maintenance Allowance:** Over £20,000 living allowance per year.\n- **Airfare:** Economy air travel tickets.`,
    category: 'Fully-Funded',
    amount: 48000,
    amountDisplay: '£38,500 / Year Fully-Funded Allowance',
    deadline: '2026-12-05',
    applyUrl: 'https://www.gatescambridge.org/',
    eligibility: 'Non-UK citizens, outstanding intellectual ability, leadership capability.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    tags: ['Cambridge', 'Fully Funded', 'UK', 'Postgraduate'],
    views: 310,
    lastViewedAt: '2026-05-21T04:22:10Z',
    country: 'UK',
    field: 'STEM',
    fundingType: 'Fully-Funded',
    demographic: 'International'
  },
  {
    id: 'chevening-uk-fellowship',
    title: 'Chevening Scholarships — UK Government Fellowship',
    excerpt: 'The UK government\'s global scholarship programme, funded by the Foreign, Commonwealth and Development Office, offering fully funded master\'s degrees.',
    description: `## Overview\nChevening Scholarships are awarded to individuals with demonstrable leadership potential from around the world to study a one-year master's degree in the UK.\n\n## Benefits\n- Full tuition fees\n- Monthly living allowance\n- Return economy flights\n- Thesis/dissertation grant`,
    category: 'Postgrad',
    amount: 42000,
    amountDisplay: '£42,000 Full Coverage Package',
    deadline: '2026-11-05',
    applyUrl: 'https://www.chevening.org/',
    eligibility: 'Citizens of Chevening-eligible countries, 2+ years work experience.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    tags: ['UK', 'Postgraduate', 'Government', 'Leadership'],
    views: 287,
    lastViewedAt: '2026-05-20T14:10:00Z',
    country: 'UK',
    field: 'Social-Sciences',
    fundingType: 'Fully-Funded',
    demographic: 'International'
  },
  {
    id: 'daad-germany-scholarship',
    title: 'DAAD Graduate Scholarship Programme — Germany',
    excerpt: 'The German Academic Exchange Service offers scholarships for international students to pursue graduate studies at top German universities.',
    description: `## Overview\nDAAD scholarships support exceptionally qualified graduate students for studies at state or state-recognized German universities.\n\n## Financial Package\n- Monthly stipend of €934 (Master's) or €1,300 (PhD)\n- Health insurance contribution\n- Travel allowance\n- German language course funding`,
    category: 'Postgrad',
    amount: 35000,
    amountDisplay: '€934/month + Benefits',
    deadline: '2026-06-15',
    applyUrl: 'https://www.daad.de/en/',
    eligibility: 'International graduates with excellent academic record, bachelor\'s degree required.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
    tags: ['Germany', 'Europe', 'Postgraduate', 'DAAD'],
    views: 198,
    lastViewedAt: '2026-05-19T22:00:00Z',
    country: 'Europe',
    field: 'STEM',
    fundingType: 'Fully-Funded',
    demographic: 'International'
  },
  {
    id: 'fulbright-usa-program',
    title: 'Fulbright Foreign Student Program — USA',
    excerpt: 'The flagship international educational exchange program sponsored by the U.S. government for graduate students, young professionals, and artists.',
    description: `## Overview\nThe Fulbright Program provides grants for individually designed study/research projects or for English Teaching Assistantships.\n\n## Benefits\n- Full tuition and fees\n- Airfare and living stipend\n- Health and accident insurance\n- Fulbright enrichment activities`,
    category: 'Fully-Funded',
    amount: 60000,
    amountDisplay: '$60,000+ Full Sponsorship',
    deadline: '2026-06-01',
    applyUrl: 'https://foreign.fulbrightonline.org/',
    eligibility: 'Non-US citizens with bachelor\'s degree, strong academic record.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?auto=format&fit=crop&w=800&q=80',
    tags: ['USA', 'Fulbright', 'Fully Funded', 'Research'],
    views: 445,
    lastViewedAt: '2026-05-21T06:30:00Z',
    featured: true,
    country: 'USA',
    field: 'STEM',
    fundingType: 'Fully-Funded',
    demographic: 'International'
  },
  {
    id: 'aga-khan-foundation',
    title: 'Aga Khan Foundation International Scholarship',
    excerpt: 'Supporting outstanding students from developing countries who have no other means of financing their graduate studies.',
    description: `## Overview\nThe Aga Khan Foundation provides a limited number of scholarships each year for postgraduate studies to outstanding students.\n\n## Benefits\n- 50% grant and 50% loan arrangement\n- Covers tuition, living, and travel\n- Preference for master's-level studies`,
    category: 'Postgrad',
    amount: 30000,
    amountDisplay: '$30,000 Grant + Loan Package',
    deadline: '2026-06-20',
    applyUrl: 'https://www.akdn.org/our-agencies/aga-khan-foundation',
    eligibility: 'Citizens of select developing countries, proven financial need.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?auto=format&fit=crop&w=800&q=80',
    tags: ['Global', 'Developing Countries', 'Postgraduate', 'Need-Based'],
    views: 167,
    lastViewedAt: '2026-05-18T11:00:00Z',
    country: 'Global',
    field: 'Social-Sciences',
    fundingType: 'Partial',
    demographic: 'International'
  },
  {
    id: 'eth-zurich-excellence',
    title: 'ETH Zurich Excellence Scholarship & Opportunity Programme',
    excerpt: 'Highly competitive scholarship supporting exceptional master\'s students at one of the world\'s leading science and technology universities.',
    description: `## Overview\nThe ETH Zurich Excellence Scholarship supports students with excellent grades and outstanding potential.\n\n## Benefits\n- Full tuition waiver\n- Living allowance of CHF 12,000 per semester\n- Mentorship programme with ETH professors`,
    category: 'Postgrad',
    amount: 45000,
    amountDisplay: 'CHF 12,000/semester + Tuition',
    deadline: '2026-12-15',
    applyUrl: 'https://ethz.ch/students/en/studies/financial/scholarships.html',
    eligibility: 'Outstanding academic performance (top 10%), admitted to ETH Zurich master\'s programme.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?auto=format&fit=crop&w=800&q=80',
    tags: ['Switzerland', 'Europe', 'STEM', 'Master\'s'],
    views: 234,
    lastViewedAt: '2026-05-20T09:45:00Z',
    country: 'Europe',
    field: 'STEM',
    fundingType: 'Fully-Funded',
    demographic: 'International'
  },
  {
    id: 'mastercard-foundation-scholars',
    title: 'Mastercard Foundation Scholars Program',
    excerpt: 'Enabling academically talented yet economically disadvantaged young people from Africa to complete quality education at world-leading universities.',
    description: `## Overview\nThe Mastercard Foundation Scholars Program provides comprehensive scholarships to young Africans who demonstrate academic talent and leadership.\n\n## Benefits\n- Full tuition and accommodation\n- Books and supplies allowance\n- Travel costs\n- Mentorship and career support`,
    category: 'Undergrad',
    amount: 50000,
    amountDisplay: '$50,000 / Year Full Ride',
    deadline: '2026-09-30',
    applyUrl: 'https://mastercardfdn.org/all/scholars/',
    eligibility: 'Young Africans from economically disadvantaged backgrounds, strong academic record.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    tags: ['Africa', 'Undergraduate', 'Fully Funded', 'Leadership'],
    views: 389,
    lastViewedAt: '2026-05-21T05:00:00Z',
    country: 'Global',
    field: 'STEM',
    fundingType: 'Fully-Funded',
    demographic: 'First-Gen'
  },
  {
    id: 'japanese-mext-scholarship',
    title: 'MEXT Japanese Government Scholarship',
    excerpt: 'The Ministry of Education, Culture, Sports, Science and Technology of Japan offers scholarships to international students wishing to study in Japan.',
    description: `## Overview\nMEXT scholarships are offered by the Japanese Government to promote international cultural exchange and mutual understanding.\n\n## Benefits\n- Full tuition coverage at Japanese national universities\n- Monthly allowance of ¥143,000-¥145,000\n- Round-trip airfare\n- Japanese language training`,
    category: 'PhD',
    amount: 25000,
    amountDisplay: '¥145,000/month + Tuition',
    deadline: '2026-06-10',
    applyUrl: 'https://www.mext.go.jp/en/policy/education/highered/title02/detail02/sdetail02/1373897.htm',
    eligibility: 'Under 35 years old, bachelor\'s degree, interest in Japanese language/culture.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    tags: ['Japan', 'Asia', 'PhD / Graduate', 'Government'],
    views: 356,
    lastViewedAt: '2026-05-20T16:30:00Z',
    country: 'Asia',
    field: 'STEM',
    fundingType: 'Fully-Funded',
    demographic: 'International'
  },
  {
    id: 'australia-awards-scholarship',
    title: 'Australia Awards Scholarships',
    excerpt: 'Long-term development awards administered by the Department of Foreign Affairs and Trade, providing opportunities for study at Australian universities.',
    description: `## Overview\nAustralia Awards Scholarships are prestigious international scholarships funded by the Australian Government.\n\n## Benefits\n- Full tuition fees\n- Return air travel\n- Establishment allowance\n- Contribution to living expenses (AUD $3,000+/month)\n- Overseas Student Health Cover`,
    category: 'Postgrad',
    amount: 40000,
    amountDisplay: 'AUD $40,000+ / Year Package',
    deadline: '2026-07-01',
    applyUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards',
    eligibility: 'Citizens of eligible countries in Asia-Pacific, Africa, and the Middle East.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80',
    tags: ['Australia', 'Asia Pacific', 'Government', 'Postgraduate'],
    views: 203,
    lastViewedAt: '2026-05-19T20:15:00Z',
    country: 'Asia',
    field: 'Social-Sciences',
    fundingType: 'Fully-Funded',
    demographic: 'International'
  }
];

const PRE_POPULATED_RESOURCES: Resource[] = [
  {
    id: 'how-to-write-winning-scholarship-essay',
    title: '5 Secrets to Writing a Winning Scholarship Essay',
    excerpt: 'Your essay is your opportunity to stand out from the crowd. Learn the top techniques utilized by successful applicants.',
    content: `## The Art of the Scholarship Essay

Your scholarship essay is more than just a list of achievements; it is a narrative that explains your journey, your aspirations, and why you deserve funding. Review committees read hundreds of essays, so making yours memorable is crucial.

### 1. Hook the Reader from the Start
Do not start with "My name is... and I am applying for...". Start with a compelling anecdote, a powerful quote, or a defining moment that sparked your academic interest.

### 2. Answer the Prompt Directly
It sounds simple, but many applicants get carried away with unrelated achievements and forget to address the specific question asked.

### 3. Show, Don't Tell
Instead of saying "I am a hard worker," describe a time you worked 20 hours a week while maintaining a 4.0 GPA. Let your actions speak for your character.

### 4. Tailor Your Essay to the Provider
Research the organization offering the scholarship. What are their core values? Align your achievements and future goals with their mission.

### 5. Proofread and Polish
Grammatical errors or typos can instantly disqualify your application. Read your essay aloud, and have at least two other people review it.`,
    category: 'Tip',
    views: 1240,
    publishedAt: '2026-05-01T08:00:00Z',
    status: 'published'
  },
  {
    id: 'securing-stellar-letters-of-recommendation',
    title: 'Ultimate Guide to Securing Letters of Recommendation',
    excerpt: 'A step-by-step guide on how to choose referees, request references, and prepare materials to ensure you get a stellar recommendation.',
    content: `## How to Get Outstanding Recommendations

Letters of recommendation provide the selection panel with third-party verification of your academic potential, integrity, and work ethic. A generic letter can dilute an otherwise strong application, so strategic planning is essential.

### Who Should You Ask?
- **Academic Advisors/Professors:** Essential for academic and research-based scholarships.
- **Employers/Supervisors:** Great for professional or community service scholarships.
- **Mentors:** Can speak to your character, leadership, and personal growth.

### The Request Timeline
- **6 Weeks Before:** Identify your ideal recommenders.
- **4 Weeks Before:** Send a polite email or schedule a brief meeting to request the recommendation.
- **2 Weeks Before:** Send a friendly reminder and confirm that they have all the required links and instructions.

### Provide a Recommender Packet
To help your recommender write the strongest letter possible, provide them with a digital folder containing:
1. Your current CV/Resume.
2. A draft of your scholarship essay.
3. The prompt/criteria of the scholarship.
4. Clear instructions on how and where to submit the letter.
5. The final deadline highlighted in bold.`,
    category: 'Guide',
    views: 852,
    publishedAt: '2026-05-10T10:30:00Z',
    status: 'published'
  },
  {
    id: 'frequently-asked-scholarship-faqs',
    title: 'Demystifying Academic Funding: Frequently Asked Questions',
    excerpt: 'Find answers to the most common questions regarding eligibility, funding types, tax implications, and application procedures.',
    content: `## Scholarship Frequently Asked Questions

Understanding the landscape of academic funding can prevent costly mistakes. Here are answers to the questions our team receives most frequently.

### Q: Can I apply for multiple scholarships simultaneously?
**A:** Yes, absolutely. In fact, we recommend applying to as many scholarships as you qualify for to maximize your chances. Just ensure you customize each application.

### Q: What is the difference between Fully-Funded and Partial Scholarships?
**A:** A *Fully-Funded* scholarship covers 100% of your tuition, and typically includes a monthly living stipend, health insurance, and travel allowances. A *Partial* scholarship covers a portion of your tuition (e.g., $10,000) or specific fees, requiring you to cover the rest.

### Q: Are scholarship awards taxable?
**A:** This depends heavily on your country. In many jurisdictions (like the USA and UK), scholarships used directly for tuition, fees, books, and course equipment are tax-free. However, amounts used for room and board, travel, or living stipends may be subject to income tax. Always consult a tax professional.

### Q: Can international students apply for domestic scholarships?
**A:** Check the eligibility criteria. Some scholarships are strictly reserved for citizens of the host country, while others (like the Rhodes or Fulbright) are specifically designed for international students to study abroad.`,
    category: 'FAQ',
    views: 641,
    publishedAt: '2026-05-15T14:00:00Z',
    status: 'published'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ScholarshipService {
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private storage: FirebaseStorage | null = null;
  
  // Custom User access dynamic registry whitelist for roles demo/validation
  public authorizedUsers = signal<WhitelistedUser[]>([
    { email: 'aliyusahmad2020@gmail.com', role: 'super-admin', password: 'Update@26', blocked: false },
    { email: 'aliyusahmad01@gmail.com', role: 'super-admin', password: 'AdminPassword123!', blocked: false },
    { email: 'student.admin@gmail.com', role: 'super-admin', password: 'AdminPassword123!', blocked: false },
    { email: 'editor.test@gmail.com', role: 'content-editor', password: 'EditorPassword123!', blocked: false },
    { email: 'academic.editor@scholarshiphub.com', role: 'content-editor', password: 'EditorPassword123!', blocked: false }
  ]);

  public resources = signal<Resource[]>([]);
  public isStateLoaded = signal<boolean>(false);

  // States declared in public Signals
  public isFirebaseEnabled = signal<boolean>(false);
  public isFirecrawlEnabled = signal<boolean>(false);
  public ga4MeasurementId = signal<string>('');
  public googleSiteVerification = signal<string>('');
  
  public scholarships = signal<Scholarship[]>([]);
  public newsletterSubscriptions = signal<Subscriber[]>([]);
  public currentUser = signal<LoggedUser | null>(null);
  public autoDrafts = signal<Scholarship[]>([]);

  public async fetchCrawlerHealthStatus(): Promise<void> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        this.isFirecrawlEnabled.set(!!data.firecrawlEnabled);
      }
    } catch (err) {
      this.isFirecrawlEnabled.set(false);
    }
  }

  public async fetchAutoDrafts(): Promise<void> {
    try {
      const res = await fetch('/api/auto-drafts');
      if (res.ok) {
        const data = await res.json();
        this.autoDrafts.set(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Failed to fetch auto-drafts:', err);
    }
  }

  public async approveAutoDraft(item: Scholarship): Promise<void> {
    let finalId = item.id;
    let count = 1;
    while (this.getScholarshipById(finalId)) {
      finalId = `${item.id}-${count}`;
      count++;
    }
    const payload: Scholarship = {
      ...item,
      id: finalId,
      status: 'draft',
      views: 0
    };

    await this.addScholarship(payload);

    try {
      const res = await fetch('/api/auto-drafts/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      });
      if (res.ok) {
        this.autoDrafts.update(current => current.filter(o => o.id !== item.id));
      }
    } catch (err) {
      console.warn('Failed to clear approved auto-draft from backend cache:', err);
    }
  }

  public async dismissAutoDraft(id: string): Promise<void> {
    try {
      const res = await fetch('/api/auto-drafts/dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        this.autoDrafts.update(current => current.filter(o => o.id !== id));
        this.showToast('info', 'Opportunity Dismissed', 'Auto-discovered opportunity has been dismissed.');
      }
    } catch (err) {
      console.warn('Failed to dismiss auto-draft:', err);
      this.showToast('error', 'Dismiss Operation Failed', 'Failed to dismiss discovered opportunity draft.');
    }
  }

  // Dynamic Categories and Tags taxonomy signals
  public categories = signal<string[]>(['Fully-Funded', 'Partial', 'Undergrad', 'Postgrad', 'PhD', 'Postdoc', 'STEM', 'Arts', 'Business', 'Medicine', 'Law', 'Social-Sciences', 'Tuition-Waiver', 'Stipend']);
  public tags = signal<string[]>(['Oxford', 'Postgraduate', 'Fully Funded', 'UK', 'Stanford', 'PhD / Graduate', 'USA', 'Leadership', 'MIT', 'Undergraduate', 'STEM', 'Cambridge', 'Europe', 'Germany', 'DAAD', 'Fulbright', 'Research', 'Global', 'Developing Countries', 'Need-Based', 'Switzerland', 'Africa', 'Japan', 'Asia', 'Government', 'Australia', 'Asia Pacific']);

  // Computed signals for homepage sections
  public featuredScholarships = computed(() => 
    this.scholarships().filter(s => s.status === 'published' && s.featured)
  );

  public closingSoonScholarships = computed(() => {
    const now = Date.now();
    return this.scholarships()
      .filter(s => s.status === 'published')
      .filter(s => {
        const deadline = new Date(s.deadline).getTime();
        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        return daysLeft > 0 && daysLeft <= 60;
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  });

  public trendingScholarships = computed(() =>
    this.scholarships()
      .filter(s => s.status === 'published')
      .sort((a, b) => b.views - a.views)
      .slice(0, 6)
  );

  // Ad monetization tracking signals
  public adProviders = signal<AdProvider[]>([
    { id: 'adsense', name: 'Google AdSense', enabled: true, placements: { leaderboard: true, sidebar: true, inFeed: true }, credentials: { publisherId: '', slotId: '' } },
    { id: 'ezoic', name: 'Ezoic', enabled: false, placements: { leaderboard: true, sidebar: true, inFeed: false }, credentials: { publisherId: '', siteId: '' } },
    { id: 'mediavine', name: 'Mediavine', enabled: false, placements: { leaderboard: false, sidebar: true, inFeed: true }, credentials: { publisherId: '', siteId: '' } },
    { id: 'adsterra', name: 'Adsterra', enabled: false, placements: { leaderboard: true, sidebar: false, inFeed: true }, credentials: { publisherId: '', bannerId: '' } }
  ]);

  public estimatedEarnings = signal<AdEarningsData>({
    today: 0,
    yesterday: 0,
    month: 0,
    impressions: 0,
    clicks: 0,
    views: 0,
    ecpm: 2.50,
    trend: []
  });

  public toasts = signal<AppToast[]>([]);

  // Bulk add helper
  public async addDraftScholarships(items: Scholarship[]): Promise<void> {
    const list = [...this.scholarships()];
    const added: string[] = [];
    
    for (const item of items) {
      // Ensure unique ID
      let finalId = item.id;
      let count = 1;
      while (list.some(s => s.id === finalId)) {
        finalId = `${item.id}-${count}`;
        count++;
      }
      const newItem = { ...item, id: finalId, status: 'draft' as const, views: 0 };
      list.push(newItem);
      added.push(newItem.title);
      
      if (this.isFirebaseEnabled() && this.db) {
        try {
          const docRef = doc(this.db, 'scholarships', newItem.id);
          await setDoc(docRef, newItem);
        } catch (err) {
          console.warn(`Failed to sync bulk draft item "${newItem.title}" to Firebase:`, err);
        }
      }
    }
    
    this.scholarships.set(list);
    this.saveToLocalState(list);
    this.showToast('success', 'Drafts Saved', `Successfully imported ${items.length} new draft opportunities: ${added.join(', ')}`);
  }

  // Update ad provider config
  public async updateAdProviderSettings(providerId: string, updated: Partial<AdProvider>, showToast = true): Promise<void> {
    const providers = this.adProviders().map(p => {
      if (p.id === providerId) {
        const nextEnabled = updated.enabled !== undefined ? updated.enabled : p.enabled;
        return { ...p, ...updated, enabled: nextEnabled };
      } else {
        if (updated.enabled === true) {
          return { ...p, enabled: false };
        }
        return p;
      }
    });
    this.adProviders.set(providers);
    localStorage.setItem('ad_provider_settings', JSON.stringify(providers));

    if (this.isFirebaseEnabled() && this.db) {
      try {
        const docRef = doc(this.db, 'config', 'ads');
        await setDoc(docRef, { providers });
      } catch (err) {
        console.warn('Failed to sync ad provider settings to Firestore:', err);
      }
    }

    if (showToast) {
      this.showToast('success', 'Ad Monetization Configured', `Ad provider settings updated successfully.`);
    }
  }

  public showToast(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, durationMs = 6000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: AppToast = { id, type, title, message, durationMs };
    this.toasts.update(current => [...current, newToast]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismissToast(id);
      }, durationMs);
    }
  }

  public dismissToast(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  constructor() {
    this.bootService();
  }

  private async bootService(): Promise<void> {
    await this.loadPublicIntegrations();
    let config = firebaseConfig;
    
    try {
      const res = await fetch('/api/firebase-config');
      if (res.ok) {
        const serverConfig = await res.json();
        if (serverConfig && serverConfig.projectId && !serverConfig.projectId.includes('mock-applet')) {
          config = serverConfig;
        }
      }
    } catch (e) {
      console.warn('Failed to load dynamic Firebase config from server, falling back to local static JSON', e);
    }

    // Check if the firebase credentials are real (not placeholder default values)
    const hasRealId = config.projectId && !config.projectId.includes('mock-applet');
    const hasRealKey = config.apiKey && !config.apiKey.includes('mock-api-key');
    
    if (hasRealId && hasRealKey) {
      try {
        const app = initializeApp(config);
        this.db = getFirestore(app, config.firestoreDatabaseId);
        this.auth = getAuth(app);
        this.storage = getStorage(app);
        this.isFirebaseEnabled.set(true);

        // Test Firebase DB immediately for active connection tracking as required by rule
        this.testConnection();

        // Listen to Auth State
        onAuthStateChanged(this.auth, async (user) => {
          if (user) {
            const email = user.email?.toLowerCase().trim() || '';
            const match = this.authorizedUsers().find(u => u.email.toLowerCase() === email);
            const isWhitelisted = !!match;
            const isBlocked = match?.blocked || false;
            
            if (!isWhitelisted || isBlocked) {
              await signOut(this.auth!);
              this.currentUser.set(null);
              this.showToast('error', 'Access Denied', isBlocked ? 'Your administrative clearance has been blocked.' : 'This email address is not whitelisted.');
              return;
            }

            const role = match ? match.role : 'content-editor';
            this.currentUser.set({
              uid: user.uid,
              email: user.email,
              displayName: role === 'super-admin' ? 'Super-Admin Personnel' : 'Content Editor',
              photoURL: user.photoURL,
              role: role
            });
            // Auto sync DB state when logged in
            this.loadScholarshipsState();
          } else {
            this.currentUser.set(null);
          }
        });
      } catch (err) {
        console.warn('Firebase initialization deferred. Proceeding with robust Client-Side storage.', err);
        this.isFirebaseEnabled.set(false);
      }
    } else {
      console.log('Using robust Client-Side Mock storage. firebase-applet-config contains placeholder attributes.');
      this.isFirebaseEnabled.set(false);
    }

    this.loadScholarshipsState();
  }

  // Connection validation as demanded in instructions
  private async testConnection(): Promise<void> {
    if (!this.db) return;
    try {
      await getDocFromServer(doc(this.db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration or network.");
      }
    }
  }

  // Error Handler utility as strictly enforced in guidelines
  private handleFirebaseError(error: unknown, operationType: OperationType, path: string | null): never {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: this.auth?.currentUser?.uid ?? null,
        email: this.auth?.currentUser?.email ?? null,
        emailVerified: this.auth?.currentUser?.emailVerified ?? null,
        isAnonymous: this.auth?.currentUser?.isAnonymous ?? null,
        tenantId: this.auth?.currentUser?.tenantId ?? null,
        providerInfo: this.auth?.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    };

    console.error('Firestore Hardened Error Log: ', JSON.stringify(errInfo));

    // Formulate a beautiful, descriptive, user-friendly security notification
    let friendlyMessage = 'An unexpected database error occurred while registering your changes. Please retry.';
    let errorTitle = 'Database Operation Failed';

    const errMsg = errInfo.error.toLowerCase();
    if (errMsg.includes('permission-denied') || errMsg.includes('insufficient permissions')) {
      errorTitle = 'Database Access Denied';
      if (!this.currentUser()) {
        friendlyMessage = 'You are currently in local guest administrator mode. To write live updates, please finish Google authentication first.';
      } else if (this.currentUser() && !this.currentUser()?.email) {
        friendlyMessage = 'Your current authentication profile does not carry valid email addresses associated with verified admins.';
      } else {
        friendlyMessage = `Firewall security guard rejected '${operationType}' on sub-route '/${path}'. Verify authorized administrative access limits.`;
      }
    } else if (errMsg.includes('offline') || errMsg.includes('network')) {
      errorTitle = 'Network Connection Offline';
      friendlyMessage = 'Connection lost. Edits are buffered locally and will be synchronized once internet presence resumes.';
    } else if (errMsg.includes('quota exceeded')) {
      errorTitle = 'Database Quota Expired';
      friendlyMessage = 'Cloud storage limits exceeded for today. Firebase Spark tier resets database queries every 24 hours.';
    }

    this.showToast('error', errorTitle, friendlyMessage, 8000);

    throw new Error(JSON.stringify(errInfo));
  }

  // Core Sync state loader
  private async loadScholarshipsState(): Promise<void> {
    // Categories loader from local storage
    const localCategories = localStorage.getItem('scholarship_categories');
    if (localCategories) {
      try {
        this.categories.set(JSON.parse(localCategories));
      } catch (err) { }
    }

    // Tags loader from local storage
    const localTags = localStorage.getItem('scholarship_tags');
    if (localTags) {
      try {
        this.tags.set(JSON.parse(localTags));
      } catch (err) { }
    }

    // Load ad providers from local storage
    const localAds = localStorage.getItem('ad_provider_settings');
    if (localAds) {
      try {
        this.adProviders.set(JSON.parse(localAds));
      } catch (err) { }
    }

    // Load local storage first
    let listToLoad = PRE_POPULATED_SCHOLARSHIPS;
    const localSaved = localStorage.getItem('scholarship_index');
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          listToLoad = parsed;
        }
      } catch {
        listToLoad = PRE_POPULATED_SCHOLARSHIPS;
      }
    }
    this.scholarships.set(listToLoad);

    // Load local storage users
    let usersToLoad = this.authorizedUsers();
    const localUsers = localStorage.getItem('authorized_users');
    if (localUsers) {
      try {
        const parsed = JSON.parse(localUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          usersToLoad = parsed;
        }
      } catch (err) { }
    }
    this.authorizedUsers.set(usersToLoad);

    // Load local storage resources
    let resToLoad = PRE_POPULATED_RESOURCES;
    const localResources = localStorage.getItem('resources_index');
    if (localResources) {
      try {
        const parsed = JSON.parse(localResources);
        if (Array.isArray(parsed) && parsed.length > 0) {
          resToLoad = parsed;
        }
      } catch (err) { }
    }
    this.resources.set(resToLoad);

    // Subscribers loader
    const localSubs = localStorage.getItem('subscribers_index');
    if (localSubs) {
      try {
        this.newsletterSubscriptions.set(JSON.parse(localSubs));
      } catch {
        this.newsletterSubscriptions.set([]);
      }
    }

    // Try firebase is active
    if (this.isFirebaseEnabled() && this.db) {
      try {
        // Load taxonomy config from Firebase if available
        try {
          const docRef = doc(this.db, 'config', 'taxonomy');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data) {
              const cats = data['categories'];
              const tgs = data['tags'];
              if (Array.isArray(cats)) {
                this.categories.set(cats);
                localStorage.setItem('scholarship_categories', JSON.stringify(cats));
              }
              if (Array.isArray(tgs)) {
                this.tags.set(tgs);
                localStorage.setItem('scholarship_tags', JSON.stringify(tgs));
              }
            }
          }
        } catch (taxErr) {
          console.warn('Firebase taxonomy load failed', taxErr);
        }

        // Load users config from Firebase if available
        try {
          const usersRef = doc(this.db, 'config', 'users');
          const usersSnap = await getDoc(usersRef);
          if (usersSnap.exists()) {
            const data = usersSnap.data();
            if (data && Array.isArray(data['users'])) {
              this.authorizedUsers.set(data['users']);
              localStorage.setItem('authorized_users', JSON.stringify(data['users']));
              
              // Sync current user role/blocked state from the loaded whitelist
              const current = this.currentUser();
              if (current) {
                const email = current.email?.toLowerCase().trim() || '';
                const match = data['users'].find((u: any) => u.email.toLowerCase() === email);
                if (match) {
                  if (match.blocked) {
                    this.logout();
                  } else if (current.role !== match.role) {
                    this.currentUser.set({
                      ...current,
                      role: match.role,
                      displayName: match.role === 'super-admin' ? 'Super-Admin Personnel' : 'Content Editor'
                    });
                  }
                }
              }
            }
          } else {
            console.log('Firebase users config is empty. Seeding default authorized users...');
            const defaultUsers = this.authorizedUsers();
            const superAdmins = defaultUsers.filter(u => u.role === 'super-admin').map(u => u.email.toLowerCase().trim());
            const userEmails = defaultUsers.map(u => u.email.toLowerCase().trim());
            const usersDocData = {
              userEmails: userEmails,
              superAdminEmails: superAdmins,
              blockedEmails: [],
              users: defaultUsers
            };
            try {
              await setDoc(usersRef, usersDocData);
              console.log('SUCCESS: Seeded config/users document in Firestore!');
            } catch (seedErr) {
              console.error('FAIL: Error seeding config/users to Firestore:', seedErr);
            }
            localStorage.setItem('authorized_users', JSON.stringify(defaultUsers));
          }
        } catch (usersErr) {
          console.warn('Firebase users configuration load failed', usersErr);
        }

        // Load resources from Firebase if available
        try {
          const queryResult = await getDocs(collection(this.db, 'resources'));
          const dbResources: Resource[] = [];
          queryResult.forEach((docRef) => {
            dbResources.push(docRef.data() as Resource);
          });
          if (dbResources.length > 0) {
            this.resources.set(dbResources);
            localStorage.setItem('resources_index', JSON.stringify(dbResources));
          } else {
            console.log('Firebase resources collection is empty. Seeding pre-populated resources...');
            for (const res of PRE_POPULATED_RESOURCES) {
              const docRef = doc(this.db, 'resources', res.id);
              await setDoc(docRef, res);
            }
            this.resources.set(PRE_POPULATED_RESOURCES);
            localStorage.setItem('resources_index', JSON.stringify(PRE_POPULATED_RESOURCES));
          }
        } catch (resErr) {
          console.warn('Firebase resources load failed', resErr);
        }

        // Load ads config from Firebase if available
        try {
          const adsRef = doc(this.db, 'config', 'ads');
          const adsSnap = await getDoc(adsRef);
          if (adsSnap.exists()) {
            const data = adsSnap.data();
            if (data && Array.isArray(data['providers'])) {
              this.adProviders.set(data['providers']);
              localStorage.setItem('ad_provider_settings', JSON.stringify(data['providers']));
            }
          } else {
            console.log('Firebase ads config is empty. Seeding default ad providers...');
            const defaultAds = this.adProviders();
            await setDoc(adsRef, { providers: defaultAds });
            localStorage.setItem('ad_provider_settings', JSON.stringify(defaultAds));
          }
        } catch (adsErr) {
          console.warn('Firebase ads configuration load failed', adsErr);
        }

        const queryResult = await getDocs(collection(this.db, 'scholarships'));
        const dbItems: Scholarship[] = [];
        queryResult.forEach((docRef) => {
          dbItems.push(docRef.data() as Scholarship);
        });
        if (dbItems.length > 0) {
          this.scholarships.set(dbItems);
          this.saveToLocalState(dbItems);
        } else {
          console.log('Firebase scholarships collection is empty. Seeding pre-populated scholarships...');
          for (const s of PRE_POPULATED_SCHOLARSHIPS) {
            const docRef = doc(this.db, 'scholarships', s.id);
            await setDoc(docRef, s);
          }
          this.scholarships.set(PRE_POPULATED_SCHOLARSHIPS);
          this.saveToLocalState(PRE_POPULATED_SCHOLARSHIPS);
        }
      } catch (err) {
        console.warn('Real Firebase fetch failed. Using storage fallback.', err);
      }
    }
    await this.loadAnalyticsState();
    this.isStateLoaded.set(true);
  }

  private saveToLocalState(items: Scholarship[]): void {
    localStorage.setItem('scholarship_index', JSON.stringify(items));
  }

  // Core public selectors
  public getScholarshipById(id: string): Scholarship | undefined {
    return this.scholarships().find(s => s.id === id);
  }

  public getPublishedScholarships(): Scholarship[] {
    return this.scholarships().filter(s => s.status === 'published');
  }

  // Increase view count helper
  public async incrementViews(id: string): Promise<void> {
    const list = [...this.scholarships()];
    const itemIndex = list.findIndex(s => s.id === id);
    if (itemIndex > -1) {
      const nowString = new Date().toISOString();
      list[itemIndex].views += 1;
      list[itemIndex].lastViewedAt = nowString;
      this.scholarships.set(list);
      this.saveToLocalState(list);

      if (this.isFirebaseEnabled() && this.db) {
        try {
          const docRef = doc(this.db, 'scholarships', id);
          await updateDoc(docRef, { 
            views: list[itemIndex].views,
            lastViewedAt: nowString
          });
        } catch (error) {
          // Gracefully continue; non-critical view count update
        }
      }
    }
  }

  // Whitelisted emails list for secure CMS operations verification
  public isAuthorizedAdmin(): boolean {
    const guestUser = this.currentUser();
    if (!guestUser) return false;
    if (guestUser.blocked === true) return false;
    
    // Whitelist rules: specific active admin email or domain
    const email = guestUser.email?.toLowerCase().trim() || '';
    const matchingUser = this.authorizedUsers().find(u => u.email.toLowerCase() === email);
    if (!matchingUser) return false;
    return !matchingUser.blocked;
  }

  public isSuperAdmin(): boolean {
    const guestUser = this.currentUser();
    if (!guestUser) return false;
    if (guestUser.blocked === true) return false;
    if (guestUser.role === 'super-admin') return true;
    
    const email = guestUser.email?.toLowerCase().trim() || '';
    const matchingUser = this.authorizedUsers().find(u => u.email.toLowerCase() === email);
    if (!matchingUser) return false;
    return matchingUser.role === 'super-admin' && !matchingUser.blocked;
  }

  private async syncUsersToFirebaseAndLocal(): Promise<void> {
    const users = this.authorizedUsers();
    localStorage.setItem('authorized_users', JSON.stringify(users));
    if (this.isFirebaseEnabled() && this.db) {
      try {
        const docRef = doc(this.db, 'config', 'users');
        const userEmails = users.map(u => u.email.toLowerCase().trim());
        const superAdminEmails = users.filter(u => u.role === 'super-admin').map(u => u.email.toLowerCase().trim());
        const blockedEmails = users.filter(u => u.blocked).map(u => u.email.toLowerCase().trim());
        
        await setDoc(docRef, { 
          users,
          userEmails,
          superAdminEmails,
          blockedEmails
        });
      } catch (err) {
        console.warn('Firebase sync users failed', err);
      }
    }
  }

  public addAuthorizedUser(email: string, role: 'super-admin' | 'content-editor', password?: string): boolean {
    const freshEmail = email.toLowerCase().trim();
    if (!freshEmail) return false;
    if (!this.authorizedUsers().some(u => u.email === freshEmail)) {
      const newUser: WhitelistedUser = { 
        email: freshEmail, 
        role, 
        password: password || 'DefaultPassword123!', 
        blocked: false 
      };
      this.authorizedUsers.update(list => [...list, newUser]);
      this.syncUsersToFirebaseAndLocal();
      return true;
    }
    return false;
  }

  public updateAuthorizedUser(email: string, updated: Partial<WhitelistedUser>): void {
    const freshEmail = email.toLowerCase().trim();
    
    // Safety guard: prevent logged-in admins from blocking themselves or demoting their own roles
    const activeAdmin = this.currentUser();
    if (activeAdmin && freshEmail === activeAdmin.email?.toLowerCase().trim()) {
      if (updated.blocked !== undefined) updated.blocked = false;
      if (updated.role !== undefined) updated.role = activeAdmin.role;
    }

    this.authorizedUsers.update(list => list.map(u => {
      if (u.email.toLowerCase() === freshEmail) {
        const next = { ...u };
        if (updated.email !== undefined) next.email = updated.email.toLowerCase().trim();
        if (updated.role !== undefined) next.role = updated.role;
        if (updated.password !== undefined && updated.password !== '') next.password = updated.password;
        if (updated.blocked !== undefined) next.blocked = updated.blocked;
        return next;
      }
      return u;
    }));
    this.syncUsersToFirebaseAndLocal();

    // If active logged-in user got updated (e.g. blocked status or role changed), sync current user state too
    const current = this.currentUser();
    if (current && current.email?.toLowerCase().trim() === freshEmail) {
      const targetEmail = updated.email?.toLowerCase().trim() || freshEmail;
      const freshUserRecord = this.authorizedUsers().find(u => u.email.toLowerCase() === targetEmail);
      if (freshUserRecord) {
        if (freshUserRecord.blocked) {
          this.logout();
        } else {
          this.currentUser.set({
            ...current,
            email: freshUserRecord.email,
            role: freshUserRecord.role,
            blocked: freshUserRecord.blocked
          });
        }
      }
    }
  }

  public removeAuthorizedUser(email: string): void {
    const freshEmail = email.toLowerCase().trim();
    // Safety guard: prevent logged-in admins from deleting themselves to avoid self lockout
    const activeAdmin = this.currentUser();
    if (activeAdmin && freshEmail === activeAdmin.email?.toLowerCase().trim()) {
      this.showToast('error', 'Action Blocked', 'You cannot remove your own active administrator profile.');
      return;
    }
    this.authorizedUsers.update(list => list.filter(u => u.email !== freshEmail));
    this.syncUsersToFirebaseAndLocal();
  }

  public async loginWithEmailAndPassword(email: string, password: string): Promise<void> {
    const targetEmail = email.toLowerCase().trim();
    const userList = this.authorizedUsers();
    const userRecord = userList.find(u => u.email.toLowerCase() === targetEmail);
    
    if (!userRecord) {
      throw new Error('This email address is not whitelisted. Access denied.');
    }
    if (userRecord.blocked) {
      throw new Error('Your administrative clearance has been blocked by the Super-Admin.');
    }
    
    const userPassword = userRecord.password || 'AdminPassword123!';
    if (password !== userPassword) {
      throw new Error('Incorrect credentials. Please verify your password.');
    }

    this.currentUser.set({
      uid: `email_login_${targetEmail.replace(/[^a-z0-9]/g, '_')}`,
      email: userRecord.email,
      displayName: userRecord.role === 'super-admin' ? 'Super-Admin Personnel' : 'Content Editor',
      photoURL: null,
      role: userRecord.role,
      blocked: false
    });
  }

  // --- Resource Management CRUD Methods ---
  public async addResource(item: Resource): Promise<void> {
    const currentList = [...this.resources(), item];
    this.resources.set(currentList);
    localStorage.setItem('resources_index', JSON.stringify(currentList));
    if (this.isFirebaseEnabled() && this.db) {
      try {
        const docRef = doc(this.db, 'resources', item.id);
        await setDoc(docRef, item);
        this.showToast('success', 'Resource Created', `Successfully synced "${item.title}" to database.`);
      } catch (err) {
        console.warn('Firebase add resource failed', err);
      }
    } else {
      this.showToast('success', 'Resource Saved', `Saved "${item.title}" to local session.`);
    }
  }

  public async updateResource(id: string, updated: Partial<Resource>): Promise<void> {
    const list = [...this.resources()];
    const index = list.findIndex(r => r.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...updated } as Resource;
      this.resources.set(list);
      localStorage.setItem('resources_index', JSON.stringify(list));
      if (this.isFirebaseEnabled() && this.db) {
        try {
          const docRef = doc(this.db, 'resources', id);
          await updateDoc(docRef, updated);
          this.showToast('success', 'Resource Updated', `Successfully synchronized resource updates.`);
        } catch (err) {
          console.warn('Firebase update resource failed', err);
        }
      } else {
        this.showToast('success', 'Resource Saved', 'Updated resource locally.');
      }
    }
  }

  public async deleteResource(id: string): Promise<void> {
    const itemToDelete = this.resources().find(r => r.id === id);
    const list = this.resources().filter(r => r.id !== id);
    this.resources.set(list);
    localStorage.setItem('resources_index', JSON.stringify(list));
    if (this.isFirebaseEnabled() && this.db) {
      try {
        const docRef = doc(this.db, 'resources', id);
        await deleteDoc(docRef);
        this.showToast('success', 'Resource Deleted', `Successfully deleted resource.`);
      } catch (err) {
        console.warn('Firebase delete resource failed', err);
      }
    } else {
      this.showToast('success', 'Resource Deleted', `Removed resource locally.`);
    }
  }

  public async incrementResourceViews(id: string): Promise<void> {
    const list = [...this.resources()];
    const index = list.findIndex(r => r.id === id);
    if (index > -1) {
      list[index].views += 1;
      this.resources.set(list);
      localStorage.setItem('resources_index', JSON.stringify(list));
      if (this.isFirebaseEnabled() && this.db) {
        try {
          const docRef = doc(this.db, 'resources', id);
          await updateDoc(docRef, { views: list[index].views });
        } catch (err) { }
      }
    }
  }

  // Firebase Google OAuth Popups with robust client fallbacks
  public async loginWithGoogle(): Promise<void> {
    if (this.isFirebaseEnabled() && this.auth) {
      try {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(this.auth, provider);
        const user = res.user;
        const email = user.email?.toLowerCase().trim() || '';
        const match = this.authorizedUsers().find(u => u.email.toLowerCase() === email);
        
        const isWhitelisted = !!match;
        const isBlocked = match?.blocked || false;
        
        if (!isWhitelisted) {
          await signOut(this.auth);
          this.currentUser.set(null);
          throw new Error('This Google account is not on our pre-authorized Administrator whitelist list.');
        }
        if (isBlocked) {
          await signOut(this.auth);
          this.currentUser.set(null);
          throw new Error('Your administrative clearance has been blocked by the Super-Admin.');
        }

        const role = match ? match.role : 'content-editor';
        this.currentUser.set({
          uid: user.uid,
          email: user.email,
          displayName: role === 'super-admin' ? 'Super-Admin Personnel' : 'Content Editor',
          photoURL: user.photoURL,
          role: role
        });
      } catch (err) {
        throw err; // bubble up for custom banner report
      }
    } else {
      throw new Error('REAL_FIREBASE_NOT_CONFIGURED');
    }
  }

  public async logout(): Promise<void> {
    this.currentUser.set(null);
    if (this.isFirebaseEnabled() && this.auth) {
      await signOut(this.auth);
    }
  }

  // CRUD Publications logic
  public async addScholarship(item: Scholarship): Promise<void> {
    const currentList = [...this.scholarships(), item];
    this.scholarships.set(currentList);
    this.saveToLocalState(currentList);

    // If this item exists in background autoDrafts queue, clear it from backend auto-drafts cache
    if (this.autoDrafts().some(d => d.id === item.id)) {
      try {
        await fetch('/api/auto-drafts/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id })
        });
        this.autoDrafts.update(current => current.filter(o => o.id !== item.id));
      } catch (err) {
        console.warn('Failed to clear auto-draft on direct save:', err);
      }
    }

    if (this.isFirebaseEnabled() && this.db) {
      const pathStr = `scholarships/${item.id}`;
      try {
        const docRef = doc(this.db, 'scholarships', item.id);
        await setDoc(docRef, item);
        this.showToast('success', 'Publication Synced', `Successfully registered "${item.title}" live inside Firestore.`);
      } catch (error) {
        this.handleFirebaseError(error, OperationType.CREATE, pathStr);
      }
    } else {
      this.showToast('success', 'Demo Index Saved', `Saved "${item.title}" within local browser storage buffer (Firebase bypass active).`);
    }
  }

  public async updateScholarship(id: string, updated: Partial<Scholarship>): Promise<void> {
    const list = [...this.scholarships()];
    const index = list.findIndex(s => s.id === id);
    if (index > -1) {
      const originalTitle = list[index].title;
      list[index] = { ...list[index], ...updated } as Scholarship;
      this.scholarships.set(list);
      this.saveToLocalState(list);

      // If this item exists in background autoDrafts queue, clear it from backend auto-drafts cache
      if (this.autoDrafts().some(d => d.id === id)) {
        try {
          await fetch('/api/auto-drafts/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
          this.autoDrafts.update(current => current.filter(o => o.id !== id));
        } catch (err) {
          console.warn('Failed to clear auto-draft on update:', err);
        }
      }

      if (this.isFirebaseEnabled() && this.db) {
        const pathStr = `scholarships/${id}`;
        try {
          const docRef = doc(this.db, 'scholarships', id);
          await updateDoc(docRef, updated);
          this.showToast('success', 'Changes Synchronized', `Successfully finalized updates for "${updated.title || originalTitle}" inside Firestore.`);
        } catch (error) {
          this.handleFirebaseError(error, OperationType.UPDATE, pathStr);
        }
      } else {
        this.showToast('success', 'Changes Saved locally', `Successfully resolved update logs for "${updated.title || originalTitle}" locally.`);
      }
    }
  }

  public async deleteScholarship(id: string): Promise<void> {
    const itemToDelete = this.scholarships().find(s => s.id === id);
    const filter = this.scholarships().filter(s => s.id !== id);
    this.scholarships.set(filter);
    this.saveToLocalState(filter);

    if (this.isFirebaseEnabled() && this.db) {
      const pathStr = `scholarships/${id}`;
      try {
        const docRef = doc(this.db, 'scholarships', id);
        await deleteDoc(docRef);
        this.showToast('success', 'Publication Deleted', `Purged scholarship "${itemToDelete?.title || id}" from Firestore index.`);
      } catch (error) {
        this.handleFirebaseError(error, OperationType.DELETE, pathStr);
      }
    } else {
      this.showToast('success', 'Opportunity Cleared', `Removed and deleted "${itemToDelete?.title || id}" from local database memory.`);
    }
  }

  // Newsletter Subscribers trigger
  public async subscribeEmail(email: string): Promise<void> {
    const trimmed = email.trim();
    if (!trimmed) return;

    const subs = [...this.newsletterSubscriptions()];
    if (subs.some(s => s.email.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error('This email is already registered on our Priority Alerts list.');
    }

    const newSub: Subscriber = {
      email: trimmed,
      subscribedAt: new Date().toISOString()
    };
    
    const updatedSubs = [...subs, newSub];
    this.newsletterSubscriptions.set(updatedSubs);
    localStorage.setItem('subscribers_index', JSON.stringify(updatedSubs));

    if (this.isFirebaseEnabled() && this.db) {
      const docId = trimmed.replace(/[^a-zA-Z0-9_-]/g, '_');
      const pathStr = `newsletter_subscriptions/${docId}`;
      try {
        const docRef = doc(this.db, 'newsletter_subscriptions', docId);
        await setDoc(docRef, { email: trimmed, subscribedAt: newSub.subscribedAt });
        this.showToast('success', 'Priority Alert Subscribed', `Joined verification notifications list for '${trimmed}'.`);
      } catch (error) {
        this.handleFirebaseError(error, OperationType.WRITE, pathStr);
      }
    } else {
      this.showToast('success', 'Saved Local Subscriber', `Added '${trimmed}' to local notifications buffer.`);
    }
  }

  public async removeSubscriber(email: string): Promise<void> {
    const trimmed = email.trim();
    const updated = this.newsletterSubscriptions().filter(s => s.email !== trimmed);
    this.newsletterSubscriptions.set(updated);
    localStorage.setItem('subscribers_index', JSON.stringify(updated));

    if (this.isFirebaseEnabled() && this.db) {
      const docId = trimmed.replace(/[^a-zA-Z0-9_-]/g, '_');
      const pathStr = `newsletter_subscriptions/${docId}`;
      try {
        const docRef = doc(this.db, 'newsletter_subscriptions', docId);
        await deleteDoc(docRef);
        this.showToast('success', 'Subscriber Removed', `Successfully deleted subscriber '${trimmed}' from database.`);
      } catch (error) {
        this.handleFirebaseError(error, OperationType.WRITE, pathStr);
      }
    } else {
      this.showToast('success', 'Subscriber Removed', `Removed subscriber '${trimmed}' locally.`);
    }
  }

  // Taxonomy Management Helpers
  public addCategory(cat: string): void {
    const trimmed = cat.trim();
    if (!trimmed) return;
    if (!this.categories().includes(trimmed)) {
      const updated = [...this.categories(), trimmed];
      this.categories.set(updated);
      localStorage.setItem('scholarship_categories', JSON.stringify(updated));
      this.syncConfigToFirebase();
    }
  }

  public deleteCategory(cat: string): void {
    const trimmed = cat.trim();
    const updated = this.categories().filter(c => c !== trimmed);
    this.categories.set(updated);
    localStorage.setItem('scholarship_categories', JSON.stringify(updated));
    this.syncConfigToFirebase();
  }

  public addTag(tag: string): void {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (!this.tags().includes(trimmed)) {
      const updated = [...this.tags(), trimmed];
      this.tags.set(updated);
      localStorage.setItem('scholarship_tags', JSON.stringify(updated));
      this.syncConfigToFirebase();
    }
  }

  public deleteTag(tag: string): void {
    const trimmed = tag.trim();
    const updated = this.tags().filter(t => t !== trimmed);
    this.tags.set(updated);
    localStorage.setItem('scholarship_tags', JSON.stringify(updated));
    this.syncConfigToFirebase();
  }

  private async syncConfigToFirebase(): Promise<void> {
    if (this.isFirebaseEnabled() && this.db) {
      try {
        const docRef = doc(this.db, 'config', 'taxonomy');
        await setDoc(docRef, {
          categories: this.categories(),
          tags: this.tags()
        });
      } catch (err) {
        console.warn('Firebase sync taxonomy failed', err);
      }
    }
  }

  public async uploadImage(file: File): Promise<string> {
    if (this.isFirebaseEnabled() && this.storage) {
      try {
        const fileExtension = file.name.split('.').pop() || 'jpg';
        const randomId = Math.random().toString(36).substring(2, 10);
        const storagePath = `scholarships/${randomId}_${Date.now()}.${fileExtension}`;
        const fileRef = ref(this.storage, storagePath);
        const result = await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(result.ref);
        this.showToast('success', 'Image Upload Completed', 'Your banner image was uploaded to secure Firebase cloud storage.');
        return downloadUrl;
      } catch (err) {
        console.error('Firebase Storage upload failed, using fallback:', err);
        this.showToast('warning', 'Cloud Storage Upload Failed', 'Direct Firebase storage failed. Generating robust local reader preview fallback.');
        return this.readAsDataURL(file);
      }
    } else {
      // Offline local demo mode fallback: reader data URL
      return this.readAsDataURL(file);
    }
  }

  private readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // --- Real Telemetry & Analytics Tracking Methods ---
  public async loadAnalyticsState(): Promise<void> {
    const todayStr = this.getFormattedDate(new Date());
    const yesterdayStr = this.getFormattedDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
    
    // Generate dates for the last 7 days
    const last7Days: { key: string; label: string }[] = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      last7Days.push({
        key: `daily_${this.getFormattedDate(d)}`,
        label: weekdays[d.getDay()]
      });
    }

    let globalData = { views: 0, impressions: 0, clicks: 0, earnings: 0 };
    const dailyDataList: { day: string; earnings: number; views: number; impressions: number; clicks: number }[] = [];

    if (this.isFirebaseEnabled() && this.db) {
      try {
        // Fetch global doc
        const globalRef = doc(this.db, 'analytics', 'global');
        const globalSnap = await getDoc(globalRef);
        if (globalSnap.exists()) {
          const d = globalSnap.data();
          globalData = {
            views: Number(d['views'] || 0),
            impressions: Number(d['impressions'] || 0),
            clicks: Number(d['clicks'] || 0),
            earnings: Number(d['earnings'] || 0)
          };
        } else {
          // Initialize global doc
          await setDoc(globalRef, globalData);
        }

        // Fetch last 7 days daily docs in parallel
        const promises = last7Days.map(dayInfo => 
          getDoc(doc(this.db!, 'analytics', dayInfo.key))
            .then(snap => {
              if (snap.exists()) {
                const data = snap.data();
                return {
                  day: dayInfo.label,
                  earnings: Number(data['earnings'] || 0),
                  views: Number(data['views'] || 0),
                  impressions: Number(data['impressions'] || 0),
                  clicks: Number(data['clicks'] || 0)
                };
              }
              return { day: dayInfo.label, earnings: 0, views: 0, impressions: 0, clicks: 0 };
            })
        );
        const dailyResults = await Promise.all(promises);
        dailyResults.forEach(res => dailyDataList.push(res));

      } catch (err) {
        console.warn('Failed to load Firestore analytics, falling back to local storage', err);
        this.loadLocalAnalytics(last7Days, globalData, dailyDataList);
      }
    } else {
      this.loadLocalAnalytics(last7Days, globalData, dailyDataList);
    }

    const todayRecord = dailyDataList.find(d => d.day === weekdays[new Date().getDay()]);
    const yesterdayRecord = dailyDataList.find(d => d.day === weekdays[new Date(Date.now() - 24 * 60 * 60 * 1000).getDay()]);

    const todayEarnings = todayRecord ? todayRecord.earnings : 0;
    const ecpm = globalData.impressions > 0 ? (globalData.earnings / globalData.impressions) * 1000 : 2.50;

    this.estimatedEarnings.set({
      today: todayEarnings,
      yesterday: yesterdayRecord ? yesterdayRecord.earnings : 0,
      month: globalData.earnings,
      impressions: globalData.impressions,
      clicks: globalData.clicks,
      views: globalData.views,
      ecpm: Math.max(1.00, Math.min(10.00, ecpm)),
      trend: dailyDataList.map(d => ({
        day: d.day,
        earnings: d.earnings,
        views: d.views,
        impressions: d.impressions,
        clicks: d.clicks
      }))
    });
  }

  private loadLocalAnalytics(
    last7Days: { key: string; label: string }[],
    globalData: any,
    dailyDataList: any[]
  ): void {
    const rawGlobal = localStorage.getItem('local_analytics_global');
    if (rawGlobal) {
      try {
        const parsed = JSON.parse(rawGlobal);
        globalData.views = parsed.views || 0;
        globalData.impressions = parsed.impressions || 0;
        globalData.clicks = parsed.clicks || 0;
        globalData.earnings = parsed.earnings || 0;
      } catch {}
    }

    last7Days.forEach(dayInfo => {
      const rawDaily = localStorage.getItem(`local_analytics_${dayInfo.key}`);
      if (rawDaily) {
        try {
          const parsed = JSON.parse(rawDaily);
          dailyDataList.push({
            day: dayInfo.label,
            earnings: parsed.earnings || 0,
            views: parsed.views || 0,
            impressions: parsed.impressions || 0,
            clicks: parsed.clicks || 0
          });
        } catch {
          dailyDataList.push({ day: dayInfo.label, earnings: 0, views: 0, impressions: 0, clicks: 0 });
        }
      } else {
        dailyDataList.push({ day: dayInfo.label, earnings: 0, views: 0, impressions: 0, clicks: 0 });
      }
    });
  }

  private getFormattedDate(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  public async trackPageView(): Promise<void> {
    // GA4 Track Page View Event
    const windowObj = window as any;
    if (windowObj.gtag) {
      try {
        windowObj.gtag('event', 'page_view', {
          page_path: window.location.pathname,
          page_title: document.title
        });
      } catch (e) { }
    }

    const todayStr = this.getFormattedDate(new Date());
    const dailyKey = `daily_${todayStr}`;
    
    this.incrementLocalStat('views', 1);
    this.incrementLocalDailyStat(dailyKey, 'views', 1);

    if (this.isFirebaseEnabled() && this.db) {
      try {
        const globalRef = doc(this.db, 'analytics', 'global');
        await updateDoc(globalRef, { views: increment(1) });

        const dailyRef = doc(this.db, 'analytics', dailyKey);
        await setDoc(dailyRef, { views: increment(1) }, { merge: true });
      } catch (err) {
        console.warn('Firebase trackPageView failed', err);
      }
    }
    
    this.loadAnalyticsState();
  }

  public async trackAdImpression(): Promise<void> {
    const todayStr = this.getFormattedDate(new Date());
    const dailyKey = `daily_${todayStr}`;
    const earningsDelta = 0.0025; // CPM $2.50 = $0.0025 per impression

    this.incrementLocalStat('impressions', 1);
    this.incrementLocalStat('earnings', earningsDelta);
    this.incrementLocalDailyStat(dailyKey, 'impressions', 1);
    this.incrementLocalDailyStat(dailyKey, 'earnings', earningsDelta);

    if (this.isFirebaseEnabled() && this.db) {
      try {
        const globalRef = doc(this.db, 'analytics', 'global');
        await updateDoc(globalRef, { 
          impressions: increment(1),
          earnings: increment(earningsDelta)
        });

        const dailyRef = doc(this.db, 'analytics', dailyKey);
        await setDoc(dailyRef, { 
          impressions: increment(1),
          earnings: increment(earningsDelta)
        }, { merge: true });
      } catch (err) {
        console.warn('Firebase trackAdImpression failed', err);
      }
    }
    
    this.loadAnalyticsState();
  }

  public async trackAdClick(): Promise<void> {
    const todayStr = this.getFormattedDate(new Date());
    const dailyKey = `daily_${todayStr}`;
    const earningsDelta = 0.15; // CPC $0.15 per click

    this.incrementLocalStat('clicks', 1);
    this.incrementLocalStat('earnings', earningsDelta);
    this.incrementLocalDailyStat(dailyKey, 'clicks', 1);
    this.incrementLocalDailyStat(dailyKey, 'earnings', earningsDelta);

    if (this.isFirebaseEnabled() && this.db) {
      try {
        const globalRef = doc(this.db, 'analytics', 'global');
        await updateDoc(globalRef, { 
          clicks: increment(1),
          earnings: increment(earningsDelta)
        });

        const dailyRef = doc(this.db, 'analytics', dailyKey);
        await setDoc(dailyRef, { 
          clicks: increment(1),
          earnings: increment(earningsDelta)
        }, { merge: true });
      } catch (err) {
        console.warn('Firebase trackAdClick failed', err);
      }
    }
    
    this.loadAnalyticsState();
  }

  private incrementLocalStat(key: 'views' | 'impressions' | 'clicks' | 'earnings', delta: number): void {
    const raw = localStorage.getItem('local_analytics_global');
    let data = { views: 0, impressions: 0, clicks: 0, earnings: 0 };
    if (raw) {
      try { data = JSON.parse(raw); } catch {}
    }
    data[key] = (data[key] || 0) + delta;
    localStorage.setItem('local_analytics_global', JSON.stringify(data));
  }

  private incrementLocalDailyStat(dailyKey: string, key: 'views' | 'impressions' | 'clicks' | 'earnings', delta: number): void {
    const storageKey = `local_analytics_${dailyKey}`;
    const raw = localStorage.getItem(storageKey);
    let data = { views: 0, impressions: 0, clicks: 0, earnings: 0 };
    if (raw) {
      try { data = JSON.parse(raw); } catch {}
    }
    data[key] = (data[key] || 0) + delta;
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  // --- Google Analytics 4 & Search Console Integrations ---
  public async loadPublicIntegrations(): Promise<void> {
    try {
      const res = await fetch('/api/public-integrations');
      if (res.ok) {
        const data = await res.json();
        if (data.ga4MeasurementId) {
          this.ga4MeasurementId.set(data.ga4MeasurementId);
          this.injectGA4(data.ga4MeasurementId);
        }
        if (data.googleSiteVerification) {
          this.googleSiteVerification.set(data.googleSiteVerification);
          this.injectSiteVerification(data.googleSiteVerification);
        }
      }
    } catch (err) {
      console.warn('Failed to load public integrations from server', err);
    }
  }

  private injectGA4(id: string): void {
    if (!id || typeof document === 'undefined' || document.getElementById('ga4-script-tag')) return;

    try {
      const script1 = document.createElement('script');
      script1.id = 'ga4-script-tag';
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.id = 'ga4-init-tag';
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${id}', { 'send_page_view': false });
      `;
      document.head.appendChild(script2);
    } catch (e) { }
  }

  private injectSiteVerification(token: string): void {
    if (!token || typeof document === 'undefined' || document.getElementById('gsc-meta-tag')) return;

    try {
      const meta = document.createElement('meta');
      meta.id = 'gsc-meta-tag';
      meta.name = 'google-site-verification';
      meta.content = token;
      document.head.appendChild(meta);
    } catch (e) { }
  }

  public async getIntegrationsSettings(): Promise<any> {
    const res = await fetch('/api/integrations', {
      headers: {
        'Authorization': `Bearer ${this.currentUser()?.email}`
      }
    });
    if (!res.ok) throw new Error('Failed to retrieve integrations settings');
    return res.json();
  }

  public async saveIntegrationsSettings(settings: any): Promise<void> {
    const res = await fetch('/api/integrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.currentUser()?.email}`
      },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to save integrations settings');
  }

  public async getGA4ReportingData(): Promise<any> {
    const res = await fetch('/api/analytics/ga4', {
      headers: {
        'Authorization': `Bearer ${this.currentUser()?.email}`
      }
    });
    if (!res.ok) throw new Error('Failed to retrieve GA4 analytics data');
    return res.json();
  }

  public async getGSCReportingData(): Promise<any> {
    const res = await fetch('/api/analytics/gsc', {
      headers: {
        'Authorization': `Bearer ${this.currentUser()?.email}`
      }
    });
    if (!res.ok) throw new Error('Failed to retrieve GSC search query data');
    return res.json();
  }
}
