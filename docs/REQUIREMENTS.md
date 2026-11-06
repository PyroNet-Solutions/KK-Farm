# Requirements

**Status:** Draft v0.1 — captured from the project brief (2026-11-07). Not yet validated by farm visit.

## How to read this document

Every requirement is tagged with exactly one status:

| Tag | Meaning |
|-----|---------|
| `[CONFIRMED]` | Stated explicitly in the project brief by the project owner. |
| `[ASSUMED]` | Reasonable interpretation by the engineering side. **Must be confirmed** before implementation. Each has a matching question in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). |
| `[UNKNOWN]` | Needed, but no information yet. Listed in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). |

Requirement IDs are stable: `AM` = Animal Management, `PB` = Pedigree & Breeding, `WT` = Weight, `VT` = Veterinary, `NF` = Nutrition & Feeding, `FM` = Farm Management, `FN` = Finance, `AI` = Intelligence, `RB` = Roles, `NFR` = Non-functional.

---

## 0. Business context

| ID | Requirement | Status |
|----|-------------|--------|
| BC-1 | Primary objective is **internal farm management and quality breeding**, not a marketplace. | `[CONFIRMED]` |
| BC-2 | Quality of goats over quantity: the system must make it easy to evaluate individual animals and bloodlines. | `[CONFIRMED]` |
| BC-3 | Current scale: ~118 goats, 1 operational shed, 6 sheds planned, multiple breeds, handwritten registers, RFID ear tags installed, Android RFID reader available, permanent veterinary doctors on site. | `[CONFIRMED]` |
| BC-4 | The system must scale from 118 goats to multiple sheds and a much larger herd **without redesigning the core data model**. | `[CONFIRMED]` |
| BC-5 | Must be extremely easy to operate on mobile phones, including by employees with limited technical education. | `[CONFIRMED]` |
| BC-6 | Preserve complete historical records; never delete lifecycle data. | `[CONFIRMED]` |

## 1. Animal Management (AM)

| ID | Requirement | Status |
|----|-------------|--------|
| AM-1 | Each goat has a unique, permanent, immutable digital identity (Animal ID). | `[CONFIRMED]` |
| AM-2 | RFID EPC is **never** the primary key. Animal ID and RFID assignment are separate; RFID assignments have full history (assigned, unassigned, reason, who, when). | `[CONFIRMED]` |
| AM-3 | A tag can be reassigned to another animal after being closed on the previous one. | `[CONFIRMED]` |
| AM-4 | When an animal leaves the farm (sold, gifted, sacrificed, died, other), its RFID assignment is closed; its records are **never deleted**. | `[CONFIRMED]` |
| AM-5 | Sex classification: male / female. | `[CONFIRMED]` |
| AM-6 | Breeds are dynamically managed (add/edit without code change). | `[CONFIRMED]` |
| AM-7 | Birth date **or** estimated age; the system must record which one it is. | `[CONFIRMED]` |
| AM-8 | Parent identification (sire, dam). | `[CONFIRMED]` |
| AM-9 | Origin record: born on farm, or purchased (with purchase details). | `[CONFIRMED]` |
| AM-10 | Current shed and location. | `[CONFIRMED]` |
| AM-11 | Complete lifecycle history visible per animal (timeline). | `[CONFIRMED]` |
| AM-12 | Castrated males (wethers) should be representable as a status, not a third sex. | `[ASSUMED]` → Q-AM-3 |
| AM-13 | A human-readable farm tag number (visual ear tag / name) exists alongside the Animal ID and RFID. | `[ASSUMED]` → Q-AM-1 |
| AM-14 | Photos of the animal can be attached to its record. | `[ASSUMED]` → Q-AM-4 |
| AM-15 | Existing animal ID numbering scheme and current RFID mapping. | `[UNKNOWN]` → Q-AM-1, Q-AM-2 |

## 2. Pedigree & Breeding (PB)

| ID | Requirement | Status |
|----|-------------|--------|
| PB-1 | Sire and dam recorded per animal. | `[CONFIRMED]` |
| PB-2 | Multi-generation family tree. | `[CONFIRMED]` |
| PB-3 | Mating / breeding events with timeline. | `[CONFIRMED]` |
| PB-4 | Heat-cycle observations. | `[CONFIRMED]` |
| PB-5 | Pregnancy examinations (result, method, date, examiner). | `[CONFIRMED]` |
| PB-6 | Expected kidding dates. | `[CONFIRMED]` |
| PB-7 | Kidding events and offspring registration (kids created as new animals linked to sire/dam and the kidding event). | `[CONFIRMED]` |
| PB-8 | Breeding performance history per animal (conceptions, kiddings, litter size, kid survival). | `[CONFIRMED]` |
| PB-9 | Natural mating is the primary method; artificial insemination may be needed later. | `[ASSUMED]` → Q-PB-1 |
| PB-10 | Gestation length default ~150 days, configurable per breed. | `[ASSUMED]` → Q-PB-2 |
| PB-11 | Inbreeding-coefficient / relatedness warnings before mating. | `[ASSUMED]` (follows from "quality breeding") → Q-PB-3 |
| PB-12 | Unknown parents must be allowed (purchased animals, historical records). | `[ASSUMED]` → Q-PB-4 |
| PB-13 | Historical breeding and pedigree information content and quality. | `[UNKNOWN]` → Q-PB-5 |

