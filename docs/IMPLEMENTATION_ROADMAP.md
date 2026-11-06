# Implementation Roadmap

**Status:** Proposed v0.1. Phase gates are mandatory: **no phase starts without explicit approval**, and Phase 1 does not start until the farm-visit requirements are reviewed and approved (brief §12). Durations are deliberately omitted until scope and stack are confirmed.

## Guiding ideas

- **Identity first.** Everything depends on reliable animal identity + RFID assignment; it ships first and is proven on the real reader before anything else.
- **Replace the registers one at a time.** Each phase retires a handwritten register, so staff see value early and we never run two systems for the same data longer than needed.
- **Vets early.** Veterinary records come before finance because they create the data the intelligence layer needs and they are where accountability matters most.
- **Finance last among core modules**, because it is CEO-only initially and least dependent on shed-floor adoption.
- **No AI before clean data.**

## Phase 0 — Discovery & foundation (current)

| Deliverable | Status |
|-------------|--------|
| Repository, documentation set, templates | ✅ this PR |
| Excel workbook analysis | ⏳ pending file |
| Farm visit: answers to OPEN_QUESTIONS, RFID inspection, register photos | ⏳ |
| Stack & hosting decision recorded | ⏳ — recommendation ready in [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md) (D-023…D-030 Proposed) |
| Premium / real-time / performance / photo requirements folded into docs | ✅ 2026-11-07 (REQUIREMENTS §11, PERFORMANCE_ACCEPTANCE_CRITERIA, REALTIME_ARCHITECTURE, MEDIA_AND_PHOTOS, SHARED_VM_ARCHITECTURE) |
| Team workflow, testing structure, CI proposal | ✅ 2026-11-07 (TEAM_WORKFLOW, TESTING_STRATEGY, CI_PIPELINE_PROPOSAL) |
| **Gate G0:** CEO approves requirements + architecture + stack; authorises Phase 1 | ⏳ |

### Phase 1 technical spike (first two weeks after G0, before feature work)
Prove the risky pieces with throw-away code and record results: Octane + Valkey + Reverb end-to-end latency; outbox → broker → client under load; imgproxy + Garage signed-URL flow from a phone camera; PWA offline queue + Background Sync on a farm phone; the RFID scan source on the real reader; Lighthouse/k6 baseline against the acceptance criteria. Any failure feeds back into D-023…D-030 before implementation starts.

## Phase 1 — Identity, RFID & animal registry (MVP core)

**Goal:** Every goat on the farm exists in the system with a permanent ID, current tag, breed, sex, age, parents (where known), shed; the reader opens a goat's profile by scanning.

Scope:
- Users, roles, login, PIN re-auth on shared device.
- Breeds, sheds/pens, animals, RFID tags & assignments, location transfers.
- Animal profile screen + lifecycle timeline, **with profile photo, gallery, camera capture and photo history** (PH-1…PH-9).
- **Real-time foundation**: outbox, broker, WebSocket service, channel authorisation; live profile, shed view and ops activity feed (RT-1…RT-4).
- **Design system** (tokens, components, motion rules, reduced-motion) established here and reused by every later module.
- **Performance gates** from PERFORMANCE_ACCEPTANCE_CRITERIA enforced in CI from this phase (bundle budget, Lighthouse CI, k6 baseline).
- Scan integration with the actual reader (chosen mode from RFID research) + manual/QR fallback.
- Initial data import from registers/Excel (identity fields only) with a validation report.
- Audit log infrastructure.
- Sample-data local environment; automated tests for invariants I‑1, I‑2, I‑3.

**Gate G1:** All ~118 goats registered and scannable by the real reader on site (pilot on a test/staging environment approved separately — not production infra per brief restrictions until authorised).

## Phase 2 — Weight, health & veterinary records

**Goal:** Vets and caretakers record observations, examinations, treatments, preventive care and weights on mobile; Layer‑1 rule alerts begin.

Scope:
- Weight capture + ADG + growth charts.
- Health observations (icon-based symptoms), examinations, diagnoses, treatments, dose logs, preventive-care schedules and records.
- Health alerts + rule engine (vet-tunable thresholds).
- Medical history import (if usable).
- Offline capture for weights/observations (if Q-FM-3 says needed).

