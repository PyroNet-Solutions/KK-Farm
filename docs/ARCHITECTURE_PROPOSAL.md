# Architecture Proposal

**Status:** Architectural shape proposed; **technology stack accepted on 2026-11-07 (D-023, Option A — see [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md))**. Deployment environment for production is still open (Q-NFR-3 hosting part; shared-VM principles in D-021); mobile delivery (D-028) waits for the reader inspection. This document keeps the reasoning and the alternatives considered.

> **Updated 2026-11-07** for the owner's premium / real-time / performance direction. The detailed designs now live in companion documents, and this proposal references them:
> - Concrete stack recommendation with verified versions → [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md)
> - Measurable speed targets and test method → [PERFORMANCE_ACCEPTANCE_CRITERIA.md](PERFORMANCE_ACCEPTANCE_CRITERIA.md)
> - Event-driven real-time design (outbox, channels, authorisation, reconnection) → [REALTIME_ARCHITECTURE.md](REALTIME_ARCHITECTURE.md)
> - Goat photographs and media pipeline → [MEDIA_AND_PHOTOS.md](MEDIA_AND_PHOTOS.md)
> - Shared-VM isolation and portability → [SHARED_VM_ARCHITECTURE.md](SHARED_VM_ARCHITECTURE.md)

## 1. What the architecture must achieve

| Driver | Source | Architectural consequence |
|--------|--------|---------------------------|
| Mobile-first, low-literacy users | BC-5 | Scan-first UX; very few screens; large touch targets; local language; minimal typing |
| Android RFID reader on site | BC-3 | The app must run on, or talk to, that Android device |
| Poor/unknown connectivity in sheds | `[ASSUMED]` Q-FM-3 | Offline capture with later sync, or at least graceful degradation |
| Complete history, never delete | BC-6 | Append-only event tables; soft states; audit log |
| Scale 118 → thousands without redesign | BC-4 | Normalised relational core; IDs as UUIDs; no "one shed" assumptions |
| Veterinary accountability | VT-1, AI-4 | Server-side role checks; signed authorship on medical records |
| Finance restricted + audited | FN-11, FN-12 | Separate permission domain; immutable ledger |
| AI assists, never decides | AI-3, AI-4 | Intelligence is a *read-only advisory* service that creates alerts/suggestions, never writes clinical records |
| No deployment this phase | Brief §8 | Architecture must be runnable locally with sample data when the time comes; nothing here presumes production infra |
| Exceptional speed, measurable | PF-1…PF-6 | Octane-class always-booted app server, read models for dashboards, cursor pagination + virtualised lists, code splitting, cache layer, background workers; targets in PERFORMANCE_ACCEPTANCE_CRITERIA |
| Real-time is core | RT-1…RT-4 | Transactional outbox → broker → dedicated WebSocket service with per-channel authorisation; sub-second p95 |
| Premium UI with photos | UX-1…UX-7, PH-1…PH-9 | Design system (Tailwind + accessible primitives), Motion animations with reduced-motion, interactive pedigree tree, imgproxy-served responsive images from object storage |
| Shared VM, loosely coupled | INF-1…INF-3 | Separate Compose projects, DBs, credentials, buckets, backups; everything located by configuration |
| Original product; ownership; no lock-in; future farms/SaaS | P-1…P-7 (D-034) | Greenfield code owned in GitHub; provider services only behind standard interfaces (S3, Redis protocol, SMTP, PostgreSQL); `farm_id`-ready top-level entities; portable to any host or our VM |

## 2. Proposed shape (logical view)

