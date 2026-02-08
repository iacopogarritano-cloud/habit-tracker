# Development Journey - Habit Tracker

> **Product Philosophy:** Vision-first, code-second. Building a portfolio project that demonstrates PM thinking, not just development skills.

---

## 🎯 Project Mission

Building a habit tracking application to demonstrate end-to-end product management capabilities while learning modern web development. This project showcases:

- **Product thinking** over pure execution
- **User-centric approach** to feature development
- **PM-developer collaboration** workflow (with Claude as engineering partner)
- **Professional documentation** and backlog management
- **Strategic decision-making** in product development

**Target outcome:** A portfolio piece that demonstrates readiness for Product Manager roles at tech companies (Bending Spoons, Google, Meta, etc.)

---

## 📊 Product Strategy

### The Opportunity
*(To be defined after brainstorming session)*

**Current State:**
- Market research: Pending
- User personas: To be developed
- Unique value proposition: Under exploration
- Competitive analysis: Planned

**Next Steps:**
- Deep dive into user needs and market gaps
- Define USP (Unique Selling Proposition)
- Establish success metrics and OKRs

---

## 🛠️ Development Milestones

### Phase 0: Foundation & Setup ✅
**Completed:** February 2026

**Key Achievements:**
- ✅ Created comprehensive PRD (Product Requirements Document)
- ✅ Setup development environment (Mac + Windows)
- ✅ Configured Git workflow with proper version control
- ✅ Published first commit to GitHub
- ✅ Established PM-driven documentation approach

**Technical Stack Chosen:**
- React + Vite (modern, fast, industry-standard)
- LocalStorage for MVP (simplest viable solution)
- Future-ready for database migration

**PM Skills Demonstrated:**
- Requirements gathering and documentation
- Technical decision-making with clear rationale
- Cross-platform development considerations
- Version control and collaboration setup

**Challenges Overcome:**
1. **Environment setup across multiple machines** - Solved by documenting setup process for both macOS and Windows
2. **Learning Git fundamentals** - Established clean commit history from day one
3. **Balancing learning curve with progress** - Chose appropriate tech stack for skill level

**Lessons Learned:**
- Importance of documentation from the start
- Value of clear PRD even for personal projects
- Git workflow as collaboration enabler

---

### Phase 1: Product Discovery ✅ COMPLETE
**Started:** February 5, 2026
**Completed:** February 6, 2026
**Duration:** 2 sessions (intensive research + backlog creation)

**Completed:**
- ✅ Comprehensive market research (13.06B → 43.87B market, 14.41% CAGR)
- ✅ Competitive analysis (HBT, Habitica, Streaks, Loop, Notion)
- ✅ Identified CRITICAL retention crisis (52% abandon in 30 days)
- ✅ User personas (Marco, Sofia, Luca)
- ✅ Value proposition definition
- ✅ **UNIQUE DIFFERENTIATOR discovered:** Habit Weighting/Prioritization
- ✅ Business model decision (free + ads poco invasive)
- ✅ **BACKLOG.md created** with WSJF framework (11 user stories)
- ✅ Prioritization methodology defined and documented

**Key Insights:**
- **Habit Weighting = Market Gap:** ZERO competitor offre weighted habits dashboard
- **Retention Crisis = Real Opportunity:** Design tutto per retention, non acquisition
- **"Free-to-Useless" Frustration:** Users want honest pricing, generous free tier
- **Habitica Research Bomb:** Academic study shows gamification *"actively harmful"*
- **HBT Paywall Validated:** User's pain point confirmed (*"only good if upgrade"*)

**Tools & Approach Used:**
- Web research (App Store reviews, Reddit, academic papers)
- Design Thinking (Empathize & Define phases)
- Lean Startup validation approach
- Competitive positioning matrix

---

### Phase 2: Backlog & Prioritization ✅ COMPLETE
**Started:** February 6, 2026
**Completed:** February 6, 2026
**Duration:** 1 session

