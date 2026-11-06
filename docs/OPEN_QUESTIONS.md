# Open Questions

**Purpose:** The interview checklist for the farm visit and CEO review. Every `[ASSUMED]` and `[UNKNOWN]` item in [REQUIREMENTS.md](REQUIREMENTS.md) links here. Answers go into the *Answer* column and the matching requirement is re-tagged `[CONFIRMED]`; decisions go into [DECISIONS_LOG.md](DECISIONS_LOG.md).

**Legend — Blocks:** `P1` = blocks Phase 1 start · `P2+` = can be answered later · `Data` = blocks data migration

The brief lists these as pending — **do not invent answers**: employee count & responsibilities · handwritten register structure · RFID reader make/model/SDK · existing animal IDs and RFID mapping · historical breeding/pedigree · existing weight records · existing medical records · actual feeding groups & rations · shed layout & capacity · financial approval workflows · technology stack & deployment environment.

---

## A. Animal identity (Q-AM)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-AM-1 | What is the current animal numbering scheme (in the registers / on visual tags)? Is it unique and never reused? | Decides whether we can adopt it as the human-readable farm number or must issue new ones. | CEO, caretakers | P1, Data | |
| Q-AM-2 | Is there an existing list mapping goats → RFID tag codes? In what form? | Needed for the initial import. | Farm manager | Data | |
| Q-AM-3 | Are there castrated males? How should they be classified? | Affects sex/status model and breeding eligibility. | Vet | P1 | |
| Q-AM-4 | Should each goat have photos (for identification when a tag is lost)? | Storage and mobile UX. | CEO | P2+ | |
| Q-AM-5 | Is milk production relevant (dairy breeds, lactation records)? | Adds a whole module if yes. | CEO | P1 | |
| Q-AM-6 | What happens today when a tag falls off or fails? Who replaces it, and is it recorded? | Defines the reassignment workflow. | Farm manager | P1 | |
| Q-AM-7 | What exit reasons exist (sold, gifted, sacrificed/Qurbani, died, culled, stolen/lost)? Any paperwork per reason? | Lifecycle states. | CEO | P1 | |

## B. Pedigree & breeding (Q-PB)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-PB-1 | Natural mating only, or also AI (artificial insemination)? Group mating (one buck with several does) or controlled single pairings? | If group mating, sire may be *probable* rather than certain. | Vet, CEO | P1 | |
| Q-PB-2 | Gestation length used today; does it differ by breed? | Expected kidding date calculation. | Vet | P1 | |
| Q-PB-3 | Do you want warnings when a proposed mating is between close relatives? What threshold? | Core "quality breeding" feature. | CEO, vet | P2+ | |
| Q-PB-4 | For purchased animals, how much pedigree is known? Are there breeder certificates? | Pedigree depth and import format. | CEO | Data | |
| Q-PB-5 | What historical breeding records exist (register pages, Excel)? How far back? | Migration scope. | Farm manager | Data | |
| Q-PB-6 | How are heat cycles observed today (visual signs, teaser buck, schedule)? | Form design. | Vet, caretakers | P1 | |
| Q-PB-7 | How is pregnancy confirmed (ultrasound, palpation, no-return-to-heat)? | Examination record fields. | Vet | P1 | |
| Q-PB-8 | What is recorded at kidding (birth weight, difficulty, stillbirths, colostrum, kid sex)? | Kidding form. | Vet | P1 | |
| Q-PB-9 | What makes a goat "high quality" for KK Farm (breed standard, weight at age, conformation, fertility, lineage)? | Drives scoring and AI recommendations. | CEO, vet | P2+ | |

## C. Weight (Q-WT)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-WT-1 | Unit (kg) and precision (0.1 kg?). | Storage and display. | Farm manager | P1 | |
| Q-WT-2 | What scale is used? Does it have Bluetooth/USB output? | Possible integration later. | Farm manager | P2+ | |
| Q-WT-3 | What weight history exists and in what format? | Migration. | Farm manager | Data | |
| Q-WT-4 | How often are goats weighed today, and who does it? | Workflow and alert thresholds. | Farm manager | P1 | |
| Q-WT-5 | What weight change should trigger a vet alert (e.g. >5% loss in 2 weeks)? | Alert rules must be vet-defined. | Vet | P2+ | |

## D. Veterinary (Q-VT)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-VT-1 | Who may record what: can caretakers log symptoms? Can anyone other than a vet record a treatment given? | RBAC and accountability. | CEO, vets | P1 | |
| Q-VT-2 | Are meat/milk withdrawal periods tracked after medication? | Sale blocking logic. | Vet | P1 | |
| Q-VT-3 | Is medicine stock managed on farm? Where is it stored, who issues it? | Inventory module scope. | Vet, CEO | P2+ | |
| Q-VT-4 | What medical records exist today (per animal? per day?) and in what format? | Migration. | Vets | Data | |
| Q-VT-5 | Standard vaccination/deworming schedule used (names, intervals, ages)? | Preventive-care calendar. | Vet | P1 | |
| Q-VT-6 | Which conditions count as "critical" requiring immediate alert to the CEO/manager? | Alert routing. | Vet, CEO | P1 | |
| Q-VT-7 | How many vets; do they work shifts; do they need to see each other's notes? | Accounts and visibility. | CEO | P1 | |
| Q-VT-8 | Is a standard diagnosis/symptom vocabulary preferred, or free text? | Data quality vs. speed. | Vets | P1 | |

