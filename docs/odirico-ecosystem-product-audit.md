# Odirico Ecosystem Product Audit and Refactor Spec

## Deliverable 1: Feature audit

### Ember

| App | Feature | Original intent | Current status | Condition | Why it changed | Required action |
| --- | --- | --- | --- | --- | --- | --- |
| Ember | Dashboard modules | Open into a true student command center | Rebuilt as dashboard-first home | Implemented | Shell-first layout had displaced the dashboard with platform framing | Keep Ember opening to Today, not generic platform context |
| Ember | Assignment management | Track, prioritize, and advance school work quickly | Live queue with status cycling and quick capture | Implemented | Earlier work was flattened into summary cards | Expand later into filters, sorting, and bulk reschedule |
| Ember | Study planning | Protect focus blocks and weekly study structure | Live synced study plan with completion toggles | Implemented | Platform wrapper reduced it to an explanatory submodule | Add drag/reflow next |
| Ember | Exams and readiness | Surface upcoming tests and readiness pressure | Dedicated exam readiness section | Implemented | Exam urgency was hidden inside generic content groupings | Add deeper exam prep workflow later |
| Ember | Routines and recovery | Tie recovery and routine to academic output | Routine section restored with semester and signal framing | Partially implemented | Recovery logic was diluted when Ember was treated like a generic app tab | Add daily reset, streak, and recovery flows |
| Ember | Course-level insight | Show where academic risk is concentrated | Course health and risk list visible | Implemented | Shared shell consumed space that should have gone to course health | Add grade trend and professor/course drilldowns |
| Ember | Execution tools | Let users act immediately from the main workspace | Quick capture plus in-line state changes | Implemented | Too much time was spent explaining Ember instead of making it operable | Add keyboard-first capture and reschedule actions |
| Ember | Weekly repair / planning tools | Help fix overloaded weeks | Signals and study plan support it, but no dedicated repair action yet | Partially implemented | MVP refactor focused on restoring the core dashboard first | Add “Fix my week” flow |
| Ember | Persistence / continuity | Keep work state across devices | Supabase-backed sync added | Implemented | Browser-only storage had made Ember feel fake and temporary | Add last-synced metadata later |
| Ember | Quick actions | Fast path to the next useful move | Present in queue and capture modules | Implemented | Platform messaging had previously pushed actions below the fold | Add stronger mobile quick actions later |

### Sol

| App | Feature | Original intent | Current status | Condition | Why it changed | Required action |
| --- | --- | --- | --- | --- | --- | --- |
| Sol | Finance dashboard | Open into a trustworthy financial overview | Rebuilt as overview-first money dashboard | Implemented | Sol had been mounted inside a generic shell instead of treated as its own product | Keep Sol calm, grounded, and decision-first |
| Sol | Spending tracking | Show live budget behavior | Budget health grid and money actions are live | Implemented | Product depth was replaced with generic platform explanation | Add transaction-level history later |
| Sol | Budgeting | Compare spend versus plan | Budget module restored with in-line nudges | Implemented | Surface area had been lost to oversized shell chrome | Add category filtering and monthly rollover later |
| Sol | Bills | Keep due obligations obvious | Bills section restored with paid/unpaid control | Implemented | Bills were previously buried behind generalized summary surfaces | Add recurrence and autopay logic later |
| Sol | Savings goals | Track progress against concrete goals | Goal system is visible and interactive | Implemented | Goal progression had been diluted by shared-shell sameness | Add milestone planning depth later |
| Sol | Credit optimization | Keep credit trajectory visible | Utilization is surfaced but not deeply modeled yet | Partially implemented | MVP simplification stopped at high-level credit status | Add score trajectory and payoff planning |
| Sol | Long-term planning | Connect daily decisions to future direction | Planning section restored with cross-app logic | Partially implemented | Sol had been treated like a finance tab, not a planning product | Add future scenario modules |
| Sol | Guidance / recommendations | Nudge better money choices | Guidance panel restored | Implemented | Technical/runtime framing had crowded out decision-support content | Add personalized recommendation logic later |
| Sol | Future milestone planning | Support car, move, emergency fund, and beyond | Goal structure exists, but milestone model is still light | Partially implemented | Platform normalization reduced app-specific planning depth | Add richer planning entities |
| Sol | Financial insights | Explain what matters this week | Sol insights visible in dashboard | Implemented | Shared shell had weakened product voice and task hierarchy | Expand with spend anomalies and forecast views |