```
┌─────────────────────────────────────────────────────────────────┐
│  Clients                                                         │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │ Mobile app (Android) │  │ Web app (desktop)│  │ RFID reader│ │
│  │ caretakers, vets,    │  │ CEO, manager,    │  │ Android gun│ │
│  │ feeding/cleaning     │  │ finance, reports │  │ (scan →    │ │
│  │ offline-capable      │  │                  │  │  app)      │ │
│  └──────────┬───────────┘  └────────┬─────────┘  └─────┬──────┘ │
└─────────────┼───────────────────────┼──────────────────┼────────┘
              │ HTTPS / JSON API      │                  │ SDK / intent / keyboard-wedge
┌─────────────▼───────────────────────▼──────────────────▼────────┐
│  Application server (single deployable "modular monolith")       │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ ┌────────┐ │
│  │ Identity &│ │ Breeding │ │ Veterin- │ │ Feeding │ │ Farm   │ │
│  │ Animals   │ │ Pedigree │ │ ary      │ │ Nutrit. │ │ Ops    │ │
│  └───────────┘ └──────────┘ └──────────┘ └─────────┘ └────────┘ │
│  ┌───────────┐ ┌──────────┐ ┌──────────────────────┐            │
│  │ Finance   │ │ Users &  │ │ Intelligence (rules, │            │
│  │ (ledger)  │ │ RBAC     │ │ alerts, later ML)    │            │
│  └───────────┘ └──────────┘ └──────────────────────┘            │
│  Cross-cutting: audit log · event timeline · notifications · sync│
└───────────────────────────────┬─────────────────────────────────┘
                                │
                 ┌──────────────▼──────────────┐   ┌──────────────┐
                 │ Relational database (ACID)  │   │ Object store │
                 │ PostgreSQL recommended      │   │ photos, bills│
                 └─────────────────────────────┘   └──────────────┘
```

### Why a modular monolith, not microservices
- One team, one farm, ~10 users. Microservices add operational cost with no benefit at this scale.
- Modules have clear boundaries (one folder/package each, own tables, explicit interfaces) so they *could* be split later if KK Farm became multi-farm SaaS.
- A single ACID database keeps invariants (I-1…I-9 in [DOMAIN_MODEL.md](DOMAIN_MODEL.md)) enforceable with transactions and constraints.

### Why a relational database
- The domain is deeply relational (pedigree, assignments over time, ledger).
- Foreign keys and unique partial indexes enforce "one open tag assignment per animal" at the database level, not just in code.
- PostgreSQL specifically: recursive queries for family trees, exclusion constraints for non-overlapping time ranges, JSONB for flexible form fields, row-level security as an extra safety net for finance.

## 3. Client strategy — the key open decision

| Option | Description | Pros | Cons | Fit |
|--------|-------------|------|------|-----|
| **A. Native Android app + web admin** | Kotlin app for field staff (runs on the RFID gun and on phones), web app for office roles | Best RFID SDK access; true offline; camera/photos simple | Two codebases; Android-only field app; Play-store or sideload distribution | Strong if the reader's SDK is Android-only (likely) |
| **B. PWA (web app installable on phones) + thin Android "scan bridge"** | One responsive web app; a tiny Android service on the gun forwards scans (intent/keyboard-wedge) | One codebase; works on any phone; no store | Offline is harder (service workers + local DB); RFID integration depends on reader exposing scans as keyboard/intent | Good if the reader has keyboard-wedge mode |
| **C. Cross-platform (Flutter / React Native)** | One mobile codebase for Android + iOS, plus web | Shared code; native plugins exist for some readers (e.g. community Chainway plugins) | Plugin quality varies; still need a web admin | Reasonable middle ground |

**Recommendation (pending Q-RF-1…3):** Decide after inspecting the reader. If it offers keyboard-wedge or broadcast-intent scanning, Option **B** gives the fastest path with one codebase. If only a Java/Kotlin SDK is offered, Option **A** or **C** with a native scan module.

*Update 2026-11-07:* the technology evaluation refines this to **installable PWA first, wrapped in Capacitor only if the reader's SDK requires native code** (D-028) — see [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md) §3.3. A separate native codebase (Kotlin/Flutter/React Native) is not recommended for a team of this size.

Whatever the choice, the **scan interface is abstracted**: the app receives `TagScanned(tag_code, reader_id, timestamp)` from a pluggable source (RFID SDK, keyboard-wedge, manual entry, QR code). This keeps the app independent of the hardware vendor.

## 4. Backend stack options

The brief says the preferred stack is pending. Options that fit the shape above:

