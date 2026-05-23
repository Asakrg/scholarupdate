# Scholarupdate — Technical Architecture Document

**Version:** 1.0
**Date:** 2026-05-18
**Author:** Winston (Architect) — synthesized with Amelia (Dev), Paige (Tech Writer)

---

## 1. Architecture Philosophy

Boring technology for stability. Developer productivity as architecture. Every decision tied to business value. Favor separation of concerns — content management and ad rendering are decoupled processes.

---

## 2. Stack Decision

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 14+ (App Router) | SSG+ISR, edge-ready, built-in image optimization |
| **CMS** | Headless (Strapi self-hosted → Contentful when scaling) | Decoupled content from presentation; no PHP/MySQL per request |
| **Hosting** | Vercel (frontend) + Railway/VPS (Strapi) | Edge caching, zero-devops frontend, scalable CMS backend |
| **Ad Integration** | Custom AdSlot component + AdSense API | Lazy-loaded, CLS-safe, multi-network ready |
| **Newsletter** | ESP webhook (Mailchimp/ConvertKit) | Single POST endpoint, no complex email infrastructure |
| **Quiz/Matching** | Next.js serverless functions + Google Sheets (MVP) → Supabase (Phase 2) | Zero infra cost for validation phase |
| **Search** | Pagefind (static search, MVP) → Algolia (Phase 2) | Static-first, no backend until scale |

**Why not WordPress?** Mixing content management with ad rendering in one PHP/MySQL process creates security and performance coupling. When AdSense scripts slow down or fail, WordPress serves dynamic pages for every request. Headless CMS means the frontend handles rendering, caching, and ad injection independently.

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Vercel Edge                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Next.js (SSG + ISR)                              │  │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────────────┐   │  │
│  │  │   SSG   │ │   ISR    │ │  Serverless Fn    │   │  │
│  │  │  Pages  │ │  Pages   │ │  (quiz, webhook)  │   │  │
│  │  └─────────┘ └──────────┘ └──────────────────┘   │  │
│  │                                                   │  │
│  │  ┌───────────────────────────────────────────┐    │  │
│  │  │  Static Assets (images, ads.txt, robots)  │    │  │
│  │  └───────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
┌──────────────────┐     ┌─────────────────────┐
│  Headless CMS    │     │  Ad Services         │
│  (Strapi/Railway) │     │  (AdSense + others)  │
│  Content API     │     │  Client-side loaded   │
│  Webhook hooks   │     │  IntersectionObserver │
└──────────────────┘     └─────────────────────┘
          │
          ▼
┌──────────────────┐
│  ESP Webhook      │
│  (Mailchimp/KIT)  │
└──────────────────┘
```

**Data flow:**
1. Content authored in headless CMS → REST API consumed at build time
2. Next.js generates static pages via `getStaticProps` (SSG)
3. Pages deployed to Vercel Edge CDN
4. Content updates trigger ISR revalidation via CMS webhook
5. Ads load client-side after initial page paint via IntersectionObserver
6. Quiz submissions go to serverless function → Google Sheet/DB
7. Newsletter signups POST to ESP webhook directly from client

---

## 4. Project Structure (Phase 1 MVP)

```
scholarupdate/
├── components/
│   ├── AdSlot.tsx              # Observer-based lazy ad renderer
│   ├── Layout.tsx              # Shell: header, main, footer, sidebar
│   ├── PostCard.tsx            # Article/scholarship card
│   ├── ScholarshipCard.tsx     # Directory card with urgency ribbon
│   ├── NewsletterForm.tsx      # Email capture with validation
│   ├── QuizQuestion.tsx        # Single quiz step
│   └── FilterBar.tsx           # Scholarship search filters
├── lib/
│   ├── posts.ts                # MD frontmatter parser → content API
│   ├── adsense.ts              # Ad unit configs, responsive sizing
│   ├── quiz.ts                 # Matching algorithm + scoring
│   └── newsletter.ts           # ESP webhook client
├── content/
│   └── posts/                  # 10 .md files (Phase 1) before CMS
│       ├── 2026-05-18-scholarship-guide.md
│       └── ...
├── pages/
│   ├── index.tsx               # Landing page
│   ├── posts/
│   │   ├── [slug].tsx          # Article detail
│   │   └── index.tsx           # News feed
│   ├── scholarship/
│   │   └── index.tsx           # Scholarship directory
│   ├── about.tsx               # About us
│   ├── newsletter.tsx          # Newsletter signup
│   └── quiz.tsx                # Scholarship matching quiz
├── pages/api/
│   ├── quiz-submit.ts          # POST quiz results → storage
│   └── newsletter-subscribe.ts # POST email → ESP
├── __tests__/
│   ├── components/
│   │   ├── AdSlot.test.tsx     # Placeholder sizing, observer trigger
│   │   ├── Layout.test.tsx
│   │   └── ScholarshipCard.test.tsx
│   ├── lib/
│   │   ├── posts.test.ts       # MD parsing, frontmatter validation
│   │   └── quiz.test.ts        # Matching algorithm, edge cases
│   └── pages/
│       └── quiz.test.ts        # Form validation, submission
├── public/
│   ├── ads.txt                 # AdSense authorized sellers
│   └── robots.txt
├── styles/
│   └── globals.css             # Design tokens, responsive breakpoints
├── next.config.js
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

