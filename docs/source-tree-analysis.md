# Scholarupdate - Source Tree Analysis

This document maps the directory layout, configuration files, and component locations in the Scholarupdate codebase.

---

## 1. Repository Directory Structure

```
scholarupdate/
├── .agents/                 # BMad automation workflow definitions & skills
├── _bmad/                   # BMad configuration layers and scripts
├── _bmad-output/            # Outputs from BMad runs (PRDs, plans, walkthroughs)
├── docs/                    # System documentation and design blueprints
│   ├── design/              # UI screenshots of the application
│   └── ...                  # Markdown guides (index.md, architecture.md, etc.)
├── src/                     # Client application source files (Angular SPA)
│   ├── app/                 # Angular components, routing, and services
│   │   ├── admin/           # Administrative portal views (login, CMS desk)
│   │   ├── layout/          # Shared site headers and footers
│   │   ├── public/          # Public facing views (Home directory, details, categories)
│   │   ├── services/        # Firebase integrations and SEO meta operations
│   │   └── shared/          # Shared components (dynamic AdSense placement units)
│   ├── index.html           # Main HTML document template
│   ├── main.ts              # Angular application bootsrap entry
│   └── styles.css           # Global Tailwind directives and custom rules
├── angular.json             # Angular workspace configuration
├── firebase-blueprint.json  # Reference blueprint layout for Firebase resources
├── firestore.rules          # Zero-trust security policy rules for Cloud Firestore
├── package.json             # Node package manifests and run commands
├── server.js                # Express backend middleware, proxy server, and AI agent
├── tailwind.config.js       # TailwindCSS compilation options
└── tsconfig.json            # TypeScript compiler configuration options
```

---

## 2. Core Configurations & Backend Files

- **[server.js](file:///Users/aliahmad/Documents/scholarupdate/server.js):**
  Houses the Express application server. Hosts the `/api/firecrawl-computer-use` AI opportunity search routing, invokes Gemini with web search grounding, structures results to matching schemas, and handles local development proxy routing.
- **[firestore.rules](file:///Users/aliahmad/Documents/scholarupdate/firestore.rules):**
  Defines permission rules for read/write queries on Firestore collections. Restricts write access to whitelisted administrators, requires strict schemas, and enforces secure client view increment restrictions.
- **[firebase-blueprint.json](file:///Users/aliahmad/Documents/scholarupdate/firebase-blueprint.json):**
  Template configuration mapping required database fields and security rules references for Firebase projects.
- **[package.json](file:///Users/aliahmad/Documents/scholarupdate/package.json):**
  Lists dependencies (including `@angular/core`, `@google/genai`, `express`, `tailwindcss`) and runtime script definitions (e.g. `dev`, `build`, `start`).

---

## 3. Client Frontend Source (`src/`)

### Entry Files
- **[index.html](file:///Users/aliahmad/Documents/scholarupdate/src/index.html):**
  Primary DOM target. Embeds the typography link tags, the root `<app-root>` tag, and configures the `window.ADSENSE_LIVE_ENABLED` variable.
- **[main.ts](file:///Users/aliahmad/Documents/scholarupdate/src/main.ts):**
  Bootstrap script instantiating the Angular application with routing and service providers.
- **[styles.css](file:///Users/aliahmad/Documents/scholarupdate/src/styles.css):**
  Applies Tailwind directives and custom styles.

### Services (`src/app/services/`)
- **[scholarship.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/services/scholarship.ts):**
  Provides signals-based state management for auth sessions, whitelisted profiles, scholarship listings, dynamic categories, and newsletter lists. Interfaces with Firebase Auth, Firestore, and Storage, with built-in fallback modes.
- **[seo.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/services/seo.ts):**
  Injects meta tags (Open Graph, Twitter Cards) and schema script payloads (JSON-LD ItemList schemas) for search engines.

### Components (`src/app/`)
- **[app.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/app.ts):**
  Main layout manager rendering the routing viewport and administrative alert banners.
- **[app.routes.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/app.routes.ts):**
  Defines paths linking URLs to components (`HomeComponent`, `DetailsComponent`, `CategoriesComponent`, `AdminLoginComponent`, `AdminCMSComponent`).
- **[app.config.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/app.config.ts):**
  Configures global dependencies (routing, animations, client fetch).

### Shared & Layouts (`src/app/shared/` & `src/app/layout/`)
- **[adsense.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/shared/adsense.ts):**
  Custom component administering dynamic Google AdSense slot rendering. Uses `ResizeObserver` for layout synchronization, and contains educational ad fallbacks.
- **[header.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/layout/header.ts):**
  Header navbar displaying categories links and auth portal buttons.
- **[footer.ts](file:///Users/aliahmad/Documents/scholarupdate/src/app/layout/footer.ts):**
  Footer widget housing information guidelines and newsletter subscription fields.

---

_Generated using BMAD Method `document-project` workflow_
