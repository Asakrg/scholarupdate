# Scholarupdate - Development & Setup Guide

This guide provides step-by-step instructions for developers setting up, running, testing, and deploying the Scholarupdate academic opportunity matching media platform.

---

## 1. Prerequisites

Before starting, ensure your local development environment meets the following requirements:

*   **Node.js:** Version 18.x or 20.x (LTS recommended)
*   **npm:** Version 9.x or higher
*   **Angular CLI:** Version 19.x or higher (installed globally via `npm install -g @angular/cli`)
*   **Firebase Account:** A Firebase Project (with Firestore, Authentication, and Cloud Storage configured) is required for full database features.
*   **Google AI Studio Account:** Required to obtain a Gemini API key for live opportunity indexing.
*   **Firecrawl Account:** Required to scrape unstructured webpage schemas from target institutions.

---

## 2. Local Installation

Clone the repository and install the client and backend dependencies simultaneously:

```bash
# Clone the project repository (if applicable)
cd scholarupdate

# Install project dependencies
npm install
```

This single command installs all client libraries (such as `@angular/core`, `@angular/material`, `rxjs`, `tailwindcss`) and backend libraries (such as `@google/genai`, `express`, `firebase`).

---

## 3. Environment Variables Configuration

Copy the example file to a `.env` file at the root of the workspace:

```bash
cp .env.example .env
```

Open the newly created `.env` file and define the API tokens:

```env
# Google AI Studio key for Gemini 3.5 Flash Search Grounding
GEMINI_API_KEY=AIzaSyYourActualGeminiApiKeyGoesHere

# Firecrawl Scraper API Key
FIRECRAWL_API_KEY=fc-yourActualFirecrawlApiKeyGoesHere
```

> [!NOTE]
> If these environment keys are not configured, the backend will bypass external networks and respond with simulated, high-fidelity mock academic scholarships.

---

## 4. Firebase Configuration & Fallback

The client application connects to Firebase services using credentials defined in:
`[src/firebase-applet-config.json](file:///Users/aliahmad/Documents/scholarupdate/src/firebase-applet-config.json)`

### Real Firebase Setup
Update the file properties to map your Firebase project:

```json
{
  "apiKey": "AIzaSyYourRealFirebaseApiKey",
  "authDomain": "your-app-id.firebaseapp.com",
  "projectId": "your-app-id",
  "storageBucket": "your-app-id.appspot.com",
  "messagingSenderId": "1234567890",
  "appId": "1:1234567890:web:abcdef123456",
  "firestoreDatabaseId": "(default)"
}
```

