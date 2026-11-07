# KK Farm — Discovery Report (Phase 0)

**Date:** 2026-11-07 · **Audience:** CEO, veterinary staff, engineering · **Length:** 5-minute read; every section links to the detailed document.

## 1. What is confirmed

Taken directly from the project brief; full list with IDs in [REQUIREMENTS.md](REQUIREMENTS.md).

- **Purpose:** internal farm management for quality breeding — not a marketplace.
- **Scale today:** ~118 goats, 1 shed (6 planned), several breeds, handwritten registers, RFID ear tags on animals, an Android RFID reader, permanent vets on site.
- **Identity rule:** each goat gets a permanent ID that is never reused; the RFID tag code is *not* that ID — tags are assigned to goats for a period and that history is kept. When a goat leaves (sold, gifted, sacrificed, died) its tag assignment is closed and **nothing is deleted**.
- **Modules required:** animals & lifecycle · pedigree & breeding (heat, mating, pregnancy, kidding) · weight & growth (ADG, alerts) · veterinary (individual doctor accounts, exams, diagnoses, treatments, vaccination, follow-ups, critical alerts) · group feeding with vet-approved plans · farm operations (sheds, transfers, staff, tasks, compliance) · finance (all expense categories, suppliers, bills, period reports, per-goat lifetime cost, shed-wise cost, audit trail, restricted access).
- **AI:** advisory only — flags goats needing attention; never diagnoses, prescribes or overrides a vet.
- **Users:** seven candidate roles (CEO, Farm Manager, Vet, Caretaker, Feeding, Cleaning, Finance), permissions configurable.
- **Usability:** must be very easy on a mobile phone for staff with limited technical education.
- **Rules of engagement:** GitHub is the source of truth; no deployment, no production infra, no live hardware, no real data, PRs only, no merge without authorization.

## 2. What is assumed (must be confirmed)

Each has a question in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). The most consequential:

| Assumption | If wrong… |
|------------|-----------|
| Sheds may be divided into pens with capacities | Location model simplifies to shed only |
| Connectivity in sheds is poor → app must capture offline | Architecture simplifies considerably if Wi‑Fi is reliable |
| Urdu + English UI | Language list changes |
| Natural, controlled mating (sire known) | Group mating means sire is "probable", affecting pedigree certainty |
| Gestation ≈150 days, configurable per breed | Expected-kidding logic changes |
| Caretakers may *report* symptoms; only vets *diagnose/prescribe* | Permission matrix changes |
| Medicine withdrawal periods should block early sale | Feature dropped or added |
| Financial corrections are reversing entries (append-only) | Audit design changes |
| Shared costs allocated per head-day for lifetime cost | Allocation rule changes |
| Phase‑1 "AI" = transparent rules; machine learning later | Expectations about AI change |
| The organisation's existing stack (Laravel/PostgreSQL/React) is preferred | Stack decision reopens |

## 3. What remains unknown (do not guess)

Staff count and duties · structure of handwritten registers · RFID reader make/model/SDK · tag standard (LF vs UHF) · existing animal IDs and tag mapping · historical breeding/pedigree, weight and medical records · actual feeding groups and rations · shed layout and capacity · financial approval workflow · preferred technology stack and hosting · whether milk production matters · contents of the Excel workbook (**file not yet received**) · goatmart.pk's features (**site offline, no archive**).

## 4. Technical risks

| Risk | Severity | Plan |
|------|----------|------|
| RFID reader has no usable SDK or closed vendor app | High | Inspect at visit; hardware-agnostic scan interface; keyboard-wedge/Bluetooth/manual fallbacks |
| LF/UHF mismatch between tags and reader | High | Confirm at visit before any commitment |
| Building on unvalidated assumptions | High | Phase gate G0; nothing coded until approved |
| Offline sync complexity | Medium | Event-based, idempotent sync; keep offline scope to capture only |
| Migration quality from registers/Excel | Medium | Dedicated migration workstream with validation reports and vet/CEO sign-off |
| Low-literacy adoption | Medium | Scan-first, icon-based forms, local language, pilot with real caretakers |
| Shared devices, weak auth | Medium | PIN re-auth, short sessions, device registration |

