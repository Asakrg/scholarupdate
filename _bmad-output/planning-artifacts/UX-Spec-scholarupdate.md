# Scholarupdate — UX Design Specification

**Version:** 1.0
**Date:** 2026-05-18
**Author:** Sally (UX Designer) — synthesized with Maya (Design Thinking), Caravaggio (Presentation), Paige (Tech Writer)

---

## 1. Design Philosophy

> "Hope deferred makes the heart sick." — Every pixel must whisper: *I see you. I prepared for you. This path will not betray you.*

Scholarupdate is not a blog. It is a **bridge** between "I deserve this" and "I found it." The emotional arc of scholarship hunting is hope → anxiety → search → rejection → repeat. The design must hold the student in that limbo, not just maximize RPM.

---

## 2. Primary Persona — Fatima

**Fatima**, 21, first-generation university student in Karachi. She works part-time, shares a phone with her sister, and has a $15/month data plan. She searches for scholarships at 2am after her shift ends. She has been burned by outdated listings and predatory "scholarship" sites. She needs to trust that you've done the work for her.

**Secondary personas:**
- **Mr. Okonkwo**, 45, guidance counselor in Lagos managing 200+ seniors
- **Siti**, 18, high school valedictorian in rural Indonesia, first in family to apply to university
- **Dr. Patel**, 38, CSR director at a multinational managing scholarship programs

---

## 3. Design Principles

| Principle | Application |
|---|---|
| **Mobile-first** | Start at 360px, scale up. 70%+ of traffic in emerging markets is mobile. |
| **Content-first** | Ads live *below* or *beside* — never interrupt. Hard 300px buffer after headline before first ad break. |
| **Signal vs noise** | Every element earns its place. If it doesn't help Fatima find a scholarship faster, cut it. |
| **Trust through clarity** | Deadlines verified, sources cited, "last verified" timestamps on every scholarship. |
| **Delight in utility** | Satisfaction comes from speed and accuracy, not decorations. |
| **Dignity in design** | Aspirational, not bureaucratic. Deep navy + amber accent. Confident typography. |

---

## 4. Page-by-Page UX Requirements

### 4.1 Landing Page (2560×2746 → responsive)
**Purpose:** Hero + value prop + featured scholarships + newsletter CTA

**Layout:**
- Hero section: One-line value prop ("Find scholarships that fit you"), primary CTA button
- Featured scholarships: 3-6 high-urgency cards with deadline countdowns
- Newsletter section: "Get 5 scholarships in your inbox weekly" with email input
- Trust signals: "X scholarships found this month", "Y students matched"

**Mobile (360px):**
- Single column, stacked hero → cards → newsletter
- Sticky topbar with search + menu reduced to hamburger
- Hero CTA must be visible without scroll (above 280px ad zone)

**Ad placement:**
- Above-fold hero is AD-FREE
- Below newsletter section: 1 responsive display ad
- Sidebar ad slot on desktop only (300×600)

### 4.2 News Feed (2560×3310 → responsive)
**Purpose:** Article and scholarship listing with filtering

**Layout:**
- Filter bar (persistent on scroll): audience, field, urgency, amount range
- Card grid: 2-3 columns desktop, single column mobile
- Each card: Scholarship name (bold), amount (2nd hierarchy), deadline countdown (colored ribbon), quick-apply CTA
- Loading skeleton for infinite scroll

**Color-coded urgency ribbons:**
- Green: Open (>30 days to deadline)
- Yellow: Closing soon (7-30 days)
- Red: Critical (<7 days)

**Ad placement:**
- 1 native ad card every 12 organic results (desktop right rail)
- 1 native ad card every 8 organic results (mobile inline)
- No ads in filter bar or above first result

### 4.3 Article Detail (2560×4422 → responsive)
**Purpose:** Full article with inline ad slots

**Layout:**
- Article header: Title, author, publish date, estimated read time
- Content body with responsive typography (18px body, 130% line-height)
- Related scholarships section at bottom
- Newsletter CTA between article and related section

**Content hierarchy (F-pattern):**
- H1: Article title (largest)
- H2: Section breaks within article
- Lead paragraph: "Who this is for" summary before first ad break
- Callout boxes for deadlines, amounts, key facts

**Ad placement:**
- Par 1: Content (no ad)
- After par 2: First inline ad (300×250 responsive)
- After par 4: Second inline ad
- Bottom of article: Third ad
- Right sidebar: Sticky 300×600 (desktop only)
- Hard rule: 300px buffer after headline before first ad