---

## 5. Core Component Specifications

### 5.1 AdSlot Component

```tsx
// components/AdSlot.tsx
// Props: slotId, format ('rectangle'|'leaderboard'|'sidebar'), className?
//
// Behavior:
// - Renders <div style={{ minHeight: 280 }} ref={ref} /> placeholder
// - On IntersectionObserver trigger, injects AdSense <ins> element
// - Builds DOM nodes via createElement (no dangerouslySetInnerHTML) — prevents XSS
// - ResizeObserver on parent updates data-ad-format for responsive units
// - Never renders ad script on non-ad routes
//
// Acceptance Criteria:
// AD-1: Ad never shifts layout after paint (minHeight enforced)
// AD-2: Ad script not loaded on routes without AdSlot
// AD-3: IntersectionObserver.observe() called on mount
// AD-4: Placeholder visible before ad loads
// AD-5: Falls back to placeholder if ad fails to load
```

### 5.2 Layout Component

- Shell layout with responsive grid: header → main → footer
- Desktop: content column (800px) + sidebar (300px ad slot)
- Mobile: single column, sidebar ads render inline between content
- Navigation collapses to hamburger below 768px
- Sticky topbar on scroll (mobile) with article progress indicator

### 5.3 Scholarship Card

- Name (bold, 18px)
- Amount (amber colored, prominent)
- Deadline with color-coded ribbon (green/yellow/red)
- Eligibility tags (audience, field, country)
- "View Details" CTA
- Skeleton loader variant for loading state

---

## 6. Ad Implementation Strategy

### Lazy Loading
```typescript
// IntersectionObserver pattern for all ad slots
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadAdScript(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '200px' } // start loading 200px before viewport
);
```

### CLS Prevention
- Every ad slot has `min-height: 280px` or `min-height: 90px` (leaderboard)
- Placeholder styled with same dimensions as expected ad
- No layout shift metric tracked via Web Vitals API

### Multi-Network Support
- Abstracted ad provider interface
- Phase 1: Google AdSense only
- Phase 2: Ad Manager (for direct-sold) + Prebid.js wrapper
- Network selector per slot defined in `/lib/adsense.ts` config

---

## 7. Newsletter Integration

- Client-side form validation → POST `/api/newsletter-subscribe`
- Serverless function validates email format → POST to ESP API
- ESP: Mailchimp (Phase 1) or ConvertKit (for better tagging)
- Double opt-in enabled for compliance
- Tag subscribers by source (scholarship quiz, article, landing page)

---

## 8. Quiz/Matching Engine

**Phase 1 (MVP):**
- 10-question client-side form (audience, field, country, amount range, etc.)
- Matching algorithm: weighted scoring against 200 seed scholarships
- Results stored serverlessly via Google Sheets (no DB needed)
- Simple scoring: matches per criteria dimension, ranked by score

**Phase 2:**
- Real-time database (Supabase/Firebase)
- ML-based matching (collaborative filtering based on application outcomes)
- Confidence score: "You have a 34% shot at this scholarship"

---

## 9. Content Model (Paige's Specification)