| Option | Notes |
|--------|-------|
| **Laravel (PHP) + PostgreSQL + Inertia/React** | `[ASSUMED]` the organisation's other products use this stack (to be confirmed); fastest team ramp-up; mature auth, queues, audit packages |
| **Django (Python) + PostgreSQL** | Strong admin, good for the rules/ML layer later; Python ecosystem for analytics |
| **Node/TypeScript (NestJS) + PostgreSQL** | Shared language with a React/PWA front end |

All three are suitable; the choice should follow **team familiarity and long-term maintainability**, not fashion. Record the decision in [DECISIONS_LOG.md](DECISIONS_LOG.md).

*Update 2026-11-07:* [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md) compares **Option A — Laravel 13 + Octane + Inertia 3/React 19** (recommended, D-023) against **Option B — NestJS 12 + Next.js 16** with verified latest-stable versions, and selects PostgreSQL 18, Valkey 9, Laravel Reverb (real-time), Horizon (jobs), Garage (S3 object storage), imgproxy (images), Caddy, Docker Compose and a Prometheus/Grafana/Loki/GlitchTip observability stack. All remain *Proposed* until Ammar accepts.

## 5. Offline & sync (if required by Q-FM-3)

- Mobile client keeps a local store of *its* working set (animals in assigned sheds, open tasks, today's plans).
- Writes are queued as **events** with client-generated UUIDs and `occurred_at`; the server records `received_at` separately.
- Sync is idempotent (same event ID twice = no duplicate).
- Conflicts are rare (different people rarely edit the same goat's same field); where they occur, both versions are kept in history and flagged for the manager.
- Reference data (breeds, medicines, feed items, users) is small and fully cached.

## 6. Cross-cutting services

| Service | Purpose |
|---------|---------|
| **Audit log** | Every create/update on identity, medical, feeding-plan and financial entities writes an immutable row (actor, before/after, time). |
| **Event timeline** | Unified `animal_events` feed used by the "goat profile" screen and the intelligence layer. |
| **Notifications** | In-app first; SMS/WhatsApp optional later (Q-RB-3). Critical alerts route to vet + manager + CEO. |
| **Reporting** | Read-model/views for dashboards; heavy reports run as background jobs. |
| **File storage** | Photos, bills, receipts — stored outside the DB, referenced by ID, access-controlled by role. |
| **Intelligence** | See [AI_INTELLIGENCE_DESIGN.md](AI_INTELLIGENCE_DESIGN.md). Reads events, writes *alerts and suggestions* only. |

## 7. Security posture (summary; detail in SECURITY_AND_RBAC.md)

- All permission checks on the server; UI hides what the user cannot do but never *is* the control.
- Finance endpoints in their own permission domain with their own audit.
- Medical writes verify the author's active Veterinarian role at write time.
- Device/session management for shared phones (quick re-login with PIN after timeout).
- No secrets in the repository; configuration via environment at deploy time (future).

## 8. Environments (future — nothing provisioned now)

| Env | Purpose | Data |
|-----|---------|------|
| Local dev | Developer machines | Synthetic sample data only |
| Staging | CEO/vet acceptance testing | Synthetic or anonymised |
| Production | Real farm use | Real data; backups; access controls |

Per the brief, **none** of these is created in this phase. The hosting location (cloud vs. on-prem vs. existing PyroNet infrastructure) is `[UNKNOWN]` and must not be assumed.

## 9. Technical risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reader SDK unavailable or poorly documented | Scan-first UX blocked | Abstract scan source; keyboard-wedge or manual fallback; test early with the real device |
| Tag standard mismatch (LF vs UHF) | Wrong reader/app assumptions | Confirm at visit (Q-RF-2) |
| Offline sync complexity | Bugs, duplicate records | Event-based idempotent sync; keep offline scope minimal (capture only) |
| Data migration from registers/Excel | Bad pedigree/medical history | Separate migration phase; validation reports; vet sign-off |
| Over-building before validation | Wasted effort | Phase gates in roadmap; nothing coded before approval |
| Shared devices, weak passwords | Unauthorised access | PIN re-auth, short sessions, per-device registration |