**Completed:**
- ✅ **WSJF Framework** (Weighted Shortest Job First) selection and implementation
- ✅ Created BACKLOG.md with 11 detailed user stories
- ✅ All stories include: Extended template, Acceptance criteria, Technical notes, WSJF scoring
- ✅ Prioritization: 5 Must Have, 3 Should Have, 2 Could Have, 1 Won't Have
- ✅ MoSCoW automatic derivation from Story Points
- ✅ Notion formula created for auto-calculation (shared with user's personal backlog)
- ✅ Documentation updates (.claudecode generic + project, STATO.md)

**Key Insights:**
- **WSJF over MoSCoW/RICE:** For portfolio PM project, complete framework demonstrates advanced competencies
- **Default values reduce overhead:** TC=1, RROE=1 for 80% of features → not complex in practice
- **Quick wins emerge naturally:** Formula (BV × TC × RROE) / Job Size surfaces high-value, low-effort stories
- **Fibonacci > T-shirt:** More granularity for estimation, industry standard
- **BACKLOG.md > Notion for solo-dev:** Faster, Git-tracked, no integration overhead

**Estimated MVP Scope:**
- Must Have stories: ~18 Story Points
- Solo-dev velocity: 5-8 SP/week
- **Timeline: 3-4 weeks for MVP**

**PM Skills Demonstrated:**
- Prioritization framework selection (compared 3 methodologies)
- User story writing (extended template with 7 fields)
- Acceptance criteria definition
- Effort estimation (Job Size, Story Points)
- Backlog organization and maintenance planning
- Trade-off decision (Notion vs local for this context)

---

## 🎓 PM Competencies Developed

### Strategic Thinking
- [x] Market analysis and opportunity identification
- [x] PRD creation and maintenance
- [x] Competitive positioning
- [x] Long-term product vision

### Product Execution
- [x] Requirements documentation
- [x] Backlog management (BACKLOG.md with WSJF)
- [x] Feature prioritization (WSJF framework)
- [x] Technical decision-making

### Collaboration & Communication
- [x] Working with engineering (Claude as proxy)
- [x] Clear documentation practices
- [ ] Stakeholder communication (simulated)
- [x] Version control for team collaboration

### Technical Proficiency
- [x] Understanding modern web development
- [x] Git/GitHub workflow
- [ ] API integrations (Notion)
- [ ] Data modeling and architecture discussions

---

## 💡 Key Insights & Decisions

### Decision Log

**1. Tech Stack Choice (React + Vite)**
- **Decision:** Use React with Vite instead of vanilla JS or other frameworks
- **Rationale:** Industry standard, modern tooling, transferable skills
- **Trade-offs:** Steeper learning curve vs faster development later
- **Outcome:** TBD

**2. LocalStorage for MVP**
- **Decision:** Use browser LocalStorage instead of immediate database
- **Rationale:** Fastest path to working MVP, learn core concepts first
- **Trade-offs:** No cross-device sync vs simpler initial implementation
- **Outcome:** TBD

**3. PM-First Approach**
- **Decision:** Prioritize product thinking and documentation over rushing to code
- **Rationale:** Portfolio needs to show PM competencies, not just coding
- **Trade-offs:** Slower initial development vs stronger portfolio narrative
- **Outcome:** Creates more compelling story for PM interviews

**4. Habit Weighting Feature (CRITICAL)**
- **Decision:** Make weighted habits/dashboard the CORE differentiator
- **Rationale:**
  - User's personal pain point (HBT treats all habits equally)
  - Competitive research validates: Disciplined app complaint *"habits counted equally"*
  - ZERO competitors offer this (market gap!)
  - Solves real problem: "not all habits have same importance in life"
- **Trade-offs:** Adds complexity to MVP vs HUGE differentiation value
- **Outcome:** **UNIQUE selling point** - formula: `weighted_completion = Σ(weight × completion) / Σ weight`

**5. Business Model: Free + Ads**
- **Decision:** Free forever con ads poco invasive (non freemium with paywall)
- **Rationale:**
  - User frustration with HBT paywall validated in research
  - No competitor uses ad-supported model (market gap!)
  - Daily usage = good ad revenue potential
  - Builds trust (no "free-to-useless" dark patterns)
- **Trade-offs:** Lower revenue per user vs higher retention and user goodwill
- **Outcome:** TBD (MVP first)

**6. Retention-First Design Philosophy**
- **Decision:** Design EVERY feature asking "does this increase 90-day retention?"
- **Rationale:** 52% abandon within 30 days - this is THE problem to solve
- **Implementation:**
  - Compassionate streaks (recovery mode, no punishment)
  - Focus on progress vs perfection
  - Intrinsic motivation (weighted dashboard shows real life impact)
- **Outcome:** TBD (will measure D30 retention post-launch)

**7. WSJF Prioritization Framework (vs MoSCoW/RICE)**
- **Decision:** Use complete WSJF (Business Value × Time Criticality × RROE / Job Size)
- **Rationale:**
  - Portfolio project → demonstrate advanced PM competencies in interviews
  - Quantitative justification for prioritization decisions
  - Scalable if project grows post-portfolio
  - Default values (TC=1, RROE=1) keep overhead low for 80% of features
  - Quick wins emerge naturally from formula
- **Trade-offs:** More initial setup vs deeper insights and interview talking points
- **Outcome:** 11 user stories prioritized, clear MVP scope (5 Must Have = 18 SP ≈ 3-4 weeks)

**8. BACKLOG.md Local (vs Notion MCP Integration)**
- **Decision:** Manage backlog in local BACKLOG.md file instead of Notion
- **Rationale:**
  - Technical issues with Notion MCP server integration (tool exposure problems)
  - Faster and more functional for solo-dev workflow
  - Git-tracked (versioned, diffable)
  - No dependency on external service for core workflow
  - Notion formulas shared for user's personal reference
- **Trade-offs:** Less relational power (no DB links) vs velocity and simplicity
- **Outcome:** BACKLOG.md created with 11 stories, ready for development

---

## 📈 Metrics & Success Criteria

### Project Success Metrics
*(To be defined)*

**Potential Metrics:**
- User engagement (DAU/MAU)
- Habit completion rates
- Retention (D1, D7, D30)
- Feature adoption

### Portfolio Success Metrics
- GitHub visibility (stars, forks)
- Interview callbacks from target companies
- Quality of PM conversations in interviews
- Demonstrated learning progression

---

## 🔄 Workflow & Methodology

### Development Approach
1. **Discover** - User research, market analysis
2. **Define** - PRD, user stories, acceptance criteria
3. **Design** - Architecture decisions, UI/UX planning
4. **Develop** - Iterative implementation with Claude
5. **Document** - Continuous journey updates

### Tools Ecosystem
- **Version Control:** Git + GitHub
- **Documentation:** Markdown (PRD, JOURNEY, STATO)
- **Backlog Management:** Notion (planned)
- **Development:** VS Code + Claude Code
- **Deployment:** TBD

---

## 🚀 Roadmap

### Immediate Next Steps
1. Product brainstorming and market research
2. Notion backlog integration
3. Define MVP scope and first user stories
4. Begin feature development

### Medium Term (V1)
- Core habit tracking functionality
- Clean, minimal UI
- Data persistence
- Basic analytics

### Long Term (V2+)
- User accounts and sync
- Social features
- Advanced analytics
- Mobile app consideration

---

## 📝 Running Commentary

### Session 1 - February 1, 2026
Initial project conception and setup. Made the strategic decision to treat this as a PM portfolio piece rather than just a coding exercise. This shifts the focus from "can I build something" to "can I think like a PM and work effectively with engineering."

### Session 2 - February 5, 2026 (Morning)
GitHub setup completed. Realized the importance of having this JOURNEY document to track not just what we built, but **why** and **how** we made decisions. This document itself demonstrates PM thinking - documentation, communication, strategic narrative.

**Key insight:** The real value of this project isn't the code - it's the process, decisions, and thinking demonstrated along the way.

---

### Session 3 - February 5, 2026 (Afternoon) - MAJOR DISCOVERY SESSION 🚀

**What Happened:**
Intensive Product Discovery phase - completed comprehensive market research, competitive analysis, and discovered our UNIQUE differentiator.

**Key Discoveries:**

1. **Market Validation MASSIVE**
   - $13.06B (2025) → $43.87B (2034) market
   - But 52% abandon apps within 30 days (RETENTION CRISIS!)
   - 44% lose motivation after breaking streaks

2. **Competitive Intel - HBT Validated**
   - User's current app (HBT) confirmed: aggressive paywall
   - Reviews: *"only good if you upgrade"*
   - This validates our "honest pricing" approach

3. **Habitica Research BOMB**
   - Academic study (45 users): gamification is *"actively harmful"*
   - Point system rewards procrastination
   - **Implication:** Light/optional gamification only, focus intrinsic motivation

4. **THE BIG ONE: Habit Weighting**
   - User insight: "Not all habits have same importance"
   - Examples: Produttività personale (5/5) vs Lavarsi denti (2/5)
   - Research validates: Disciplined app complaint *"habits counted equally"*
   - **ZERO competitors** offer weighted dashboard
   - **This is our killer feature!**

5. **Loop Habit Tracker (not "Delta")**
   - Corrected competitor error
   - 5M+ downloads, completely free, open source
   - Proves demand for privacy + zero cost
   - But no iOS, no cloud sync = our opportunity

**Decisions Made:**

- ✅ **Habit Weighting** as core MVP feature (1-5 importance scale)
- ✅ **Weighted Dashboard** showing % completion of true priorities
- ✅ **Business Model:** Free + ads (no competitor does this!)
- ✅ **Multiple check-in options:** Drag bar, +/-, checkbox (user choice)
- ✅ **Retention-first design:** Every feature evaluated for 90-day retention
- ✅ **Cross-platform:** Web MVP → iOS V2 (Apple Health) → Android V3

**Challenges Overcome:**

- Initial confusion on "Delta" competitor (resolved: Loop Habit Tracker)
- Balancing simplicity vs power (solution: progressive disclosure)
- Monetization strategy (solution: honest ads model, not freemium)

**Lessons Learned:**

1. **User's personal pain = market validation gold** - habit weighting came from user's frustration with HBT, research proved it's a market gap
2. **Research > assumptions** - academic study on Habitica gamification changed our approach
3. **Retention crisis is THE opportunity** - not sexy, but solving 52% churn is huge
4. **Be different where it matters** - weighted dashboard is simple concept but ZERO competitors have it

**PM Competencies Demonstrated:**

- [x] Market sizing and trend analysis
- [x] Competitive research and positioning
- [x] User pain point identification and validation
- [x] Feature prioritization based on market gaps
- [x] Business model strategy
- [x] Data-driven decision making (research over gut feel)
- [x] Lean validation approach

**Portfolio Talking Points from This Session:**

> "I identified a critical market gap through competitive analysis: while the habit tracking market is $13B and growing 14% annually, every app treats habits equally. Users complained in reviews that 'habits are counted equally' without weighing importance. I validated this with my own frustration using HBT - brushing teeth shouldn't count the same as personal productivity goals. I designed a weighted dashboard feature that NO competitor offers, turning completion % into an actionable insight about life priorities."

> "I discovered through academic research that gamification can be counterproductive. A 45-user study on Habitica found the point system 'actively harmful' and rewards procrastination. This insight led me to reject gamification for our MVP and focus on intrinsic motivation through weighted progress visibility."

**Metrics to Track (Post-Launch):**

- D30 retention (target: >52% to beat market average)
- Weighted dashboard usage (% of users who set different weights)
- Free tier engagement (prove ad model works)
- Time to first habit created (<60 seconds target)

---

### Session 4 - February 6, 2026 - BACKLOG CREATION & WSJF 📊

**What Happened:**
Complete backlog creation session with WSJF prioritization framework. Attempted Notion MCP integration (learning experience), pivoted to local BACKLOG.md for velocity.

**Key Activities:**

1. **Notion MCP Integration Attempt (2+ hours)**
   - Installed Notion MCP server from VS Code marketplace
   - Configured OAuth authentication (successful)
   - Technical blocker: MCP tools not exposed to Claude Code session
   - **Security lesson:** Accidentally shared API key publicly → immediate revocation
   - **Decision:** Pivot to local BACKLOG.md (velocity > integration)

2. **Prioritization Framework Selection**
   - Evaluated: MoSCoW (simple), RICE (balanced), WSJF (complete)
   - **Choice:** WSJF (Weighted Shortest Job First)
   - Rationale: Best for portfolio PM demonstration + quantitative justification
   - Formula: Story Points = (Business Value × Time Criticality × RROE) / Job Size
   - All values use Fibonacci scale (1, 2, 3, 5, 8, 13)

3. **BACKLOG.md Creation**
   - 11 user stories written with extended template:
     - As a / When / In / Since / I want / Doing this / To/So that
     - Acceptance criteria (checkbox lists)
     - Technical notes for implementation
     - Complete WSJF scoring
   - **Prioritization breakdown:**
     - 5 Must Have (~18 SP) → Core MVP
     - 3 Should Have (~15 SP) → Post-MVP
     - 2 Could Have (~4 SP) → Nice-to-have
     - 1 Won't Have (~1 SP) → Out of scope
   - MoSCoW automatically derived from Story Points (SP ≥ 8 = Must)

4. **Documentation Updates**
   - .claudecode generic: Added BACKLOG.md as standard document #5
   - .claudecode project: Status → "Ready for Development"
   - STATO.md: Complete session chronicling
   - JOURNEY.md: This writeup + new decisions

**Key Decisions:**

- ✅ WSJF over simpler frameworks (portfolio value)
- ✅ BACKLOG.md local over Notion (velocity)
- ✅ Fibonacci scaling for granularity
- ✅ Default values (TC=1, RROE=1) to reduce overhead
- ✅ Extended user story template for completeness

**Challenges Overcome:**

- **MCP Integration Failure:** Technical limitations → productive pivot
- **API Key Security Incident:** Shared publicly → learned lesson, revoked immediately
- **Framework Choice Paralysis:** Resolved by considering portfolio context (WSJF wins)

**Lessons Learned:**

1. **Don't let perfect block good:** Spent 2+ hours on Notion integration, local file was faster
2. **Security hygiene matters:** Never share API keys, even in seemingly private contexts
3. **Portfolio context drives decisions:** WSJF more complex but better story for interviews
4. **Default values make frameworks practical:** TC=1, RROE=1 for most stories = not overhead
5. **Estimation is relative:** Fibonacci helps team alignment even solo (forces thinking)

**PM Competencies Demonstrated:**

- [x] Backlog creation and management
- [x] User story writing (extended template)
- [x] Prioritization framework application (WSJF)
- [x] Effort estimation and velocity planning
- [x] Trade-off decision making (Notion vs local)
- [x] Pragmatic pivoting when blocked
- [x] Documentation and process definition

**Portfolio Talking Points from This Session:**

> "I evaluated three prioritization frameworks - MoSCoW, RICE, and WSJF - for the backlog. I chose WSJF (Weighted Shortest Job First) because it provides quantitative justification for every prioritization decision. The formula (Business Value × Time Criticality × Risk/Opportunity Enablement divided by Job Size) naturally surfaces quick wins. For example, our top story scores 13.3 points: it's the highest-value feature (BV=8), it's time-critical (TC=2), it enables our entire value prop (RROE=5), with medium effort (JS=3). This beats a story with BV=8 but JS=8 (only 2 points)."

> "When the Notion MCP integration hit technical blockers after 2+ hours, I made a pragmatic pivot to a local BACKLOG.md file. As a PM, I had to weigh the ideal solution (Notion's relational database) against velocity (shipping working software). For a solo-dev MVP, the local file was the right trade-off - it's Git-tracked, version-controlled, and doesn't block development. This demonstrates product pragmatism over technical perfection."

**Metrics & Estimates:**

- **MVP Scope:** 5 Must Have stories (18 Story Points)
- **Estimated Velocity:** 5-8 SP/week (solo-dev, learning React)
- **Timeline:** 3-4 weeks to completable MVP
- **Top Priority:** US-001 (Dashboard weighted progress, SP: 13.3)

---

### Session 5 - February 7, 2026 - SCORING SYSTEM DESIGN & DEV START 🚀

**What Happened:**
Final design decisions on the weighted scoring system before starting development. Resolved complexity around multi-timeframe habits (daily/weekly/monthly) with an elegant solution.

**Key Design Decision: Multi-Timeframe Scoring (V2)**

The challenge: How do monthly habits contribute to a daily dashboard without "gaming" the system?

**Solution designed:**
- All habits contribute **daily points**
- Daily habit completed → points THAT day
- Weekly habit completed → points "spread" across ALL 7 days
- Monthly habit completed → points "spread" across ALL 30 days
- **Partial completion** supported: 50% done = 50% × weight points

**Example validation:**
| Habit | Timeframe | Weight | Monthly Points |
|-------|-----------|--------|----------------|
| Vegetables (daily, w=5) | 30 days × 5 | = 150 pt |
| Date night (monthly, w=3) | 30 days × 3 | = 90 pt |

**Key insight:** The system delegates priority-setting to the user. Someone who "games" with only easy monthly habits is self-deceiving - and the low score reflects it. No manipulative gamification needed.

**Decisions Made:**
- ✅ MVP: Daily habits only (simplicity)
- ✅ V2: Multi-timeframe with "spread" logic documented in BACKLOG.md
- ✅ Partial completion in MVP (50% done = 50% points)
- ✅ Added US-012: Retroactive check-in editing (Could Have)

**Portfolio Talking Points from This Session:**

> "The scoring system delegates responsibility to users for defining their own priorities, then reflects them honestly. There's no manipulative gamification - if someone 'games' by only doing easy monthly tasks, their low daily score shows it. This is intentional: the app is a mirror, not a judge. Users who set meaningful weights and pursue daily consistency are rewarded proportionally."

> "I considered the edge case where monthly habits could 'hack' the score (one action = 30 days of points). The solution was spreading points across days AND letting users control weights. A monthly 'date night' (weight 3) gives 90 points/month, but daily 'vegetables' (weight 5) gives 150. Consistency on high-priority items wins - which is exactly the behavior we want to encourage."

**Development Order Decided:**
1. US-005: LocalStorage persistence (foundation)
2. US-002: Create habit with weight
3. US-003: Habit list display
4. US-004: Check-in with partial completion
5. US-001: Weighted dashboard (the differentiator)

---

### Session 6-7 - February 6-7, 2026 - DEVELOPMENT SPRINT 🏗️

**What Happened:**
Intensive development sprint completing the core MVP functionality. Went from zero UI to a fully working habit tracker with all CRUD operations, weighted progress dashboard, and persistence.

**User Stories Completed:**
- ✅ US-001: Dashboard con progresso pesato giornaliero
- ✅ US-002: Creare abitudine con campo peso (WeightSelector, HabitForm)
- ✅ US-003: Visualizzare lista abitudini
- ✅ US-004: Check-in con multiple input modes (+/-, checkbox)
- ✅ US-005: LocalStorage persistence con schema versioning
- ✅ US-006: Modificare abitudine esistente
- ✅ US-007: Eliminare abitudine con conferma

**Key Implementation Decisions:**
1. **Custom React Hook Pattern:** Created `useHabitStore` - encapsulates all state logic, exposes clean API
2. **Schema Versioning:** Storage has `version: 1` field for future migrations
3. **Map for O(1) Lookup:** Used JavaScript Map for check-in lookups instead of array.find()
4. **CSS Vanilla → shadcn/ui Later:** Kept styling simple, postponed design polish

**UI Improvements Based on User Feedback:**
- Fixed button order (+, -, edit, delete)
- Replaced checkbox input with styled button
- Fixed color picker ellipses → circles with aspect-ratio

---

### Session 8 - February 7, 2026 - GAMIFICATION & BACKLOG EXPANSION 🔥

**What Happened:**
Completed US-008 (Streak e cronologia) adding gamification elements. Expanded backlog with two new user stories based on user feedback.

**US-008 Implementation:**
- **Streak Calculation:** Current streak (consecutive days), longest streak (all-time record)
- **Completion Rate:** % of completed days over last 30 days
- **HabitDetail Component:** Modal with stats grid and 30-day calendar
- **Calendar UI:** GitHub contribution graph style (green/yellow/gray squares)
- **Performance:** Used Map for O(1) check-in lookups

**New User Stories Added:**
1. **US-015: Unità di misura personalizzabili**
   - User feedback: "3" doesn't mean anything without context
   - Brainstormed categories: tempo, liquidi, peso, distanza, conteggio, lettura, fitness, etc.
   - 40+ unit presets organized by category

2. **US-016: Categorie personalizzate per abitudini**
   - User request: organize habits by life area (health, productivity, relationships)
   - Preset suggestions: Salute, Produttività, Finanze, Relazioni, Apprendimento
   - Future: filter dashboard by category

**Debug Tools Created:**
- `debugGenerateFakeCheckIns()`: Simulates historical data for testing
- `debugClearFakeCheckIns()`: Cleans up test data
- Exposed in debug footer with one-click buttons

**Key Technical Learning:**
- Try-catch and defensive coding to prevent React crashes
- Importance of data validation before state updates
- Console logging for debug without cluttering production

**PM Competencies Demonstrated:**
- [x] Feature prioritization with WSJF
- [x] Backlog grooming and expansion
- [x] User feedback incorporation
- [x] Testing strategy (debug tools for manual testing)

**Portfolio Talking Points from This Session:**

> "After completing the core MVP (US-001 to US-007), I added gamification through streak tracking. The implementation uses a Map data structure for O(1) lookup complexity - this is important because we check 30+ days of history on every render. With an array, that would be O(n×30) which could become slow with many habits."

> "When the user asked 'how do I test the streak feature if I only have today's data?' - I created debug tools that simulate historical check-ins. This shows product thinking: anticipating user needs (testability) and building internal tools to support QA, even on a solo project."

---

## 🎤 Portfolio Talking Points

> "This project demonstrates my approach to product management: start with user needs, document requirements clearly, make data-informed decisions, and collaborate effectively with engineering. You can see my thinking process in the JOURNEY.md file, where I document not just what we built, but why we made each decision."

**Questions This Project Helps Answer in Interviews:**

1. **"Tell me about a product you've built"**
   - Clear narrative from conception to execution
   - Can discuss technical decisions from PM perspective
   - Shows ownership and follow-through

2. **"How do you work with engineers?"**
   - Demonstrate collaboration through Claude Code workflow
   - Show technical understanding without being a developer
   - Clear communication through documentation

3. **"How do you prioritize features?"**
   - Backlog management in Notion
   - Prioritization frameworks applied
   - Trade-off decisions documented

4. **"What's your approach to product discovery?"**
   - PRD creation process
   - User research methodology
   - Market analysis approach

---

## 🔗 Related Documents

- **[PRD.md](PRD.md)** - Complete Product Requirements Document
- **[VISION.md](VISION.md)** - Product Discovery & Strategy (detailed)
- **[BACKLOG.md](BACKLOG.md)** - Product Backlog with WSJF prioritization
- **[STATO.md](STATO.md)** - Session-by-session progress tracker
- **[README.md](README.md)** - User-facing documentation
- **[.claudecode](.claudecode)** - AI collaboration guidelines

---

### Session 9 - February 7, 2026 - FEATURE SPRINT & CODE QUALITY 🧹

**What Happened:**
Triple feature completion session with focus on code quality and user experience improvements.

**User Stories Completed:**

1. **US-015: Unità di misura personalizzabili**
   - Added `unit` field to habit data model
   - Created UNIT_CATEGORIES with 7 organized categories (Tempo, Conteggio, Volume, Distanza, Lettura, Alimentazione, Produttività)
   - Dropdown selector in HabitForm for count/duration habits
   - Units displayed in habit cards and detail view

2. **US-012: Edit check-in giorni passati**
   - Made calendar in HabitDetail clickable
   - Mini-form for editing past check-ins (boolean toggle or numeric +/-)
   - No time limit on editing (unlimited retroactive changes)
   - Automatic recalculation of streaks and stats

3. **US-017: Dashboard per data (DayView)**
   - NEW component for viewing/editing all habits for a specific date
   - Clickable date in header opens modal
   - Day navigation with arrows (← →)
   - Weighted progress per day with partial completion support
   - Badge "Oggi" for current date
   - Future days blocked from editing

**Code Review & Bug Fixes:**

- **CSS Type Selector Fix:** Text was invisible (white on gray) - added explicit color
- **storage.js Debug Functions:** Fixed to preserve `version` and `lastUpdated` fields
- **JSDoc Cleanup:** Removed unused `days` parameter from getHabitHistory documentation
- **DayView Progress:** Fixed to use partial completion (consistent with main dashboard)

**Business Model Documentation:**
- Added section 3.5 to VISION.md: "Business Model: Freemium Strategy"
- Defined Free tier (complete) and Pro tier (€9.99/year)
- Documented anti-patterns and competitor comparison

**Key Technical Decisions:**

1. **DayView Component Pattern:**
   - Receives `getCheckInForDate` callback instead of raw data
   - Uses `_rawData` from useHabitStore for check-in lookups
   - Consistent UI with main app (same buttons, colors, layout)

2. **Partial Completion Consistency:**
   - Code review caught inconsistency: DayView was counting only completed habits
   - Fixed to use same weighted formula as main dashboard
   - Formula: `Σ(completionPercent × weight) / Σweight`

3. **React Hooks Rules:**
   - Bug fix: useCallback hooks must be called BEFORE early returns
   - React requires hooks to be called in same order every render
   - Lesson learned: always place hooks at top level, before conditionals

4. **UX Iteration Based on Feedback:**
   - User feedback: "clicking arrows 10 times to go back is tedious"
   - Solution: added 30-day mini-calendar for direct day selection
   - User feedback: "date doesn't look clickable"
   - Solution: added calendar icon button with hover effect

**PM Competencies Demonstrated:**

- [x] Code review practices (catching bugs before release)
- [x] Feature completion with user-centric UX
- [x] Documentation maintenance (VISION, BACKLOG, STATO)
- [x] Business model definition and documentation
- [x] Quality assurance through systematic review

**Portfolio Talking Points from This Session:**

> "During a code review, I identified an inconsistency between the main dashboard and the new DayView component. The main app calculated weighted progress using partial completion (50% done = 50% of points), but DayView was only counting fully completed habits. This would have confused users seeing different percentages. I fixed it immediately to ensure consistency across the app."

> "I designed a Freemium model where the core value proposition is FREE forever. The Pro tier (€9.99/year) only offers 'nice-to-have' features like cloud sync and advanced analytics. This counters the 'free-to-useless' dark pattern common in competitors like HBT, which frustrates users by paywalling essential features."

> "After shipping the DayView feature, user testing revealed two UX issues: the date wasn't obviously clickable, and navigating with arrows was tedious. I iterated quickly: added a calendar icon button for discoverability, and a 30-day mini-calendar for direct day selection. This shows my commitment to user feedback and iterative improvement."

**Status Summary:**
- **Total Stories:** 17
- **Completed:** 11 (65%)
- **MVP Core:** 100% complete
- **Remaining:** 6 stories (mostly polish and nice-to-have)

---

*Last updated: 2026-02-07*
*Next update: After US-016 (Categories) or US-013 (shadcn/ui polish)*
