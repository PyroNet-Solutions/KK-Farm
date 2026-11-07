# Farm Visit — Prioritised Open Questions

**Purpose:** the questions that must be resolved before implementation, ordered by priority, so the visit answers the most consequential ones first. IDs reference the master list in [../OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) (which stays the single source; answers go there afterwards).

**Priority:** **P0** = blocks Phase 1 design or the stack/mobile decision · **P1** = blocks a Phase 1–2 module or data migration · **P2** = needed by Phase 3+ · **P3** = nice to know.
**Record answers with tags:** CONFIRMED / OBSERVED / REPORTED / ASSUMED / UNKNOWN.

## 0. Previously reported facts to validate (from the brief)

| # | Reported fact | Validate via | Status |
|---|---------------|--------------|--------|
| F-1 | Quality over quantity is the guiding principle | Sheet A2 | |
| F-2 | ≈118 goats | head count vs register | |
| F-3 | 1 operational shed, ≈6 planned | walk-through, plan | |
| F-4 | Multiple breeds; crossbreeding must be supported | T-4 | |
| F-5 | Handwritten registers exist | T-3 photos | |
| F-6 | RFID ear tags installed | RFID §2 | |
| F-7 | Android RFID reader available | RFID §1 | |
| F-8 | Permanent vets on site | T-1, Sheet B | |
| F-9 | Group-based feeding | T-7, observation | |
| F-10 | CEO controls finances initially | Sheet F | |
| F-11 | Tags reusable; permanent IDs never reused; history survives reassignment (design rule) | confirm current lost-tag practice, E8 | |
| F-12 | Vets get dedicated access; AI never replaces vet approval (design rule) | Sheet B13 | |

## P0 — must be answered on this visit

| # | Question | Master ID | Source | Answer / tag |
|---|----------|-----------|--------|--------------|
| 1 | Reader manufacturer, model, Android version, vendor app | Q-RF-1 | RFID §1, §3 | |
| 2 | Tag technology (LF ISO 11784/11785 vs UHF EPC); printed number format | Q-RF-2 | RFID §2 | |
| 3 | Any documented way for third-party software to receive scans (SDK / keyboard-wedge / broadcast / Bluetooth)? | Q-RF-3 | RFID §3, §6 | |
| 4 | Mobile signal / Wi‑Fi inside the shed(s) → is offline capture required? | Q-FM-3 / Q-NFR-1 | T-11 | |
| 5 | Staff list: count, roles, literacy/language, own phones vs shared devices, phone models | Q-RB-1, Q-FM-4, Q-PF-1 | T-1, T-11 | |
| 6 | Current animal numbering scheme — unique? reused? printed where? | Q-AM-1 | T-3 (stock register) | |
| 7 | Existing goat → tag mapping list exists? format | Q-AM-2 | T-3 | |
| 8 | Pens: real subdivisions with capacities, or one open shed? names used | Q-FM-1 | T-2 | |
| 9 | Mating practice: controlled vs group; is the sire known per kid? | Q-PB-1 | T-4 | |
| 10 | Who may record a dose given; who may diagnose/prescribe (hard gates) | Q-VT-1 | Sheet B5 | |
| 11 | Language(s) for the app | Q-NFR-2 | Sheet A13 | |
| 12 | Preferred stack/hosting constraints from the owner (confirm team familiarity assumption behind D-023) | Q-NFR-3 | Sheet A | |
| 13 | Exit reasons in use (sold, gifted, sacrificed, died, culled, lost) and paperwork | Q-AM-7 | T-10 | |
| 14 | Lost/damaged tag procedure today | Q-AM-6 | E8, RFID §2 | |
| 15 | Which screens must be live (real-time) from day one | Q-RT-1 | Sheet A7 | |
| 16 | Photo retention rule (soft-hide only?) and keep originals? | Q-PH-1, Q-PH-3 | Sheet A | |
| 17 | GPL dependency policy for anything shipped to devices | Q-NFR-5 | Sheet A / engineering | |

## P1 — needed for Phase 1–2 modules and migration

