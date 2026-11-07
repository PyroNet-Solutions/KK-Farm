# Farm Visit Field Guide

**Purpose:** a step-by-step guide for the on-site KK Farm visit so that requirements, domain model, architecture and roadmap can be finalised on real-world evidence rather than assumptions.
**Who uses it:** Ammar (and anyone accompanying). Works on a phone or printed.
**Companion files:** [FARM_DATA_CAPTURE_TEMPLATES.md](FARM_DATA_CAPTURE_TEMPLATES.md) (blank forms) · [RFID_HARDWARE_INSPECTION.md](RFID_HARDWARE_INSPECTION.md) · [FARM_WORKFLOW_DISCOVERY.md](FARM_WORKFLOW_DISCOVERY.md) (interviews) · [FARM_VISIT_OPEN_QUESTIONS.md](FARM_VISIT_OPEN_QUESTIONS.md) (what must be answered).

## 0. Evidence standard — use these tags on every note

| Tag | Meaning | Example |
|-----|---------|---------|
| **CONFIRMED** | Verified by a document, count or measurement during the visit | counted 117 goats in Shed 1 |
| **OBSERVED** | Seen happening, not measured | feeding done from wheelbarrow, two workers |
| **REPORTED** | Told by a person (name the role, not the person: "VET-1", "EMP-03") | EMP-03 says weighing is monthly |
| **ASSUMED** | Our interpretation; must be confirmed later | pens are ~20 head each |
| **UNKNOWN** | Asked, no answer / nobody knew | reader model |

Never write real names, phone numbers or ID numbers in these files. Use codes: `EMP-01…`, `VET-1…`, `SUP-01` (supplier). Keep a private name↔code key **outside Git**.

### Facts previously reported in the project brief — validate each on site

| # | Previously reported | Validate by | Result (fill) |
|---|---------------------|-------------|---------------|
| F-1 | Principle: quality of goats, not quantity | CEO interview | |
| F-2 | ≈118 goats | head count / register total | |
| F-3 | 1 operational shed; ≈6 planned | walk-through; plan drawing | |
| F-4 | Multiple breeds; crossbreeding to be supported | register breed column; ask vet | |
| F-5 | Handwritten registers exist | photograph each register | |
| F-6 | RFID ear tags installed on goats | inspect tags | |
| F-7 | Android RFID reader available | inspect device | |
| F-8 | Permanent veterinary doctors on site | vet interview; roster | |
| F-9 | Feeding is group-based | observe feeding | |
| F-10 | CEO controls finances initially | CEO/finance interview | |
| F-11 | RFID tags are reusable; permanent IDs never reused; history survives reassignment | **design rule** — confirm current practice when a tag is lost | |
| F-12 | Vets will have dedicated system access; AI assists, never replaces vet approval | **design rule** — confirm with vets | |

## 1. Before the visit (checklist)

