# Scholarupdate Documentation Index

**System Type:** Angular SPA Frontend + Node.js Express API Middleware Backend
**Database/Auth Integration:** Firebase (Firestore & Authentication) with Zero-Trust Security Rules
**Autonomous Sourcing Engine:** Firecrawl Scraper & Gemini 3.5 Flash with Google Search Grounding
**Monetization Engine:** Google AdSense with Safe Dynamic Initialization & Premium Mock Fallbacks
**Last Updated:** 2026-05-21

---

## 1. Project Overview

Scholarupdate is a modern, high-yield academic scholarship matching and discovery portal designed as a media brand. It automates the transaction-heavy task of finding, verifying, and publishing active university and NGO funding programs. 

An administrative user can trigger an autonomous AI agent that searches the web or crawls target portals, parses unstructured text, structures it to a strict database schema, and presents it for one-click publishing. The platform runs targeted Google AdSense units that gracefully fall back to educational resources when blocked, maintaining high visual aesthetics and zero Cumulative Layout Shift (CLS).

---

## 2. Quick Reference

### Frontend Stack
- **Framework:** Angular 19+ (Standalone components, TypeScript, TailwindCSS styling)
- **State Management:** Angular Signals (`signal`, `computed`, `effect`)
- **Key Services:**
  - `ScholarshipService` (`src/app/services/scholarship.ts`): Tracks Auth state, administers CRUD updates, manages whitelisted users, handles Firestore updates, and handles file uploads.
  - `SeoService` (`src/app/services/seo.ts`): Dynamically sets page titles, meta descriptions, Open Graph/Twitter card attributes, and injects structural JSON-LD schemas.

### Backend Stack
- **Runtime:** Node.js (Express server)
- **Primary Entry Point:** `server.js` (reverse proxies Angular CLI dev server on port 4200 during development, and serves compiled production code in production)
- **AI API:** `@google/genai` (Gemini 3.5 Flash with Google Search Grounding for live opportunities indexation)
- **Scraper API:** Firecrawl API (converts webpage DOM into markdown payloads)

### Database & Auth
- **Provider:** Firebase Cloud Suite (Firestore Database, Google Firebase Authentication, Firebase Storage)
- **Security Policy:** Hardened rules in `firestore.rules` preventing query scraping and restricting document writes to authenticated admins, with whitelisted client view increment permission.

---

## 3. Documentation Map

Please explore the following detailed documents to understand and extend this project:

- [Project Overview](./project-overview.md) — Executive summary, stakeholder value, target personas, and dynamic system behaviors.
- [Detailed Technical Architecture](./architecture.md) — Multi-tier data flows, AI autonomous crawler execution pipeline, zero-trust security limits, and Google AdSense integration.
- [Source Tree Analysis](./source-tree-analysis.md) — Directory index mapping folder structures and component responsibilities.
- [UI Component Inventory](./component-inventory.md) — Layout, public facing routes, administrator CMS components, and shared units.
- [Development Guide](./development-guide.md) — Local installation, server proxies, environment keys, and deployment requirements.

---

_Generated using BMAD Method `document-project` workflow_