### Surge

| App | Feature | Original intent | Current status | Condition | Why it changed | Required action |
| --- | --- | --- | --- | --- | --- | --- |
| Surge | Application capture | Capture opportunities anywhere | Runtime and install targets retained | Implemented | Earlier UI surfaced setup/handoff language too prominently | Keep capture tools in Connections, not main hero |
| Surge | Pipeline tracking | Make stage movement obvious | Dashboard queue and pipeline summary restored | Implemented | Technical runtime status had replaced product IA | Expand to full native pipeline over time |
| Surge | Companies database | Track companies as entities, not just rows | Company tracker summary restored | Partially implemented | Shared wrapper and runtime framing hid company-level thinking | Add full company pages and notes |
| Surge | Recruiter signals | Track replies and changing signals | Activity and queue sections expose signal flow | Partially implemented | Technical integration messaging had displaced user-facing signal UX | Add inbox/signal triage surface |
| Surge | Follow-up system | Never miss a next step | Today queue and follow-up cards restored | Implemented | Runtime plumbing was shown instead of action queue | Add reminders and SLA rules later |
| Surge | Imports / connections | Manage extension and capture integrations | Connections section restored | Implemented | Setup notes were previously mixed into the dashboard | Keep technical setup off the main workspace |
| Surge | Activity logging | Show what changed recently | Activity section restored | Implemented | App had been reduced to an embedded runtime explanation | Add richer event timeline later |
| Surge | Interviews | Track loops and prep | Interview count and queue surfaced | Partially implemented | Native interview surface has not been fully rebuilt yet | Add dedicated interview prep route |
| Surge | Offers | Compare outcomes and decisions | Offer count is surfaced | Partially implemented | Offer handling is still light relative to the desired product depth | Add offer comparison module |
| Surge | Analytics | Show conversion and momentum | Summary metrics visible; deep analytics still light | Partially implemented | Product effort focused on restoring operational clarity first | Add source/stage analytics later |
| Surge | Merge / dedupe logic | Keep company and application memory clean | Not surfaced in UI yet | Hidden | Integration plumbing exists conceptually but UI recovery took priority | Add dedupe review surface |

### Shared ecosystem

| App | Feature | Original intent | Current status | Condition | Why it changed | Required action |
| --- | --- | --- | --- | --- | --- | --- |
| Shared system | Auth | One shared account everywhere | Shared auth preserved | Implemented | This remained intact through the refactor | Keep as shared infrastructure |
| Shared system | Entitlement | One subscription model across apps | Shared billing model preserved | Implemented | Billing was overexposed in UI, not architecturally broken | Keep billing at account layer |
| Shared system | Switching flow | Move between products cleanly | Slim rail and account-level switching restored | Implemented | Old shell made switching feel like tab relabeling | Keep shell minimal |
| Shared system | Shared settings | Central place for theme/account/access | Shared settings preserved | Implemented | Settings felt too much like legacy admin due to shell bleed | Keep settings separate from app workspaces |
| Shared system | Theme system | One theme layer across apps | Theme controls preserved | Implemented | Theme existed but was not visually central enough | Keep theme in settings |
| Shared system | Notifications | Shared infra for future alerts | Basic infra implied, not fully surfaced | Partially implemented | Focus stayed on app surface restoration | Add notification center later |
| Shared system | Billing placement | Billing should be account-level | Reduced to menu/settings/account layer | Implemented | Earlier build placed billing too visibly in product surfaces | Keep it out of app dashboards |
| Shared system | Account management | Shared profile and sign-out controls | Account menu preserved | Implemented | No major structural issue, just needed cleaner placement | Expand with profile/preferences later |
| Shared system | Shared UI shell | Shared DNA, not dominant wrapper | Refactored to slim rail + compact header | Implemented | Shell-first architecture had overpowered product identity | Keep shared chrome subordinate |
| Shared system | Mobile/web parity decisions | Same system, different priorities | Strategy documented; deeper mobile pass still pending | Partially implemented | Desktop-first refactor happened before full mobile differentiation | Build dedicated mobile-first app flows next |