## E. Nutrition & feeding (Q-NF)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-NF-1 | What feeding groups exist today, what is fed to each, quantities, frequency? | Seed data and plan model. | Farm manager, vet | P1 | |
| Q-NF-2 | Who decides rations today and who approves changes? | Approval workflow (NF-4). | CEO | P1 | |
| Q-NF-3 | How is feeding confirmed today (checklist, verbal)? | Compliance form. | Feeding staff | P1 | |
| Q-NF-4 | Is feed stock tracked (bags in, consumption)? | Inventory scope. | Farm manager | P2+ | |
| Q-NF-5 | Are there body-condition scores or other criteria used to move a goat between groups? | Group-assignment rules. | Vet | P2+ | |

## F. Farm operations (Q-FM)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-FM-1 | Shed layout: pens per shed, capacity per pen, which groups live where? Plans for the 6 sheds? | Location model. | CEO, farm manager | P1 | |
| Q-FM-2 | What daily tasks exist (feeding, cleaning, water, observation) and how are they assigned today? | Task module. | Farm manager | P1 | |
| Q-FM-3 | Is there mobile signal / Wi‑Fi inside the sheds? | Offline-first necessity. | Farm manager | P1 | |
| Q-FM-4 | Do staff have their own smartphones, or will the farm provide shared devices? | Device management, login UX. | CEO | P1 | |
| Q-FM-5 | What are the handwritten registers (list each register, its columns, how far back)? | Migration and parity. | Farm manager | Data | |

## G. Finance (Q-FN)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-FN-1 | Currency PKR only? Any foreign purchases? | Money model. | CEO | P1 | |
| Q-FN-2 | How should shared costs (feed, salaries, utilities) be allocated to individual goats for lifetime cost? | Allocation rule. | CEO | P2+ | |
| Q-FN-3 | Is append-only accounting (corrections as reversing entries) acceptable? | Audit design. | CEO | P1 | |
| Q-FN-4 | What approval workflow will apply once a finance employee exists (limits, dual approval)? | Permission design. | CEO | P2+ | |
| Q-FN-5 | Is there an existing accounting system to integrate or export to? | Integration scope. | CEO | P2+ | |
| Q-FN-6 | Cash, bank, mobile wallet — which payment methods are used? | Payment model. | CEO | P1 | |

## H. Roles & people (Q-RB)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-RB-1 | Actual staff list: how many people, what each does, literacy/language, smartphone comfort. | Roles and UX. | CEO | P1 | |
| Q-RB-2 | Does one person hold multiple roles (e.g. manager who also feeds)? | Role model. | CEO | P1 | |
| Q-RB-3 | Who should receive critical alerts, and how (app notification, SMS, WhatsApp)? | Notification channel. | CEO | P2+ | |

## I. RFID & hardware (Q-RF)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-RF-1 | Reader make, model, Android version, vendor app name. **Photograph the label.** | Integration approach. | Farm visit | P1 | |
| Q-RF-2 | Tag type: LF (134.2 kHz FDX‑B/HDX, ISO 11784/11785) or UHF (EPC Gen2)? Tag brand and printed number. | Determines which SDK and read range. | Farm visit | P1 | |
| Q-RF-3 | Does the vendor provide an SDK / API / keyboard-wedge mode? Is it documented? | Build vs. workaround. | Vendor | P1 | |
| Q-RF-4 | How many readers; who carries them; charging routine? | Device fleet. | Farm manager | P2+ | |
| Q-RF-5 | Are tags registered with any provincial system (e.g. PAITS)? | Compliance/ID format. | CEO | P2+ | |

## J. AI & intelligence (Q-AI)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-AI-1 | Is rule-based alerting acceptable for Phase 1, with ML later? | Sets expectations. | CEO | P1 | |
| Q-AI-2 | Who reviews/approves alert rules (thresholds)? | Veterinary accountability. | Vet | P2+ | |

## K. Technology & environment (Q-NFR)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-NFR-1 | Is offline operation required? (see Q-FM-3) | Architecture. | CEO | P1 | |
| Q-NFR-2 | Languages: Urdu, English, others (Punjabi, Sindhi)? Script preference? | i18n. | CEO | P1 | |
| Q-NFR-3 | Preferred technology stack and hosting (cloud, on-prem, existing PyroNet infra later)? | Stack decision. | CEO + engineering | P1 | |
| Q-NFR-4 | Backup/retention expectations; any regulatory record-keeping requirement? | Data policy. | CEO | P2+ | |