**Gate G2:** Vets sign off that forms match their practice; weight register retired.

## Phase 3 — Breeding & pedigree

**Goal:** Heat → mating → pregnancy → kidding → kid registration, with family tree and breeding performance.

Scope:
- Heat observations, mating events (controlled/group), pregnancy checks, expected kidding calendar, kidding events, kid auto-registration with birth weight.
- Multi-generation pedigree view; relatedness warning on proposed mating (if Q-PB-3 yes).
- Breeding performance per doe/buck.
- Pedigree history import with vet/CEO validation.

**Gate G3:** Breeding register retired; pedigree for current herd validated by CEO.

## Phase 4 — Feeding, tasks & farm operations

**Goal:** Feeding groups, approved plans, daily compliance, cleaning/other tasks, operational history.

Scope:
- Feed items, feeding groups with criteria-based suggestions, plan drafting + vet approval workflow, compliance logging.
- Task management & daily assignments; activity log.
- Layer‑2 insights: growth percentiles, group review suggestions.
- Multi-shed readiness check (6 sheds).

**Gate G4:** Feeding and cleaning done through the app for a full month with compliance ≥ agreed target.

## Phase 5 — Finance

**Goal:** CEO records all money in/out; lifetime cost per goat and shed-wise expenses; later delegation.

Scope:
- Suppliers, expenses (with bills), payments, animal purchase/sale transactions.
- Allocation rules → lifetime cost, shed cost, cost per kg gain.
- Financial dashboard, period reports, profitability; export.
- Finance role delegation with configurable permissions & approval limits.
- Finance audit review screen.

**Gate G5:** CEO reconciles one full month against existing records.

## Gate G-STAGE — Live staging acceptance (mandatory before any farm-VM deployment) — **deferred milestone, $0 only**

> Per D-033/D-035 (2026-11-07): review and acceptance of all work happens **through GitHub** ([GITHUB_REVIEW_GUIDE.md](GITHUB_REVIEW_GUIDE.md)). The live staging environment is a future milestone that proceeds only if a genuinely free solution (no card, no auto-charge) can run the complete application reliably; otherwise it stays deferred and the limitation is documented. Static documentation / prototype previews on GitHub Pages (if available free) do not count as staging.

When the integrated MVP (Phases 1–5 as scoped by the owner) passes CI, it is deployed — after CI success **and** Ammar's explicit approval in GitHub — to the shared **staging environment** ([STAGING_ENVIRONMENT.md](STAGING_ENVIRONMENT.md)): full stack, synthetic demo data, role test accounts, simulated RFID reader. Ammar tests from desktop and mobile; the QA Lead reviews the acceptance package (URL, SHA, test results, manual QA checklist, limitations, cost, bug process). Only after G-STAGE is signed off does the production (farm VM) runbook begin, and never automatically.

## Phase 6 — Intelligence & scale

- Layer‑3 (optional) learned/LLM assistance after data quality review.
- Breeding selection shortlist ("quality") based on confirmed traits.
- Notifications via SMS/WhatsApp if required.
- Performance review at target herd size; partitioning if needed.
- Multi-farm readiness assessment (only if the business asks).

## Cross-phase workstreams

| Workstream | Runs during |
|------------|-------------|
| Data migration (registers → system), with validation reports and sign-off | Phases 1–3 |
| UX testing with real caretakers (low-literacy, Urdu, gloves, sunlight) | Every phase, before gate |
| Security review (RBAC tests, audit completeness) | Every phase |
| Backups & restore drill | From first non-local environment |
| Documentation & training material (pictorial, in local language) | Every phase |

## What could change this plan

- Reader has no usable integration → Phase 1 adds a "reader selection" sub-task or a Bluetooth LF wand.
- Milk production turns out to be needed → new module between Phases 3 and 4.
- CEO wants finance earlier → Phase 5 can move ahead of Phase 4; they are independent.
- Workbook reveals additional registers (e.g. inventory) → scope added to Phase 4.