### Entity: Scholarship
| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | yes | Scholarship title |
| provider | string | yes | Organization name |
| amount | number | yes | In USD |
| currency | string | yes | USD, IDR, etc. |
| deadline | datetime | yes | ISO 8601 |
| audience | enum | yes | high-school, undergraduate, graduate, international |
| field | enum[] | yes | STEM, humanities, vocational, etc. |
| country | string[] | no | Eligible countries |
| eligibility | text | yes | Requirements |
| url | url | yes | Application link |
| last_verified | datetime | yes | Trust signal |
| tags | string[] | no | Free-form keywords |
| ad_placement_zone | enum | no | Controls ad slot proximity |

### Entity: Article
| Field | Type | Required | Notes |
|---|---|---|---|
| title | string | yes | |
| slug | string | yes | URL path |
| author | string | yes | |
| published_at | datetime | yes | |
| content | markdown | yes | |
| excerpt | string | yes | SEO meta |
| related_scholarships | relation[] | no | Links to Scholarship entities |
| meta_description | string | yes | SEO |
| schema_org | json | no | Event/scholarship markup |

### Entity: Newsletter
| Field | Type | Notes |
|---|---|---|
| subject | string | Email subject line |
| send_date | datetime | Scheduled send |
| scholarships | relation[] | Linked scholarships featured |
| articles | relation[] | Linked articles featured |
| open_rate | float | Tracked post-send |
| click_rate | float | Tracked post-send |

---

## 10. Test Strategy (Amelia's Specification)

**Unit Tests** (`vitest` + `@testing-library/react`):
- `AdSlot.test.tsx`: placeholder renders, observer triggers, ad script not present before intersection
- `posts.test.ts`: getStaticPaths returns slugs, MD frontmatter parsing
- `quiz.test.ts`: scoring algorithm, edge cases (ties, empty inputs)
- `newsletter.test.ts`: email validation, webhook payload format

**E2E Tests** (Playwright):
- Quiz submission flow: fill form → submit → see results
- Newsletter signup: enter email → submit → confirmation
- Navigation: landing → article → scholarship directory → about

**Performance:**
- Lighthouse CI: target 90+ performance, 90+ accessibility
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- Bundle size budget: 150KB JS initial, 50KB CSS initial

---

## 11. Sprint Plan (Phase 1 — 10 Days, 1 Dev)

| Day | Task | Deliverable |
|---|---|---|
| 1-2 | Scaffold Next.js, folder structure, Layout component, 10 markdown posts | Running skeleton on Vercel preview |
| 3-4 | `lib/posts` content API, `pages/posts/[slug].tsx`, `pages/index.tsx` with PostCard | Article pages rendering from MD |
| 5-6 | AdSlot component + IntersectionObserver + tests; ads.txt deployment | Lazy-loaded ads verified |
| 7-8 | Quiz page + `api/quiz-submit` + validation + matching algorithm | Quiz flow end-to-end |
| 9-10 | Mobile-responsive CSS pass, Lighthouse audit (target 90+), Vercel production deploy | Phase 1 MVP live |

---

## 12. Security Considerations

- No `dangerouslySetInnerHTML` for ad injection — build DOM nodes via `createElement`
- All user inputs validated server-side in API routes
- Rate limiting on newsletter/quiz endpoints (Vercel WAF or middleware)
- CSP headers blocking inline scripts except AdSense allowlist
- `ads.txt` deployed at `/ads.txt` for AdSense authorization
- No secrets in client bundle — environment variables via `NEXT_PUBLIC_` prefix
- HTTPS enforced at edge (Vercel default)

---

## 13. Future Architecture (Phase 2+)

```
Phase 1:              Phase 2:                  Phase 3:
┌─────────┐          ┌──────────┐              ┌────────────┐
│ MD Posts│          │ Strapi   │              │ Supabase   │
│ + SSG   │  ──►     │ + ISR    │     ──►      │ + Auth     │
│ + Sheets│          │ + Algolia│              │ + Real-time │
└─────────┘          └──────────┘              └────────────┘
```

- Phase 2: Headless CMS replaces markdown files; search via Algolia; Postgres via Supabase
- Phase 3: User authentication (Supabase Auth); real-time scholarship alerts; comments
- Ad stack evolution: AdSense → Ad Manager → Prebid.js for header bidding
