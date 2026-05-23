# Scholarupdate — Full Agent Roundtable Summary

**Date:** 2026-05-18
**Project:** scholarupdate — scholarship discovery platform with CMS + ad monetization

---

## Round 1 — Core BMAD Team

### 📋 John (Product Manager)
- **Core question:** Reference site (directory) or media site (news/analysis)? Two different products.
- Newsletter is the real monetization engine, AdSense is secondary.
- **Missing from designs:** admin dashboard, login/auth, mobile layouts, search, comments system, contributor workflow.
- Key ask: "Who writes the content, who reads it, and what job are they hiring this site to do?"

### 🎨 Sally (UX Designer)
- **Persona:** Fatima — first-gen student on mobile at 2am, limited data plan.
- 70%+ mobile traffic in emerging markets. 2560px designs = desktop-first blind spot.
- Core tension: ad density vs readability.
- **Needed:** Mobile-first wireframes (375px↑), content-first grid audit, ad placement heatmap, ad-blocker fallback (graceful, not paywall).

### 🏗️ Winston (System Architect)
- **Stack:** Next.js + headless CMS (Strapi → Contentful scale-up). No WordPress (security + performance coupling).
- SSG with ISR for sub-second page loads. Ads lazy-loaded via IntersectionObserver.
- CLS prevention via `min-height` placeholders on all ad slots.
- Hosting: Vercel (frontend) + Railway/VPS (CMS).

### 📊 Mary (Business Analyst)
- **3 stakeholders:** Readers (traffic), scholarship providers (content), advertisers (revenue).
- Scholarship Directory = highest RPM page — high-intent traffic.
- $3-8 RPM projected on AdSense alone. Need direct-sold placements + affiliate for meaningful revenue.
- **Missing:** Ad placement strategy, contributor onboarding, ad management dashboard.
- Traffic path: SEO on long-tail scholarship queries (6-12 month compound).

---

## Round 2 — Creative CIS Team

### 🎨 Maya (Design Thinking Maestro)
- **Empathy gap:** Fatima is one of many — missing providers, counselors, parents, international students.
- Emotional arc of scholarship hunting: hope → anxiety → rejection → repeat.
- "More screens ≠ more value." Empty states, error states, and the "waiting" moment are missing.
- **Proposal:** 5-day Design Sprint — map full emotional journey, prototype mobile-first, test with 5 real students.

### 🔬 Dr. Quinn (Master Problem Solver)
- **Root problem:** "Reducing transaction cost of finding trustworthy, timely scholarship info."
- **Weakest link:** Content loop is undefined — who creates the 20+ posts/month needed for SEO?
- **Highest risk:** AdSense on a new domain generating meaningful revenue before contributor burnout.
- **Minimal experiment:** 10 posts + $50 FB ad campaign in 1 country. Measure CPEmail and bounce rate. Validate before coding.

### 🧠 Carson (Elite Brainstorming Specialist)
- **YES AND ideas:** Gamified scholarship directory (streaks, leaderboards, community ratings).
- **Revenue beyond AdSense:** Sponsored scholarships, affiliate matchmaking (Kaplan/test prep), university spotlights.
- **Wild ideas:** AI essay writing for scholarship applications, Scholarship Savings Pots (auto-apply for 5% of winnings).
- Energy: "The grind → a game."

### ⚡ Victor (Disruptive Innovation Oracle)
- **Contrarian thesis:** A blog in 2026 is dead. Competing with TikTok and ChatGPT.
- **Real moat:** Data layer — acceptance rates by demographic, real-time deadlines, profile-based confidence scores.
- **Reframe:** Scholarupdate = scholarship matching engine disguised as a media brand.
- **$10K / 3 months:** Build a single-page matching quiz with 200 hand-curated scholarships. Blog is the SEO bait; matching is the business.

---

## Round 3 — Specialists

### 📚 Paige (Technical Writer)
- **Content model:** 3 entities — Scholarships (deadline/amount/eligibility), Articles (how-to/success), Newsletters (digest).
- **Taxonomy:** audience (high-school/undergrad/grad/international), field (STEM/humanities/vocational), urgency (open/closing-soon/expired).
- **First docs:** Content Style Guide, Scholarship Sourcing Template (15-min fill-in), Ad Placement Playbook, API schema.
- Documentation reduces content bottleneck by turning writing into data entry.

### 💻 Amelia (Senior Software Engineer)
- **10-day MVP:** Next.js SSG + 10 markdown posts + AdSlot component + quiz page. No CMS, no backend, zero infra cost.
- Full component tree, file structure, test strategy provided.
- **AdSlot spec:** IntersectionObserver + min-height placeholder. DOM nodes via createElement (no dangerouslySetInnerHTML).
- **Sprint:** Days 1-4 scaffold + content → 5-6 ads → 7-8 quiz → 9-10 responsive + lighthouse + deploy.
- Everything beyond sprint 2 depends on Dr. Quinn's validation experiment.

### 🎬 Caravaggio (Presentation Master)
- **Design critique:** 2560px = designing in a vacuum. Start at 360px.
- **Visual hierarchy for ads:** Gestalt + F-pattern. Native ads on right rail (desktop) and between sections (mobile). 300px buffer after headline.
- **Scholarship Directory:** Data-table-card hybrid. Name (biggest), amount (2nd), deadline with color ribbon (3rd). Persistent floating filters.
- **Visual identity:** Deep indigo/navy + amber accent. Editorial-scale typography. "Your launchpad" not "your documents."
- **3-second audit checklist:** Content vs ad distinction? Hero clarity? Focal hierarchy? Card scanability? Moment of delight?

---

## Round 4 — Synthesis

### 📖 Sophia (Master Storyteller)
- **The wound:** Fatima searching at 2am — not doomscrolling, but searching. Dignity, not information scarcity.
- **The tension is orchestration:** Winston's boring bedrock + Victor's disruption + Carson's gamification + Dr. Quinn's empiricism = all correct at different altitudes.
- **The one truth:** "Hope deferred makes the heart sick." Every pixel must say "I see you. I prepared for you."
- **The metaphor:** "The library at Alexandria, rebuilt not for scrolls but for doorways. A thousand archways, each lit by a name, each leading to a future someone once believed was not for them."

---

## Key Decisions

| Decision | Consensus | Source |
|---|---|---|
| Next.js + headless CMS | ✅ Winston + Amelia | Arch + Dev rounds |
| Validate before building | ✅ Dr. Quinn + John + Amelia | Experiment-first approach |
| Mobile-first responsive | ✅ All 10 agents | Universal agreement |
| Quiz/matching as core product | ✅ Victor + Amelia + Paige | Not just a blog |
| Ad density constraint | ✅ Sally + Caravaggio + Maya | Content-first, ads second |
| Newsletter = real monetization | ✅ John + Mary | AdSense is secondary |
| Documentation reduces bottleneck | ✅ Paige + Dr. Quinn | Templates + style guide |
| Design sprint before code | ✅ Maya + Sally | Validate UX with real students |

---

## Output Documents

| Document | File |
|---|---|
| Product Requirements Document | `PRD-scholarupdate.md` |
| UX Design Specification | `UX-Spec-scholarupdate.md` |
| Technical Architecture Document | `Technical-Architecture-scholarupdate.md` |