## 3. Weight Management (WT)

| ID | Requirement | Status |
|----|-------------|--------|
| WT-1 | Daily, weekly or ad-hoc weight measurements. | `[CONFIRMED]` |
| WT-2 | Growth tracking per animal. | `[CONFIRMED]` |
| WT-3 | Average Daily Gain (ADG) calculation between any two weighings and over standard windows. | `[CONFIRMED]` |
| WT-4 | Historical comparison (animal vs. its own past, vs. breed/age/sex peers). | `[CONFIRMED]` |
| WT-5 | Veterinary alerts for unusual trends (loss, stall, outliers). | `[CONFIRMED]` |
| WT-6 | Weight unit is kilograms. | `[ASSUMED]` → Q-WT-1 |
| WT-7 | Scale integration (Bluetooth) is out of scope initially; manual entry. | `[ASSUMED]` → Q-WT-2 |
| WT-8 | Existing weight records. | `[UNKNOWN]` → Q-WT-3 |

## 4. Veterinary Management (VT)

| ID | Requirement | Status |
|----|-------------|--------|
| VT-1 | Individual doctor accounts (each action attributable to a named vet). | `[CONFIRMED]` |
| VT-2 | Mobile-friendly examination forms. | `[CONFIRMED]` |
| VT-3 | Daily health observations (by vets and caretakers). | `[CONFIRMED]` |
| VT-4 | Symptoms and diagnosis. | `[CONFIRMED]` |
| VT-5 | Treatments and medicine administration (what, dose, route, who, when). | `[CONFIRMED]` |
| VT-6 | Vaccination and preventive care schedules. | `[CONFIRMED]` |
| VT-7 | Follow-up appointments. | `[CONFIRMED]` |
| VT-8 | Full medical history per animal. | `[CONFIRMED]` |
| VT-9 | Critical health alerts. | `[CONFIRMED]` |
| VT-10 | Withdrawal periods for medicines (meat/milk) tracked to avoid selling treated animals too early. | `[ASSUMED]` → Q-VT-2 |
| VT-11 | Medicine inventory linked to administration records. | `[ASSUMED]` → Q-VT-3 |
| VT-12 | Caretakers can *report* a concern; only vets can *diagnose* and *prescribe*. | `[ASSUMED]` → Q-VT-1 |
| VT-13 | Existing medical records. | `[UNKNOWN]` → Q-VT-4 |

## 5. Nutrition & Feeding (NF)

| ID | Requirement | Status |
|----|-------------|--------|
| NF-1 | Feeding is initially group-based. | `[CONFIRMED]` |
| NF-2 | System helps determine feeding groups from: age, breed, sex, weight, pregnancy, lactation, growth requirement, health condition. | `[CONFIRMED]` |
| NF-3 | Special individual feeding recommendations when required. | `[CONFIRMED]` |
| NF-4 | Feeding plans are reviewed and approved by authorised veterinary/nutrition professionals before taking effect. | `[CONFIRMED]` |
| NF-5 | Feeding compliance (was the group fed per plan today) is recorded by feeding staff. | `[CONFIRMED]` (from FM "feeding compliance") |
| NF-6 | Feed items and rations are defined per plan (ingredient, quantity, frequency). | `[ASSUMED]` → Q-NF-1 |
| NF-7 | Actual feeding groups and ration quantities. | `[UNKNOWN]` → Q-NF-1 |

## 6. Farm Management (FM)

| ID | Requirement | Status |
|----|-------------|--------|
| FM-1 | Multiple sheds (1 now, 6 planned). | `[CONFIRMED]` |
| FM-2 | Animal transfers between sheds/locations with history. | `[CONFIRMED]` |
| FM-3 | Employee management. | `[CONFIRMED]` |
| FM-4 | Daily assignments. | `[CONFIRMED]` |
| FM-5 | Feeding and cleaning compliance recording. | `[CONFIRMED]` |
| FM-6 | Task management. | `[CONFIRMED]` |
| FM-7 | Operational activity history. | `[CONFIRMED]` |
| FM-8 | Sheds can be subdivided into pens; capacity per pen. | `[ASSUMED]` → Q-FM-1 |
| FM-9 | Shed layout and capacity. | `[UNKNOWN]` → Q-FM-1 |
| FM-10 | Actual employee count and responsibilities. | `[UNKNOWN]` → Q-RB-1 |