### 4.4 Scholarship Directory (2560×4156 → responsive)
**Purpose:** Searchable/filterable scholarship database (highest RPM page)

**Layout:**
- Data-table-meets-card hybrid
- Persistent floating filter bar (never scrolls away)
- Scholarship cards: Name (largest), Amount (2nd), Deadline with colored ribbon (3rd)
- Quick filters: audience, field, urgency, country
- Search bar with autocomplete

**Filter behavior:**
- Category tags as top-row pills (fast toggle)
- Expandable "Advanced filters" panel
- Results count always visible ("42 scholarships match your profile")
- Empty state: "We don't have matches yet — tell us what you need" with email notify form

**Scanability rules (Caravaggio):**
- 2 seconds to parse "is this for me?"
- Dollar signs visually prominent
- Icons: 🎓 merit, 💰 need-based, 🌍 international
- Whitespace between cards is breathing room, not wasted space

### 4.5 Newsletter Signup (2560×2688 → responsive)
**Purpose:** Email capture with lead magnet

**Layout:**
- Single purpose page: headline + lead offer + email input + submit
- Lead magnet: "Get 10 hand-picked scholarships sent to your inbox every Monday"
- Social proof: subscriber count, testimonial
- Privacy assurance: "No spam, unsubscribe anytime"
- Confirmation page with share CTAs (WhatsApp, Telegram)

**Ad placement:**
- Below-fold only
- 1 display ad after the signup form

### 4.6 About Us (2560×4618 → responsive)
**Purpose:** Mission, team, trust signals

**Layout:**
- Mission statement
- Team/credibility section
- Testimonials
- Contact / social links

**Ad placement:**
- 1 ad at bottom of page only (low RPM page)

---

## 5. UX Flows Missing from Designs

| Flow | Priority | Description |
|---|---|---|
| Search results | High | Autocomplete, filtered results, no-results empty state |
| Quiz/matching | High | 10-step questionnaire → profile-based results |
| User auth/signup | Medium | Email/password, Google OAuth |
| Admin dashboard | Medium | Content management, analytics, ad management |
| Contributor onboarding | Medium | Scholarship submission form, review workflow |
| Comments/discussion | Low | Per-article thread, moderation queue |
| Error states | High | 404, 500, network failure, all screens |
| Loading skeletons | High | Feed, directory, article, all list views |
| Ad-blocker fallback | Medium | Graceful "support us by whitelisting" overlay, not a paywall |

---

## 6. Responsive Breakpoints

| Breakpoint | Target | Layout |
|---|---|---|
| 360-480px | Phone | Single column, stacked, hamburger nav |
| 481-768px | Tablet | 2-column grid, visible top nav |
| 769-1200px | Small desktop | 2-3 column grid, sidebar ads |
| 1201px+ | Wide desktop | Full layout as designed (2560px reference) |

---

## 7. Design Sprint Recommendation (Maya)

Run a 5-day Design Sprint before coding:
- **Day 1:** Empathy map for each stakeholder, full emotional journey mapping (not just happy path)
- **Day 2:** Sketch divergent solutions for search-and-apply flow
- **Day 3:** Decide on one experience to prototype
- **Day 4:** Build clickable mobile prototype in Figma (375px)
- **Day 5:** Test with 5 real students in a campus library, observe silently

---

## 8. Visual Design Language (Caravaggio's Specifications)

**Color:**
- Primary: Deep indigo/navy (#1B2A4A) — trust, professionalism, ambition
- Accent: Amber/Coral (#FF8C42) — CTAs, scholarship amounts, urgency
- Background: Off-white (#F8F6F3) — warm, not clinical
- Text: Near-black (#1A1A1A) on white backgrounds

**Typography:**
- Headlines: Bold, editorial scale — like a high-end publication, not a government form
- Body: 18px serif or neutral sans-serif, 130-150% line-height
- Data (deadlines, amounts): Monospace or tabular figures for alignment

**Iconography:**
- 🎓 Merit-based | 💰 Need-based | 🌍 International
- Deadline ribbons: Green/Yellow/Red (color-blind safe patterns: dots, stripes, solid)

**Emotional tone:**
- "This is your launchpad" — not "Here are your documents"
- Aspirational, not bureaucratic
- Whitespace = breathing room for hope

---

## 9. Ad-Blocker Strategy

- Detect ad-blocker via `requestAnimationFrame` check on ad container height
- First visit: no message
- After 3 visits with blocker: show dismissible "We understand" message
- After 5 visits: subtle banner asking for whitelist
- Never: paywall, content blockade, or aggressive interstitials
- Offer: "Subscribe to our free newsletter instead" as alternative support