## 5. Proposed system architecture

Full text: [ARCHITECTURE_PROPOSAL.md](ARCHITECTURE_PROPOSAL.md) (proposal, not decision).

- **One application server (modular monolith)** with clear modules: Animals & Identity · Breeding · Veterinary · Feeding · Farm Ops · Finance · Users/RBAC · Intelligence; cross-cutting audit log, animal timeline, notifications, sync.
- **One relational database** (PostgreSQL recommended) so the critical invariants — one tag per goat at a time, no deletes, pedigree without cycles, append-only money — are enforced by the database, not just by code.
- **Mobile-first client** for shed staff and vets; **web** for CEO/manager/finance. Whether the mobile client is native Android, a PWA with a scan bridge, or cross-platform is decided **after inspecting the reader**.
- **Hardware-agnostic scan interface:** any source (SDK, keyboard-wedge, Bluetooth, manual, QR) emits "tag scanned" → app resolves the goat via its current tag assignment.
- **Intelligence layer** reads records and writes only suggestions/alerts; clinical suggestions can be accepted only by a vet.
- **No environments provisioned** in this phase.

## 6. Proposed data relationships

Full text: [DOMAIN_MODEL.md](DOMAIN_MODEL.md) and [DATABASE_DESIGN_DRAFT.md](DATABASE_DESIGN_DRAFT.md).

- `Animal` (permanent) ← `RFID Assignment` (time-bounded) → `RFID Tag` (reusable).
- `Animal` → `Location Assignment` (time-bounded) → `Pen` → `Shed`.
- `Animal` ⇄ `Animal` via `sire_id` / `dam_id` (multi-generation tree).
- `Heat` → `Mating` → `Pregnancy Check` → `Kidding` → new `Animal`s (kids) with birth weight.
- `Observation` → `Examination` → `Diagnosis` / `Treatment` → `Medicine Administration`; `Preventive Care` by schedule.
- `Weight Record` per animal; ADG computed, never stored.
- `Feeding Group` ← membership (time-bounded) ← `Animal`; `Feeding Plan` (versioned, requires `Approval`) → `Compliance Log`.
- `Expense` → `Allocation` (animal / shed / group) → lifetime cost; `Payment`; `Animal Transaction`; all append-only with `Audit Log`.
- `Animal Event` unified timeline ties it all together for the goat profile screen.

## 7. Recommended implementation phases

Full text: [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md). Each phase ends in a gate requiring explicit approval.

| Phase | Delivers | Retires |
|-------|----------|---------|
| 0 (now) | Repo, documentation, farm visit, workbook analysis, stack decision | — |
| 1 | Identity, RFID scan, animal registry, sheds, users/roles, audit, import of identity data | Animal register |
| 2 | Weight, health observations, vet exams/treatments, preventive care, rule-based alerts | Weight & health registers |
| 3 | Breeding cycle, kidding, pedigree tree, breeding performance | Breeding register |
| 4 | Feeding groups/plans with vet approval, compliance, tasks, ops history, growth insights | Feeding & task sheets |
| 5 | Finance: expenses, payments, suppliers, lifetime cost, reports, delegation | Expense ledgers |
| 6 | Advanced intelligence, breeding selection shortlist, notifications, scale checks | — |

## 8. Immediate asks

1. **Send the Excel workbook** so its analysis can be completed (do not commit it; we analyse locally).
2. **Schedule the farm visit** using [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) as the checklist; photograph the RFID reader label, tags, registers and scale.
3. **Review this document set** and mark each `[ASSUMED]` item confirmed or corrected.
4. **Decide** stack and hosting (D-011) after the visit.
5. **Authorise** Phase 1 only when 1–4 are done.