## 7. Financial Management (FN)

| ID | Requirement | Status |
|----|-------------|--------|
| FN-1 | Initially the CEO manages all payments in and out. | `[CONFIRMED]` |
| FN-2 | Later, finance operations delegated to a Finance Employee through configurable permissions. | `[CONFIRMED]` |
| FN-3 | Expense categories: feed, medicine, veterinary, employee, utilities & maintenance, animal purchase/sale, other. | `[CONFIRMED]` |
| FN-4 | Payments received and made. | `[CONFIRMED]` |
| FN-5 | Supplier records. | `[CONFIRMED]` |
| FN-6 | Bills and receipts (attachments). | `[CONFIRMED]` |
| FN-7 | Daily / weekly / monthly / yearly expense views. | `[CONFIRMED]` |
| FN-8 | Individual goat lifetime cost. | `[CONFIRMED]` |
| FN-9 | Shed-wise expenses. | `[CONFIRMED]` |
| FN-10 | Financial reporting and profitability. | `[CONFIRMED]` |
| FN-11 | All financial records have audit trails. | `[CONFIRMED]` |
| FN-12 | Financial dashboard and accounting access restricted to authorised users. | `[CONFIRMED]` |
| FN-13 | Currency is PKR; single currency. | `[ASSUMED]` → Q-FN-1 |
| FN-14 | Shared costs (feed for a group) are allocated to individual goats by a rule (e.g. per head-day) to compute lifetime cost. | `[ASSUMED]` → Q-FN-2 |
| FN-15 | Financial records are append-only: corrections are new reversing entries, not edits. | `[ASSUMED]` (best practice for FN-11) → Q-FN-3 |
| FN-16 | Financial approval workflows. | `[UNKNOWN]` → Q-FN-4 |

## 8. AI-Assisted Intelligence (AI)

| ID | Requirement | Status |
|----|-------------|--------|
| AI-1 | Intelligence layer analyses medical history, weight trends, breeding records, feeding history, age/breed, vet observations, health patterns. | `[CONFIRMED]` |
| AI-2 | Recommendations: goats needing vet examination, special feeding, weight monitoring; preventive care due; breeding follow-ups pending. | `[CONFIRMED]` |
| AI-3 | AI assists vets and caretakers; **never** replaces professional veterinary judgment. | `[CONFIRMED]` |
| AI-4 | AI must **never** independently prescribe medicine, diagnose disease, or override veterinarian instructions. | `[CONFIRMED]` |
| AI-5 | Phase 1 "intelligence" is deterministic rules (thresholds, schedules); ML/LLM features come later and only on top of clean data. | `[ASSUMED]` → Q-AI-1 |

## 9. User Roles (RB)

| ID | Requirement | Status |
|----|-------------|--------|
| RB-1 | Candidate roles: CEO/Owner, Farm Manager, Veterinarian, Caretaker, Feeding Employee, Cleaning Employee, Finance Employee. | `[CONFIRMED]` (as *candidates*) |
| RB-2 | Permissions are configurable, not hard-coded per role. | `[CONFIRMED]` (from FN-2) |
| RB-3 | One person may hold more than one role. | `[ASSUMED]` → Q-RB-2 |
| RB-4 | Actual staff responsibilities. | `[UNKNOWN]` → Q-RB-1 |

## 10. Non-functional requirements (NFR)

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-1 | Mobile-first UI; usable one-handed, with gloves/dirty hands, in bright sunlight. | `[CONFIRMED]` (BC-5) + `[ASSUMED]` details |
| NFR-2 | Scan-first workflow: scanning an ear tag opens the goat's record. | `[ASSUMED]` → Q-RF-1 |
| NFR-3 | Works with intermittent connectivity (offline capture, later sync). | `[ASSUMED]` → Q-NFR-1 |
| NFR-4 | Local language support (Urdu and English at minimum). | `[ASSUMED]` → Q-NFR-2 |
| NFR-5 | Complete audit trail: who, what, when, for every data change; financial and medical records never hard-deleted. | `[CONFIRMED]` |
| NFR-6 | Data model must scale 10×–50× in animals and sheds without redesign. | `[CONFIRMED]` |
| NFR-7 | Daily backups; restore tested. | `[ASSUMED]` |
| NFR-8 | Role-based access enforced on the server, not just hidden in the UI. | `[CONFIRMED]` (FN-12) |
| NFR-9 | Preferred technology stack and deployment environment. | `[UNKNOWN]` → Q-NFR-3 |

## Explicitly out of scope (for now)

- Public marketplace / selling goats online (goatmart-style features) — unless the CEO asks.
- Milk production tracking — not mentioned in the brief; `[UNKNOWN]` → Q-AM-5.
- Multi-farm / multi-tenant SaaS — design should not *prevent* it, but it is not a requirement.