- [ ] Print or load on phone: this guide + templates + RFID checklist + interview sheets.
- [ ] Phone fully charged + power bank; camera working; a notebook and pen as backup.
- [ ] Agree with the CEO that photographs of registers, tags, devices, sheds and feed/medicine stores are allowed (no photos of people's faces unless they agree).
- [ ] Ask the CEO to have available: all registers, the RFID reader and its charger, any vendor paperwork/boxes, feed and medicine purchase bills (to see *format*, not amounts), the shed expansion plan if drawn.
- [ ] Plan ~1 full day (half day minimum). Suggested order below.
- [ ] Biosecurity: clean footwear/clothes; follow the vet's instructions; wash hands between sheds and before touching registers.

## 2. Suggested visit sequence and timing

| Time | Block | Output |
|------|-------|--------|
| 0:00–0:30 | CEO briefing — vision, priorities, what frustrates him today | Interview sheet A |
| 0:30–1:30 | Walk the shed(s) — structure, pens, water, feed, isolation, kidding, weighing, stores | Templates T-2, T-7, T-8; photos |
| 1:30–2:15 | Registers — photograph every register, capture exact columns | Template T-3 (one per register) |
| 2:15–3:00 | RFID reader and tags inspection | RFID checklist |
| 3:00–3:45 | Vet interview + medicine store | Interview sheet B; T-5, T-8 |
| 3:45–4:30 | Feeding / cleaning / animal-care staff — observe a feeding if timing allows | Interview sheets C/D/E; T-7 |
| 4:30–5:00 | Finance / purchases / sales workflow with CEO | Interview sheet F; T-9, T-10 |
| 5:00–5:30 | Wrap-up: read back key findings to CEO; list unknowns; agree follow-ups | Open questions update |

## 3. Walk-through: what to observe, ask, photograph, record

### 3.1 Farm structure and operations
- Observe: site layout, number of buildings, entrances, water source, electricity reliability, mobile signal / Wi‑Fi strength **inside** the shed (note bars/operator), where staff keep their phones, lighting (sunlight glare on screens), dust/moisture.
- Ask: planned expansion (where will sheds 2–6 go, timeline), who manages the farm day-to-day when the CEO is absent.
- Photograph: overall site, each building exterior, any site plan.
- Record in: T-2 (sheds), notes.

### 3.2 Goat population, breeds, categories
- Observe: approximate head count per pen; visual tags (colour, number format); castrated males present?; kids with dams?; animals in isolation.
- Ask: how animals are categorised today (kids / growers / breeding does / bucks / fattening / for sale / sick), how breed is decided for crossbreds, whether any goat has no tag.
- Count: total animals (compare with register total → CONFIRMED vs REPORTED).
- Record in: T-2, T-3 (register fields), T-4 (breeding), open questions Q-AM-*.

### 3.3 Sheds, capacity, distribution
- Observe: pens per shed, pen dimensions (pace them), feeders/waterers per pen, gates, how animals are moved between pens, separate areas (kidding, isolation/sick bay, bucks, quarantine for new purchases).
- Ask: official capacity per shed/pen, how pens are named today (if at all), how often animals are moved and why.
- Photograph: each pen with its label (if any), feeders, water, isolation area.
- Record in: T-2.

### 3.4 Employees, roles, responsibilities, assignments
- Ask the CEO/manager for the staff list (codes only in our files): role, shift, days, literacy/language, own smartphone?, comfort with apps/WhatsApp.
- Observe: who actually does what during the visit; whether one person covers several roles; supervision pattern.
- Ask: how daily work is assigned today (verbal, board, WhatsApp), how absence is handled.
- Record in: T-1; interview sheets.

### 3.5 Routines — feeding, cleaning, handling, veterinary
- Observe (ideally watch one feeding): feed types, how quantities are measured (scoop, bag, kg), per-pen or per-animal, water routine, frequency per day, who confirms it was done.
- Observe: cleaning method, frequency, waste handling, disinfectant use.
- Ask the vet: daily health round (who, when), how a sick goat is flagged and by whom, treatment recording, vaccination/deworming schedule, isolation rules, where medicines are kept and who issues them.
- Ask: how goats are restrained/handled for weighing, injections, tag reading; where the scale is; how often weighing happens.
- Record in: T-5, T-6, T-7, T-8; interview sheets B–E.

### 3.6 Lifecycle processes — purchase, birth, sale, death, transfer
For each, capture **who → when → what is written → who approves → what goes wrong** (use [FARM_WORKFLOW_DISCOVERY.md](FARM_WORKFLOW_DISCOVERY.md) §3):
- Purchase: source, paperwork, quarantine, tagging, register entry, payment.
- Birth: who attends, what is recorded (dam, sire if known, sex, weight, difficulty, stillbirths), when kids are tagged.
- Sale/gift/sacrifice: how buyer/recipient is recorded, price, tag removal and reuse, register closure.
- Death: who confirms, cause recording, carcass handling, tag handling.
- Transfer between pens/sheds: who decides, is it written anywhere.
- Record in: T-4, T-10; interview sheets.

### 3.7 Daily, weekly, monthly management activities
- Ask the manager/CEO to describe a normal day, week and month; capture recurring activities and their records (e.g. monthly weighing, weekly feed purchase, monthly salary, seasonal breeding, vaccination campaigns, Eid sales season).
- Record in: FARM_WORKFLOW_DISCOVERY §4 calendar table.

## 4. Registers — how to capture them correctly

For **every** handwritten register, book, sheet or whiteboard:
1. Photograph the cover, the column-heading row, one typical filled page (mask names if present) and the last page in use.
2. Copy the **exact column headings in order** into Template T-3 — including abbreviations and local-language headings, with a translation column.
3. Note: who writes in it, when, how far back it goes, how many volumes, whether anything is also in Excel/WhatsApp.
4. Ask for the *one worst problem* with that register (lost pages, duplicates, unreadable, no one updates it).

Do **not** copy any real data values into Git — only the structure.

## 5. Photo log convention

Name photos in a private log (not in Git): `PH-001 shed1-exterior`, `PH-002 register-health-cover`, … and reference the number in templates (`photo: PH-014`). Photos stay in a private folder shared with the engineering side out-of-band.

## 6. At the end of the visit

- [ ] Read the key numbers back to the CEO (goats, pens, staff, registers, reader model) and mark each CONFIRMED/REPORTED.
- [ ] Go through [FARM_VISIT_OPEN_QUESTIONS.md](FARM_VISIT_OPEN_QUESTIONS.md) P0 items; mark answered / still open / needs follow-up (who, by when).
- [ ] Collect the vendor contact for the RFID reader and tags (supplier code `SUP-xx`).
- [ ] Agree how the Excel workbook and register photos will be shared (not via Git).
- [ ] Note unexpected findings in the Notes area below.

## 7. Notes area (unexpected findings)

| # | Finding | Tag | Impact on design | Follow-up |
|---|---------|-----|------------------|-----------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