### Local Dev Fallback (Demo Bypass)
If the file retains its initial placeholder settings:
```json
"projectId": "mock-applet-id",
"apiKey": "mock-api-key-placeholder"
```
The [ScholarshipService](file:///Users/aliahmad/Documents/scholarupdate/src/app/services/scholarship.ts) automatically detects these placeholders and falls back to **Local Web Storage (LocalStorage) mode**. In fallback mode:
*   CRUD operations work instantly.
*   Data is saved in the browser's sandbox buffer.
*   Firebase Authentication calls are bypassed.

---

## 5. Local Development Mode

The project features a unified proxy runner. Instead of launching Angular and Express separately, run:

```bash
npm start
```

### How the Proxy Works
*   The Express server starts on port **3000**.
*   In development mode, Express spawns the Angular Dev Server (`npx ng serve`) on port **4200** with host flags enabled.
*   Express proxies all generic traffic to the Angular CLI process (port 4200), resolving CORS conflicts.
*   Express intercept routes starting with `/api` to process scraping queries, Search Grounding calls, and schema parsing.
*   Access the live application at: **`http://localhost:3000`**

### Administrative Login Bypass
When testing the CMS without database credentials:
1. Navigate to `http://localhost:3000/admin/login` or click **Admin Login** in the header.
2. Under "or bypass for developer testing", select **Bypass: Super-Admin** or **Bypass: Editor Only**.
3. The system log triggers local permissions mapping automatically.

---

## 6. Code Quality & Formatting

To perform standard lint checks across the client TypeScript codebase, run:

```bash
npm run lint
```

This enforces static analysis guidelines mapped in `eslint.config.js`.

---

## 7. Firebase Blueprint & Database Migrations

Before launching live services, deploy the security parameters and set up the collections inside Cloud Firestore.

### 1. Deploy Firestore Security Rules
Use the Firebase CLI to deploy rules configured in `[firestore.rules](file:///Users/aliahmad/Documents/scholarupdate/firestore.rules)`:

```bash
# Log in to your Firebase account
firebase login

# Select your target Firebase project ID
firebase use your-project-id

# Deploy rules only to protect subscriber details and limit writes
firebase deploy --only firestore:rules
```

### 2. Firestore Schema Structure
Based on `[firebase-blueprint.json](file:///Users/aliahmad/Documents/scholarupdate/firebase-blueprint.json)`, Firestore expects two collections:

#### Collection: `scholarships`
Documents mapped with individual IDs (URL-safe slug strings like `oxford-excellence-2026`). Expected keys:
*   `id` (string): URL-safe matching slug ID.
*   `title` (string): Official name of the scholarship.
*   `excerpt` (string): Two-sentence catalog overview.
*   `description` (string): Full details written in Markdown format.
*   `category` (string): Must be `'Fully-Funded'`, `'Undergrad'`, `'Postgrad'`, or `'PhD'`.
*   `amount` (number): Numerical funding valuation.
*   `amountDisplay` (string): Human-readable budget label (e.g. `"$45,000 / Year"`).
*   `deadline` (string): Target format `'YYYY-MM-DD'`.
*   `applyUrl` (string): Direct external host links.
*   `eligibility` (string): Short bullet checklist criteria text.
*   `status` (string): `'published'` or `'draft'`.
*   `imageUrl` (string): Background photo path link.
*   `tags` (array of strings): Taxonomy descriptors.
*   `views` (number): Counter tracking visitors.

#### Collection: `newsletter_subscriptions`
Documents tracking subscribers. Schema properties:
*   `email` (string): Target email address.
*   `subscribedAt` (string): ISO timestamp.

---

## 8. Building & Deploying to Production

When deploying to a production server (such as Vercel, Heroku, or a VPS host):

### 1. Compile Angular Static Assets
Compile the single-page application optimized bundles:

```bash
npm run build
```

This generates compiled, production-ready static assets in:
`dist/app/browser` (or `dist/app`)

### 2. Configure Environment Variable
Set the environment flag on your host server:
```env
NODE_ENV=production
```

### 3. Launch Node Gateway Server
Start the Express gateway server:

```bash
node server.js
```

In production mode:
*   Express detects static files in `dist/app/browser`.
*   It hosts assets directly on port 3000 without starting Angular CLI or compiling source code.
*   It serves fallback SPA routes to `index.html`.

---

## 9. Extending AI Sourcing & AdSense Configurations

### Sourcing AI Configurations
To customize crawling and reasoning schemas, modify:
`[server.js](file:///Users/aliahmad/Documents/scholarupdate/server.js)`
*   Adjust `responseSchema` to add custom metadata constraints.
*   Adjust system instructions on lines 135-142 to refine search outputs.

### Toggling Real Google AdSense Ads
By default, the application runs simulated mock sponsored cards (Grammarly, Duolingo, Coursera) to prevent CLS layout changes during testing.

To enable live Google AdSense ads:
1. Open `[src/index.html](file:///Users/aliahmad/Documents/scholarupdate/src/index.html)`.
2. Locate the head configurations:
   ```javascript
   window.ADSENSE_LIVE_ENABLED = true;
   ```
3. Set this flag to `true` and configure the Google publisher and slot IDs inside the layout templates in `src/app/public/`.

---
*Generated using BMAD Method development specifications*
