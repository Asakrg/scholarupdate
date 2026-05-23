# Scholarupdate — Product Requirements Document

**Version:** 1.0
**Date:** 2026-05-18
**Author:** John (PM) — synthesized from roundtable with Mary (BA), Victor (Innovation), Dr. Quinn (Problem Solver)

---

## 1. Product Vision

Scholarupdate is a scholarship discovery platform that reduces the transaction cost of finding trustworthy, timely funding opportunities. It is a **scholarship matching engine disguised as a media brand** — the blog exists to drive SEO and trust; the real product is an algorithmic filter that tells a student "you have a 34% shot at these 5 scholarships, here's exactly how to apply."

Core thesis: information arbitrage. We own real-time scholarship deadlines, acceptance rates by demographic, and alumni earnings by scholarship. The blog validates that data with stories.

---

## 2. Stakeholders

| Stakeholder | Needs | Value to Platform |
|---|---|---|
| **Students** (primary) | Find scholarships matching their profile quickly; trustworthy deadlines; application guidance | Traffic, engagement, ad impressions |
| **Scholarship providers** (universities, NGOs, corporations) | Reach qualified applicants; track application volume | Content supply, potential sponsored listings |
| **Advertisers** (test prep, education services) | Targeted placement to education-motivated audience | Revenue |
| **Guidance counselors / parents** | Curated, reliable scholarship lists for their students | Advocacy, sharing, recurring traffic |

---

## 3. Core Problem

Students in emerging markets face fragmented, time-sensitive, often predatory scholarship information spread across university notice boards, government gazettes, WhatsApp forwards, and outdated blog posts. Existing platforms (Scholarships.com, Edvisors, Fastweb) treat users as eyeballs rather than pilgrims — prioritizing ad density over discovery quality.

---

## 4. Job-to-be-Done

> "Help me find scholarships I'm eligible for, with deadlines I can trust, and tell me exactly how to apply — so I can fund my education without wasting hours on dead ends."

---

## 5. Design Set Coverage (6 Screens)

| Screen | Purpose | Status |
|---|---|---|
| Landing Page | Hero + value prop + featured scholarships/newsletter CTA | DRAFT — needs mobile-first revision |
| News Feed | Article and scholarship listing with filtering | DRAFT — needs ad placement strategy |
| Article Detail | Full article with inline ad slots | DRAFT — needs ad zone definition |
| About Us | Mission, team, trust signals | DRAFT — adequate |
| Newsletter Signup | Email capture with lead magnet | DRAFT — needs mobile optimization |
| Scholarship Directory | Searchable/filterable scholarship database | DRAFT — needs scanability redesign |

**Gaps identified (Round 1 — John/Mary):**
- Admin/content management dashboard
- User authentication / login
- Mobile layouts (all screens are 2560px desktop-only)
- Search results page
- Comment/discussion system
- Contributor/scholarship provider onboarding flow
- Empty states, error states, loading states
- Ad management dashboard

---

## 6. Feature Roadmap

### Phase 0 — Validate (Dr. Quinn's Experiment)
Publish 10 scholarship posts manually, geo-target a single country (e.g., Indonesia), run a $50 Facebook lead ad campaign to a landing page with "Notify me when X scholarship opens" email capture + 2 AdSense placements. Cost-per-email-acquisition vs bounce rate determines viability.

**Go/No-Go criteria:** CPEmail < $2.00 AND page bounce rate < 60% AND organic click-through > 2%.

### Phase 1 — MVP (Amelia's 10-Day Sprint)
- Static blog with 10 markdown-backed posts (Next.js SSG)
- One lazy-load ad slot component (IntersectionObserver + min-height 280px)
- Scholarship quiz — 10 questions, profile-based matching, instant results with 200 hand-curated scholarships
- Newsletter signup with ESP webhook
- `ads.txt` deployment

### Phase 2 — Headless CMS + Content Engine
- Headless CMS integration (Strapi/Contentful)
- Admin dashboard for content management
- Contributor onboarding workflow
- Scholarship sourcing template integration
- Editorial calendar + publishing workflow
- Search with filtering

### Phase 3 — Monetization + Growth
- Multi-ad-network management (AdSense + direct sold)
- Sponsored scholarship listings
- Affiliate matchmaking with test prep services
- University spotlight takeovers
- Ad management dashboard (impressions, clicks, RPM by placement)
- Comment/discussion system

### Phase 4 — Platform
- User accounts (students + providers)
- Personalized scholarship alerts
- Application tracking
- Community features (ratings, reviews, success stories)
- Mobile app

---

## 7. Monetization Strategy

| Channel | Timeline | Projected RPM |
|---|---|---|
| Google AdSense (display) | Phase 1 | $3-8 RPM |
| Newsletter sponsorship | Phase 1 | $15-30 CPM |
| Direct-sold display | Phase 2 | $8-15 RPM |
| Sponsored scholarship listings | Phase 2 | $200-500/listing |
| Affiliate (test prep, courses) | Phase 2 | 10-15% commission |
| University lead generation | Phase 3 | $5-15/qualified lead |

---

## 8. Key Success Metrics

- Monthly active users (MAU)
- Scholarship search-to-application rate
- Email capture conversion rate
- Ad RPM (revenue per thousand impressions)
- Content publishing cadence (posts/week)
- Average session duration
- Return visitor rate
- Cost per email acquisition
- Scholarship listing fill rate (applications/scholarship)

---

## 9. Competitive Landscape

| Competitor | Strength | Weakness |
|---|---|---|
| Scholarships.com | Large database | Poor UX, ad-heavy, outdated |
| Fastweb | Matching algorithm | US-centric, spammy emails |
| Edvisors | Quality content | Limited scholarship database |
| TikTok aggregators | High distribution | No depth, no trust signals |
| ChatGPT | Convenient search | No real-time data, no accountability |

**Scholarupdate moat:** Data layer — acceptance rates by demographic, real-time deadline tracking, profile-based confidence scores. Information arbitrage, not content.

---

## 10. Risks and Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| AdSense revenue below projections | High | Phase 0 experiment validates before scale; diversify revenue mix early |
| Content production bottleneck | High | Scholarship sourcing templates + contributor onboarding + AI-assisted drafting |
| Mobile traffic cannibalizes ad revenue | Medium | Mobile-first responsive design; AdSense auto-format units |
| Zero search traffic for 6+ months | Medium | Alternate distribution: TikTok micro-videos, WhatsApp forward loops, newsletter |
| Competitor AI aggregation reduces differentiation | Medium | Proprietary real-time data; community-verified application outcomes |
