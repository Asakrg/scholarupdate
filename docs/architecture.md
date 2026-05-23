# Scholarupdate - Technical Architecture

This document outlines the detailed architecture, data flows, security rules, and monetization mechanics of the Scholarupdate platform.

---

## 1. System Components & Flow

Scholarupdate leverages a decoupled frontend single-page application (SPA) communicating with both an Express middleware server (for AI-backed opportunity scraping) and Firebase Services (for authentication, NoSQL document storage, and assets management).

```
                      +------------------------------------------+
                      |         Angular Single Page App          |
                      |  [UI Views, Signals State, SEO, AdSense]  |
                      +--------------------+---------------+-----+
                                           |               |
                                Firebase   |               | REST API
                             Service Calls |               | (Autopost Sourcing)
                                           v               v
                      +--------------------+---+   +-------+---------------+
                      |      Firebase BaaS     |   |   Node.js Express     |
                      | [Auth, Firestore, Store]|   |   Middleware Server   |
                      +------------------------+   +-------+---------------+
                                                           |
                                                           | Scrape & Grounding
                                                           v
                                                   +-------+---------------+
                                                   | Firecrawl & Gemini AI |
                                                   | [Search Grounding API]|
                                                   +-----------------------+
```

---

## 2. Frontend Client Architecture

The client is built using **Angular 19+** and is characterized by a standalone, reactive, and modular structure:

### Reactive State with Angular Signals
The frontend avoids heavy global state frameworks, using native **Angular Signals** inside [ScholarshipService](file:///Users/aliahmad/Documents/scholarupdate/src/app/services/scholarship.ts):
- `scholarships`: Holds the active list of published and draft scholarship entities.
- `currentUser`: Holds the logged-in Firebase user details and calculated permissions profile.
- `authorizedUsers`: Tracks whitelisted admin records.
- `toasts`: Manages stackable notification cards.
- `categories` & `tags`: Controls dynamic taxonomy arrays.

### Dynamic SEO Management
To drive organic search traffic, [SeoService](file:///Users/aliahmad/Documents/scholarupdate/src/app/services/seo.ts) is injected into components:
- **Title and Meta Tags:** Updates document title and injects description, keywords, Open Graph, and Twitter Cards tags.
- **Structured Schema (JSON-LD):** Dynamically builds and replaces standard `application/ld+json` script blocks in the document header (e.g., `ItemList` and `Scholarship` schemas) to enable rich search snippets in search engines.

---

## 3. Backend & Middle-Tier Architecture

The backend consists of a Node.js Express server configured in [server.js](file:///Users/aliahmad/Documents/scholarupdate/server.js):

### Dual-Environment Proxy System
- **Development Mode:** Spins up the backend on port 3000. It concurrently launches the Angular CLI dev server (`ng serve`) on port 4200. Any incoming traffic to port 3000 that does not start with `/api` is transparently proxied to port 4200. This solves Cross-Origin Resource Sharing (CORS) issues and allows hot-reloading.
- **Production Mode:** Detects compiled assets in `dist/app/browser`. It hosts these static assets directly and routes all SPA fallback routes (`*any`) to the compiled `index.html`.

---

## 4. AI Sourcing & Autoposting Pipeline

The AI autonomous opportunity sourcing pipeline is triggered in [cms.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/admin/cms.ts#L1834) and executes the following server-side flow:

```
[CMS Trigger] --(POST /api/firecrawl-computer-use)--> [server.js]
                                                             |
                 +-------------------------------------------+
                 |
                 v
      [Is FIRECRAWL_API_KEY set?]
         /                   \
       YES                    NO
       /                        \
 [Firecrawl Scrape]          [Skip Scrape]
 (Extract markdown)              |
       \                         /
        v                       v
     [Initiate Gemini Model: gemini-3.5-flash]
     [Enable Google Search Grounding Tool]
                         |
                         v
     [Query: "Live 2026/2027 Scholarships ..."]
     [Evaluate scraped text + Search Grounding]
                         |
                         v
     [Schema-Compile Array Output via Gemini]
                         |
                         v
     [Format opportunities list JSON object]
                         |
                         v
  [Render logs in CMS -> Admin edits & clicks Publish]
                         |
                         v
     [Synced to Cloud Firestore / local Storage]
```

1. **DOM Scrape via Firecrawl:** If configured, Firecrawl fetches target pages and converts the DOM tree into clean Markdown.
2. **Search Grounding via Gemini:** The server configures the `@google/genai` SDK to run `gemini-3.5-flash` with the `googleSearch: {}` tool. This forces the model to look up live, active academic listings rather than relying on stale weights.
3. **Strict Schema Mapping:** Gemini maps raw results into a strictly-typed JSON array using `responseSchema` (matching the `Scholarship` interface).
4. **CMS Autoposting Desk:** The opportunities are shown as draft cards with interactive logs in the CMS. Clicking **Publish** writes the document directly to Firestore.

---

## 5. Google AdSense Delivery & Fallbacks

Monetization is managed by the custom `app-adsense` standalone component [adsense.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/shared/adsense.ts):

### Cumulative Layout Shift (CLS) Prevention
- Uninitialized ad containers often cause page layouts to jump when ads load. The component wraps the ad container in a card with a header label (`Sponsored Educational Allocation`) and styles it with a clean border, preventing visual reflow.

### Dynamic Script Injection
- If `window.ADSENSE_LIVE_ENABLED` is `true`, the component injects the Google AdSense script (`adsbygoogle.js`) into the document head (only once).

### Safe Initialization via ResizeObserver
- Calling `(adsbygoogle = window.adsbygoogle || []).push({})` on an element that is hidden or has `width = 0` can crash the AdSense rendering loop.
- The component uses `ResizeObserver` (falling back to a periodic checker) to detect when the `<ins class="adsbygoogle">` tag is actually painted on the screen with a width > 0. Only then does it execute the `push({})` command.

### Premium Sponsor Fallbacks
- If `window.ADSENSE_LIVE_ENABLED` is false, or the script is blocked (e.g. adblockers), the component displays styled mock ad banners for trusted services:
  - **Leaderboard:** Grammarly for Academics
  - **Sidebar:** Duolingo English Test
  - **In-Feed:** Coursera Global Degrees

---

## 6. Hardened Database Security Rules

Firestore security rules in [firestore.rules](file:///Users/aliahmad/Documents/scholarupdate/firestore.rules) implement a zero-trust model:

### Role Verification
- Authentication is handled via Firebase Auth.
- Admin status is verified dynamically:
  ```javascript
  function isAdmin() {
    return isSignedIn() && (
      request.auth.token.email.toLowerCase() == 'aliyusahmad01@gmail.com' || 
      request.auth.token.email.toLowerCase() == 'student.admin@gmail.com' ||
      request.auth.token.email.toLowerCase().endsWith('@admin.scholarshiphub.com')
    );
  }
  ```

### Granular Document Operations
- **Scholarship Creation & Deletion:** Restricted strictly to `isAdmin()`.
- **Scholarship Updates:** Admins can write any valid document. Public users can write updates *only* to increment the `views` count by exactly `1`:
  ```javascript
  allow update: if isValidId(scholarshipId) && (
    (isAdmin() && isValidScholarship(incoming())) ||
    (
      incoming().diff(existing()).affectedKeys().hasOnly(['views']) 
      && incoming().views == existing().views + 1
      && incoming().id == existing().id
      && incoming().title == existing().title
      && incoming().status == existing().status
    )
  );
  ```
- **Newsletter Subscriptions:** Public users can write email subscriptions. Only admins can read or list subscribers, preventing email leaking.

---

_Generated using BMAD Method `document-project` workflow_