## Deliverable 2: Loss analysis

### Why features were diluted

- **Shell-first architecture:** The ecosystem shell consumed too much space and too much narrative responsibility, so app-specific dashboards were replaced by shared wrapper behavior.
- **Over-normalization across apps:** Ember, Sol, and Surge were pushed toward the same structure, which removed product-specific information hierarchy.
- **Placeholder platform messaging:** Preview, install, setup, and runtime language remained on primary routes longer than it should have.
- **Incomplete module porting:** Live state and sync work happened before full dashboard restoration, so some apps had working data but weak product framing.
- **Technical state exposed directly to users:** Runtime, handoff, and import notes were shown in primary workspaces instead of settings/connections/admin surfaces.
- **Desktop and mobile strategy were blended:** Desktop pages carried low-density mobile-like composition instead of using screen real estate for actual operational modules.
- **Billing was overexposed:** Subscription state was visible in too many places, which made the ecosystem feel like a pricing shell instead of product software.

## Deliverable 3: Corrected information architecture

### Ember web

- Today
- Assignments
- Exams
- Study Plan
- Routine
- Settings

### Ember mobile

- Today
- Assignments
- Study Timer
- Exams
- Quick Add
- Settings

### Sol web

- Overview
- Money
- Bills
- Goals
- Planning
- Settings

### Sol mobile

- Snapshot
- Bills
- Spending
- Goals
- Quick Decision
- Settings

### Surge web

- Dashboard
- Pipeline
- Companies
- Activity
- Connections
- Settings

### Surge mobile

- Queue
- Capture
- Pipeline
- Activity
- Companies
- Settings

### Shared ecosystem/account layer

- Overview
- Settings
- Subscription
- Account menu
- Search
- App switcher

## Deliverable 4: Dashboard redesign spec

### Ember dashboard

- **Above the fold:** Today priority, next focus block, top academic risk
- **Key modules:** Assignment queue, exam readiness, study plan, course health, routine/recovery
- **Quick actions:** Add assignment, start work, mark submitted, mark focus block complete
- **Empty state strategy:** Show the next thing to capture or plan, not generic “nothing here”

### Sol dashboard

- **Above the fold:** Next bill, budget watch, top goal, liquidity state
- **Key modules:** Money actions, bills, budget health, goals, planning, insights
- **Quick actions:** Log expense, log income, mark bill paid, contribute to goal
- **Empty state strategy:** Default to planning prompts and financial setup guidance, not platform explanation

### Surge dashboard

- **Above the fold:** Today queue, follow-ups due, pipeline summary, company tracker
- **Key modules:** Queue, activity, companies, runtime workspace, connections
- **Quick actions:** Open runtime, capture/import, update stage, review signals
- **Empty state strategy:** Show how to capture the first opportunity, not how the shell works

## Deliverable 5: Shell refactor plan

### What changed

- Reduced shared ecosystem chrome to a slim rail and compact top header
- Removed dominant current-space banner and repeated platform summary sections
- Moved billing emphasis back into account/subscription territory
- Added app-owned local navigation for Ember, Sol, Surge, Billing, Overview, and Settings
- Rebuilt app home surfaces so most of the screen belongs to the product, not the platform wrapper

### Ongoing rule

- Shared shell handles identity, search, switching, and account access
- App surface handles workflow, dashboard hierarchy, and product tone

## Deliverable 6: Implementation priority list

1. Shell reduction
2. App dashboard restoration
3. Feature resurfacing
4. Billing relocation
5. Mobile/web differentiation
6. Polish and consistency

## Final direction

The ecosystem should feel shared in infrastructure and continuity, but distinct in product experience. The platform should be mostly invisible once someone enters Ember, Sol, or Surge.