## L. Premium / real-time / photos / infrastructure (added 2026-11-07)

| ID | Question | Why it matters | Ask | Blocks | Answer |
|----|----------|----------------|-----|--------|--------|
| Q-PF-1 | Which phone models do staff actually use (make, Android version, RAM)? | Replaces the reference device for performance targets. | Farm visit | P1 | |
| Q-PF-2 | Expected peak concurrent users in 3 years? | Sets the load-test profile. | CEO | P2+ | |
| Q-PF-3 | Acceptable maintenance window? | Deploy and backup scheduling. | CEO | P2+ | |
| Q-RT-1 | Which screens must be live in Phase 1 (minimum: profile, shed view, ops activity, vet alerts, dashboard)? | Scope of real-time channels. | CEO | P1 | |
| Q-RT-2 | Do critical alerts also need push/SMS/WhatsApp when the app is closed? | Separate delivery channel. | CEO | P2+ | |
| Q-PH-1 | Soft-hide only, or allow true deletion of accidental uploads within 24 h? | Retention rule. | CEO | P1 | |
| Q-PH-2 | Which photo context tags matter (side profile, udder, hoof, injury, sale)? | Gallery usefulness for vets/sales. | Vets, CEO | P2+ | |
| Q-PH-3 | Keep full-resolution originals or the ≤ 2048 px client-resized master? | Storage and upload time. | CEO | P1 | |
| Q-PH-4 | Should photos be shareable externally (buyer link)? | Signed-URL policy. | CEO | P2+ | |
| Q-INF-1 | VM specification, provider, region, administrator? | Sizing and ops. | CEO | P2+ | |
| Q-INF-2 | Domain names for website / app / real-time / media? | Proxy routing, TLS. | CEO | P2+ | |
| Q-INF-3 | Off-site backup destination? | Independent restore (G-6). | CEO | P2+ | |
| Q-INF-4 | Maintenance window and on-call owner? | Reliability targets. | CEO | P2+ | |
| Q-NFR-5 | Is a GPL dependency acceptable anywhere, or permissive-only for anything shipped to devices? | Licence policy (see PLATFORM_COMPARISON). | CEO + engineering | P1 | |
| Q-BC-2 | Trial a goat-specific SaaS to study UX — specifically Throf's free tier (≤ 25 head) and/or Farmbrite's 14-day trial? No payment details without approval. | Design input; see [research/COMPETITOR_BENCHMARK.md](research/COMPETITOR_BENCHMARK.md). | CEO | P2+ | |
| Q-BC-4 | Has the CEO personally used any of the five benchmark products; which flows impressed or frustrated? | Direct UX input. | CEO | P2+ | |
| Q-BC-5 | Must Urdu right-to-left layout be first-class from day one (as Throf does Arabic)? | i18n/RTL design effort. | CEO | P1 | |
| Q-BC-3 | Future data exchange with a breed registry, PAITS or buyers? | ICAR ADE alignment priority. | CEO | P2+ | |
| Q-STG-1 | Approve staging provider / plan / region / monthly budget (D-032: Railway Singapore recommended, Laravel Cloud second)? | Nothing can be provisioned without it. | CEO | P1 (before MVP completion) | |
| Q-STG-2 | Is PostgreSQL 17 acceptable on staging if Laravel Cloud is chosen, or is PG 18 parity mandatory? | Provider choice. | CEO + engineering | P1 | |
| Q-STG-3 | Staging domain (subdomain of the farm's future domain vs provider default)? | DNS, TLS, cost. | CEO | P2+ | |
| Q-STG-4 | Who gets staging accounts besides the CEO (vets, QA Lead)? | Account provisioning. | CEO | P2+ | |
| Q-STG-5 | Gate staging behind basic-auth / IP allow-list, or open login with rate limiting? | Exposure of a demo system. | CEO | P2+ | |

---

## How to use during the farm visit

The practical visit kit lives in [farm-visit/](farm-visit/): [FARM_VISIT_FIELD_GUIDE.md](farm-visit/FARM_VISIT_FIELD_GUIDE.md) (sequence and what to observe), [FARM_DATA_CAPTURE_TEMPLATES.md](farm-visit/FARM_DATA_CAPTURE_TEMPLATES.md) (blank forms), [RFID_HARDWARE_INSPECTION.md](farm-visit/RFID_HARDWARE_INSPECTION.md), [FARM_WORKFLOW_DISCOVERY.md](farm-visit/FARM_WORKFLOW_DISCOVERY.md) (interviews by role) and [FARM_VISIT_OPEN_QUESTIONS.md](farm-visit/FARM_VISIT_OPEN_QUESTIONS.md) (this list, prioritised P0–P3). This file remains the master record of answers.

1. Walk the shed first; photograph registers, tags, reader, scale, feed store.
2. Go through sections A–I with the relevant person; write answers directly in this file on a branch.
3. Anything surprising → add a new question rather than guessing.
4. After the visit: open a PR "Farm visit findings", update REQUIREMENTS.md tags, and log decisions.