| # | Question | Master ID | Source | Answer / tag |
|---|----------|-----------|--------|--------------|
| 18 | Exact column headings of every register (one T-3 per register) | Q-FM-5 | T-3 | |
| 19 | Milk production relevant? | Q-AM-5 | Sheet A11 | |
| 20 | Castrated males present; classification | Q-AM-3 | T-4 | |
| 21 | Gestation length used; per breed? | Q-PB-2 | T-4 / B9 | |
| 22 | Heat detection method | Q-PB-6 | E4, B | |
| 23 | Pregnancy confirmation method/timing | Q-PB-7 | B9 | |
| 24 | What is recorded at kidding | Q-PB-8 | B10, T-4 | |
| 25 | Weight unit/precision, scale type, output port | Q-WT-1, Q-WT-2 | T-6 | |
| 26 | Weighing frequency and who | Q-WT-4 | T-6 | |
| 27 | Withdrawal periods tracked? | Q-VT-2 | B6 | |
| 28 | Vaccination/deworming schedule | Q-VT-5 | B7 | |
| 29 | Critical conditions and alert recipients/channel | Q-VT-6, Q-RB-3, Q-RT-2 | B8, A9 | |
| 30 | Vet count, shifts, shared notes | Q-VT-7 | T-1, B | |
| 31 | Symptom/diagnosis vocabulary vs free text | Q-VT-8 | B4 | |
| 32 | Existing medical / weight / breeding records: years, format, quality | Q-VT-4, Q-WT-3, Q-PB-5 | T-3 | |
| 33 | Feeding groups, rations, schedule; who decides/approves; how "done" is confirmed | Q-NF-1, Q-NF-2, Q-NF-3 | T-7, C | |
| 34 | Daily tasks and how assigned | Q-FM-2 | Sheet C/D/E, §3 table | |
| 35 | Currency; payment methods; append-only corrections acceptable | Q-FN-1, Q-FN-6, Q-FN-3 | Sheet F | |
| 36 | Photo context tags useful to vets/sales | Q-PH-2 | B, A | |

## P2 — Phase 3+ and infrastructure

| # | Question | Master ID | Source | Answer / tag |
|---|----------|-----------|--------|--------------|
| 37 | Relatedness warnings before mating; threshold | Q-PB-3 | A2, B | |
| 38 | Pedigree depth known; breeder certificates for purchased animals | Q-PB-4 | T-4 | |
| 39 | Definition of "high quality" traits for selection | Q-PB-9 | A2, B | |
| 40 | Medicine stock management; feed stock tracking | Q-VT-3, Q-NF-4 | T-8 | |
| 41 | Body-condition scoring in group assignment | Q-NF-5 | B11 | |
| 42 | Cost allocation rule for lifetime cost; shed-wise costs | Q-FN-2 | F4, F5 | |
| 43 | Finance delegation limits / dual approval | Q-FN-4 | F8 | |
| 44 | Existing accounting system | Q-FN-5 | F9 | |
| 45 | Multiple roles per person; shed-scoped roles | Q-RB-2 | T-1 | |
| 46 | Rule-based alerts acceptable first; who approves thresholds | Q-AI-1, Q-AI-2 | B13 | |
| 47 | VM provider/spec, domains, off-site backup destination, maintenance window | Q-INF-1…4, Q-PF-3 | Sheet A | |
| 48 | Peak concurrent users in 3 years | Q-PF-2 | A6 | |
| 49 | External photo sharing (buyer links) | Q-PH-4 | A10 | |
| 50 | Tags registered with PAITS or any authority | Q-RF-5 | RFID §2 | |
| 51 | Data exchange with registry/buyers; trial a goat SaaS for UX study | Q-BC-3, Q-BC-2 | A | |
| 52 | Backup/retention or regulatory record-keeping requirements | Q-NFR-4 | A | |

## P3 — nice to know

| # | Question | Source |
|---|----------|--------|
| 53 | Manure sale / by-products | D4 |
| 54 | Seasonal patterns (breeding season, disease season, Eid volumes) | §4 calendar |
| 55 | Staff turnover and training approach | A5 |

## After the visit

1. Transfer every answer into [../OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) with its tag; re-tag requirements in [../REQUIREMENTS.md](../REQUIREMENTS.md).
2. Record decisions in [../DECISIONS_LOG.md](../DECISIONS_LOG.md).
3. Open a PR "Farm visit findings" and update [../PROJECT_STATUS.md](../PROJECT_STATUS.md).
4. List what is still UNKNOWN and who will chase it (vendor, vet, CEO) by when.
