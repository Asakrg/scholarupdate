# Scholarupdate - Component Inventory

This document details the layout, public, administrative, and shared UI components in the Scholarupdate client application.

---

## 1. Page Components

### HomeComponent
- **File Location:** [src/app/public/home.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/public/home.ts)
- **Selector:** `app-home`
- **Route Path:** `''` (Default root path)
- **Primary Imports:** `CommonModule`, `RouterLink`, `MatIconModule`, `Adsense`, `HeaderComponent`, `FooterComponent`
- **Key Mechanics:**
  - Computes a list of active scholarships based on Search Queries, Category selections, and Tag filters using Angular Signals (`filteredScholarships`).
  - Sets homepage SEO keywords and generates schema structural payloads (`ItemList` JSON-LD schemas) in real-time.
  - Implements share links (Twitter/X, LinkedIn, Email) and clipboard copy triggers for individual scholarship cards.
  - Integrates a `leaderboard` ad slot at the top, and inserts an `in-feed` ad slot between scholarship listing cards.
- **Reference Design Image:** [Landing Page.png](file:///Users/aliahmad/Documents/scholarupdate/docs/design/Landing%20Page.png)

### DetailsComponent
- **File Location:** [src/app/public/details.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/public/details.ts)
- **Selector:** `app-details`
- **Route Path:** `scholarship/:id`
- **Primary Imports:** `CommonModule`, `RouterLink`, `MatIconModule`, `Adsense`, `HeaderComponent`, `FooterComponent`
- **Key Mechanics:**
  - Resolves scholarship IDs from routing parameters, fetches the record via the service, and increments view counters (`incrementViews()`).
  - Injects schema-structured markup (`Scholarship` JSON-LD schema) and manages custom meta titles/descriptions.
  - Formulates dynamic application instructions checklist steps tailored to the scholarship's category (Fully-Funded, PhD, Undergrad, etc.).
  - Calculates and renders a list of related scholarships matching similar tags.
  - Houses the main external apply link and incorporates a `sidebar` ad slot.
- **Reference Design Image:** [Article Detail.png](file:///Users/aliahmad/Documents/scholarupdate/docs/design/Article%20Detail.png)

### CategoriesComponent
- **File Location:** [src/app/public/categories.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/public/categories.ts)
- **Selector:** `app-categories`
- **Route Path:** `categories`
- **Primary Imports:** `CommonModule`, `RouterLink`, `MatIconModule`, `Adsense`, `HeaderComponent`, `FooterComponent`
- **Key Mechanics:**
  - Displays a grid categorization layout summarizing the total number of open opportunities inside each category.
  - Renders a multi-column tag library dashboard for easy taxonomy navigation.
  - Mounts a `leaderboard` ad unit under the main title and an `in-feed` ad unit above the footer.
- **Reference Design Image:** [Scholarship Directory.png](file:///Users/aliahmad/Documents/scholarupdate/docs/design/Scholarship%20Directory.png)

### AdminLoginComponent
- **File Location:** [src/app/admin/login.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/admin/login.ts)
- **Selector:** `app-admin-login`
- **Route Path:** `admin/login`
- **Primary Imports:** `CommonModule`, `RouterLink`, `MatIconModule`, `FormsModule`
- **Key Mechanics:**
  - Handles administrative authentication using Google Authentication popup redirection.
  - Implements a secondary fallback input form to run in local guest admin demo mode when database credentials are unset or offline.

### AdminCMSComponent
- **File Location:** [src/app/admin/cms.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/admin/cms.ts)
- **Selector:** `app-admin-cms`
- **Route Path:** `admin`
- **Primary Imports:** `CommonModule`, `RouterLink`, `MatIconModule`, `HeaderComponent`, `FooterComponent`, `Adsense`, `FormsModule`
- **Key Mechanics:**
  - Controls active publishing indexes (CRUD operations on scholarships, categories, and tags).
  - Mounts the **AI Autonomous Sourcing Control panel** allowing the admin to input a query keyword and crawl portal pages.
  - Simulates detailed terminal log entries detailing headless Chromium browser actions, mouse cursor coordinates, key typing, and scraper progress bars.
  - Displays structured opportunities returned from the Express server.
  - Manages whitelist authorization settings (adds/removes content editor accounts and emails).

---

## 2. Layout Components

### HeaderComponent
- **File Location:** [src/app/layout/header.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/layout/header.ts)
- **Selector:** `app-header`
- **Primary Imports:** `CommonModule`, `RouterLink`, `MatIconModule`
- **Key Mechanics:**
  - Standard navigation header showing links to categories page.
  - Checks authorization state via the service and renders profile information or login redirects.

### FooterComponent
- **File Location:** [src/app/layout/footer.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/layout/footer.ts)
- **Selector:** `app-footer`
- **Primary Imports:** `CommonModule`, `RouterLink`, `MatIconModule`, `FormsModule`
- **Key Mechanics:**
  - Footer navigation links (about, guidelines, privacy).
  - Houses the newsletter subscription input box and binds to `subscribeEmail()` signals.
- **Reference Design Image:** [Newsletter Signup.png](file:///Users/aliahmad/Documents/scholarupdate/docs/design/Newsletter%20Signup.png)

---

## 3. Shared & Utility Components

### Adsense Component
- **File Location:** [src/app/shared/adsense.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/shared/adsense.ts)
- **Selector:** `app-adsense`
- **Primary Imports:** `CommonModule`, `MatIconModule`
- **Inputs:**
  - `layout` (type: `AdLayout` = `'in-feed'`, `'leaderboard'`, or `'sidebar'`)
  - `client` (type: `string` = Google publisher ID)
  - `slot` (type: `string` = ad slot ID)
  - `format` (type: `string` = `'auto'`)
  - `responsive` (type: `boolean` = `true`)
- **Key Mechanics:**
  - Detects `window.ADSENSE_LIVE_ENABLED` presence.
  - Dynamically injects script tags onto the header to download the Google script if enabled.
  - Configures a `ResizeObserver` listener targeting the `ins.adsbygoogle` DOM node. Only triggers the `adsbygoogle.push({})` array update once the element has been painted with a width > 0.
  - Displays alternative premium sponsored banners for Duolingo, Grammarly, and Coursera when live ads are blocked or disabled.

---

_Generated using BMAD Method `document-project` workflow_
