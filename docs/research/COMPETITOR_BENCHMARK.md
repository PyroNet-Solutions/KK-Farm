# Competitor Benchmark — Five International Goat/Herd Platforms vs. KK Farm Requirements

> **Inspiration only (principle P-2, D-034).** These products are research references for features, workflows, UX, strengths and gaps. KK Farm is an original product built from scratch; nothing here authorises copying source code, designs, screens, branding or assets.

**Date:** 2026-11-07 · **Status:** Research v0.1 · **Builds on:** [PLATFORM_COMPARISON.md](PLATFORM_COMPARISON.md) (licensing/reuse) and the owner's shortlist of five products (Throf, Farmbrite, UNIFORM-Agri Goat, PeakHerds, UBIQ by Seenovia).

## 1. Method and evidence quality

The five products were proposed from a secondary summary. Every claim below was re-checked against the vendor's **own published pages** on 2026-11-07. Only what a page actually states counts.

| Product | Pages read | Evidence quality |
|---------|-----------|------------------|
| **Throf** (Saudi Arabia) | throf.com/en, /en/pricing (incl. FAQ) | **Good** — detailed feature and pricing pages |
| **Farmbrite** (USA) | farmbrite.com/features, /pricing (the "goat management" URL now 404s) | **Good** — feature catalogue and pricing; no goat-specific page any more |
| **UNIFORM-Agri Goat** (Netherlands) | — | **None** — site returns HTTP 403 (Wordfence bot protection) to both the fetcher and a Chrome session. All UNIFORM rows are **unverified** |
| **PeakHerds** (USA) | peakherds.com, /pricing | **Good** |
| **UBIQ – Seenovia** (France) | the UBIQ article + "Qui sommes-nous", "Filière caprine", "Outils de pilotage" | **Medium** — marketing article; the product page itself was not read; French only |

Legend in the matrix: **●** published yes · **◐** partial / implied · **○** not found on pages read · **?** could not verify (site blocked or page not read) · **—** not applicable.
Pricing figures are vendor-published list prices on the date read; they change.

## 2. Feature-by-feature matrix

| # | KK Farm requirement (ID) | Throf | Farmbrite | UNIFORM Goat | PeakHerds | UBIQ | KK Farm target |
|---|--------------------------|:-----:|:---------:|:------------:|:---------:|:----:|:--------------:|
| 1 | Goats explicitly supported (BC-3) | ● sheep/goats/camels, 19 breeds | ● "unlimited multi-species" | ? (dairy goats claimed) | ● goats & sheep | ● goats (dairy-leaning) | ● goats, multi-breed, crossbreds |
| 2 | Individual animal profile **with photo** (AM-1, PH-1) | ● "13 sections in one file" incl. photos | ● images & files stored | ? | ● photos, animal cards | ◐ history, no photo mentioned | ● profile + gallery + history |
| 3 | Permanent ID separate from reusable tag, assignment history (AM-2, F-11) | ○ not documented | ○ not documented | ? | ○ | ○ | ● **core rule** |
| 4 | RFID/EID scanning (NFR-2) | ● Bluetooth FDX‑B readers, Android & iOS, ≤10 m | ● "Electronic ID scanner data integration" | ? (stick reader claimed) | ○ | ○ | ● hardware-agnostic scan source |
| 5 | Pedigree / family tree (PB-1, PB-2) | ● dam & sire, "pedigree"; tree unclear | ● "Livestock genealogy" | ? | ○ | ○ | ● multi-generation, interactive |
| 6 | Breeding cycle: heat → mating → pregnancy → kidding (PB-3…PB-7) | ◐ insemination, pregnancy checks, due dates, births/twins, miscarriage; heat ○ | ● "Breeding and fertility" | ? | ◐ breeding/kidding reminders only | ◐ births as movements | ● full cycle with group-mating option |
| 7 | Relatedness / inbreeding warning (PB-11) | ○ | ○ | ? | ○ | ○ | ● (assumed, Q-PB-3) |
| 8 | Weight records, growth, ADG (WT-1…WT-5) | ● weight & body-condition report; "FCR/ADG" named | ● growth charts & performance metrics | ? | ◐ weights | ● kid growth module | ● ADG + peer comparison + alerts |
| 9 | Vet examination with symptoms (VT-2…VT-4) | ● 14-symptom exam, BCS 1–5 | ◐ health records | ? | ◐ treatment history | ● digital health book | ● structured + vocabulary (Q-VT-8) |
| 10 | Treatments, medicine inventory, expiry (VT-5, VT-11) | ● medicine warehouse with expiry | ● treatment plans & templates | ? | ◐ medication follow-up | ● treatments | ● + dose log by named user |
| 11 | Withdrawal periods (VT-10) | ● per-head meat/milk withdrawal | ● withdrawal reporting + reminders | ? | ○ | ○ | ● blocks sale |
| 12 | Vaccination / preventive schedule & reminders (VT-6, VT-7) | ● vaccination calendar (8 vaccines) | ● due-date reminders | ? (action lists claimed) | ● recurring reminders | ● automatic alerts | ● vet-tunable rules |
| 13 | **Vet-only clinical actions enforced** (VT-1, I-4) | ◐ 50+ permissions (not clinical-specific) | ◐ roles & read-only/auditor | ? | ○ | ○ | ● **hard gate** |
| 14 | Feeding groups & rations (NF-1, NF-2) | ◐ feed & water warehouse, auto-deduction per meal; groups ○ | ◐ "feed performance", group management | ? (concentrate feeding claimed) | ○ | ◐ adapt feeding per group | ● criteria-based groups |
| 15 | **Feeding plan approval workflow** (NF-4) | ○ | ○ | ? | ○ | ○ | ● vet/nutritionist approval |
| 16 | Feeding compliance log per session (NF-5) | ◐ auto stock deduction implies meals | ○ | ? | ◐ "feed runs" as project | ○ | ● done/partial/missed with evidence |
| 17 | Tasks / daily assignments (FM-4, FM-6) | ● daily tasks by priority, "daily work sheet" | ● full task & team management, time tracking | ? (task generation claimed) | ● daily tasks | ○ | ● scan-linked tasks |
| 18 | Roles & configurable permissions (RB-2) | ● 50+ permissions, employee activity tracking (Gold+) | ● custom access controls | ? | ○ (last write wins) | ○ | ● + hard gates + delegation |
| 19 | Expenses, suppliers, bills (FN-3…FN-6) | ● expenses, sales, net profit (SAR) | ● full accounting, receipts, bank feed, budgeting | ? | ◐ expenses (Premium+) | ○ | ● append-only ledger |
| 20 | **Cost per animal / per shed** (FN-8, FN-9) | ● "five cost buckets per head" | ◐ breakeven/ROI analysis | ? | ○ | ○ | ● allocation rules → lifetime cost, shed-wise |
| 21 | Finance restricted to authorised users (FN-12) | ● owner-only finance | ● permissions | ? | ○ | ○ | ● separate permission domain |
| 22 | Audit trail (FN-11, NFR-5) | ◐ activity tracking | ● user audit trail | ? | ○ | ○ | ● immutable, all domains |
| 23 | Mobile apps (BC-5) | ● iOS & Android | ● iOS & Android | ? | ◐ PWA (home-screen install) | ◐ "mobile & desktop" | ● PWA (+Capacitor if needed) |
| 24 | **Offline capture** (NFR-3) | ○ not stated | ● offline record keeping | ? | ○ not stated | ○ | ● if Q-FM-3 confirms |
| 25 | **Real-time live updates** (RT-1) | ◐ "web & phone share data in real time" (claim) | ○ | ? | ○ | ◐ "mises à jour en temps réel" (claim) | ● sub-second, authorised channels |
| 26 | Multi-shed / multi-farm (FM-1) | ● multi-farm switch | ● enterprise multi-farm | ? | ○ | ○ | ● sheds/pens; farm_id-ready |
| 27 | Import (Excel) / export (migration) | ● Excel template import; PDF & Excel export | ● data importing; reports | ? | ◐ import; export format unstated | ◐ declarations only | ● register/Excel import with validation |
| 28 | API / integrations | ○ (WhatsApp support only) | ● API + Zapier | ? | ○ | ◐ milk-meter data | ● internal API; ICAR ADE-aligned export later |
| 29 | Languages (NFR-4) | ● Arabic & English (RTL) | ◐ "localized language support" | ? | ○ English | ○ French | ● Urdu + English |
| 30 | **Low-literacy, scan-first, shared-device UX** (BC-5) | ◐ worker training offered | ○ | ? | ◐ simplicity | ◐ simplified field entry | ● **differentiator** |
| 31 | Advisory intelligence with vet guard-rails (AI-1…AI-4) | ○ | ○ | ? | ○ | ◐ alerts | ● rules → stats → ML |
| 32 | Self-hosting / data residency (INF) | ○ SaaS (KSA) | ○ SaaS (US) | ? | ○ SaaS (US) | ○ SaaS (FR) | ● own VM |

## 3. Pricing snapshot (vendor-published, 2026-11-07)

| Product | Model | Tiers | Notes |
|---------|-------|-------|-------|
| Throf | annual, SAR incl. 15 % VAT | Free ≤ 25 head · Economy 172.5 (105 animals) · Silver 345 (210, +1 employee) · Gold 621 (420, +2) · Enterprise 1,138.5 (840, +3) | ≈ SAR 621/yr for KK Farm's current size → Gold; employee seats are limited per tier |
| Farmbrite | monthly/annual, USD | Livestock plans from **$29/mo**; Complete from $59/mo; 14-day trial; 25 % promo to Nov 30 | per-plan active-animal limits; discounts for new farmers/nonprofits |
| UNIFORM Goat | ? | ? | could not read site |
| PeakHerds | monthly/annual, USD | Basic $10/mo (50 animals) · Premium $20/mo (200) · Enterprise $45/mo (6000+); yearly −20 % | 30-day trial code on site |
| UBIQ | — | not published ("contact your Seenovia adviser") | regional (Pays de la Loire / Charente-Maritime) advisory body |

Caveat: a feature on a website ≠ an accessible API or integration. None of the five offers Urdu, PKR pricing, Pakistan data residency or self-hosting.

## 4. What none of them adequately addresses — KK Farm's gaps to own

| Gap | Evidence | Why it matters for KK Farm |
|-----|----------|----------------------------|
| **G1. Permanent identity decoupled from a reusable RFID tag, with full assignment history** | No product documents tag lifecycle; most treat the EID as the animal number | Core rule F-11; prevents history corruption when tags are reused |
| **G2. Veterinary accountability enforced in software** (only vets diagnose/prescribe; dose logs by named user; AI advisory only) | Throf/Farmbrite have generic roles; none describe clinical hard gates or AI guard-rails | F-12, VT-1, AI-4 |
| **G3. Feeding-plan approval workflow + per-session compliance** | Feed *stock* exists (Throf); feed *plans approved by a vet and confirmed per feeding* do not | NF-4, NF-5; "quality" depends on nutrition discipline |
| **G4. Low-literacy, Urdu, scan-first UX on shared Android devices** | All five assume a literate owner-operator in Arabic/English/French | BC-5 — adoption by caretakers decides success |
| **G5. Sub-second, permission-aware real-time across roles** | Throf/UBIQ claim "real time" sync; none document live multi-user views, channel authorisation or latency | RT-1…RT-4 |
| **G6. Photo history as identity** (gallery with dates, notes, context tags; photos surviving tag reassignment) | Photos exist as attachments (Throf, PeakHerds, Farmbrite); no photo *history* or identity binding | PH-1…PH-9 |
| **G7. Lifetime cost per goat from allocated shared costs + shed-wise cost, with append-only audit** | Throf's five cost buckets per head is the closest; allocation rules and immutable ledgers are undocumented | FN-8, FN-9, FN-11 |
| **G8. Breeding *quality* tooling** (relatedness warnings, selection shortlist from traits, offspring ADG by sire) | Genealogy and fertility tracking exist; relatedness/selection intelligence does not | BC-2 "quality not quantity", PB-11, AI Layer 2 |
| **G9. Shed/pen-level operational model with transfers and capacity** | Multi-farm yes (Throf, Farmbrite); shed/pen capacity and transfer history not documented | FM-1, FM-2, 6-shed expansion |
| **G10. Self-hosted, data-resident, shared-VM deployment** | All are SaaS abroad | INF-1…INF-3, owner control of farm data |

## 5. What to borrow from each (design lessons)

| Product | Borrow | Where it lands in KK Farm docs |
|---------|--------|-------------------------------|
| **Throf** | 13-section animal file as a profile layout; vaccination calendar; 14-symptom exam + BCS 1–5; medicine warehouse with expiry and per-head withdrawal; auto feed-stock deduction per meal; daily work sheet by priority; owner-only finance; Excel import template; free tier for small herds; Arabic/English RTL (useful precedent for Urdu) | DOMAIN_MODEL §3.5, §3.7; MEDIA_AND_PHOTOS §8; REQUIREMENTS VT/NF/FM |
| **Farmbrite** | EID scanner integration as a first-class setting; withdrawal reporting with reminders; treatment plan templates; genealogy view; growth charts; feed performance; user audit trail; offline record keeping; API/Zapier mindset | RFID_INTEGRATION_RESEARCH §4; SECURITY_AND_RBAC §6; PERFORMANCE/OFFLINE |
| **PeakHerds** | PWA installed from the browser (no store friction); animal cards; recurring reminders; per-head pricing tiers as a mental model for capacity planning | TECHNOLOGY_EVALUATION §3.3 (D-028); UX-4 |
| **UBIQ** | Real-time update expectation; digital health book with automatic alerts; kid-growth module as a first-class screen; feeding adapted per group | REALTIME_ARCHITECTURE; AI_INTELLIGENCE_DESIGN Layer 1 |
| **UNIFORM Goat** (unverified) | Claimed stick-reader connections, vet action lists and task generation — **verify manually** before citing | RFID / VT backlog |

## 6. Recommendations

1. **Do not model KK Farm on any single product.** The gaps in §4 are exactly the owner's priorities; the five are useful for *module-level* patterns (§5), not for the product shape.
2. **Study Throf first, hands-on:** its free tier (≤ 25 head) allows a no-cost trial to learn its RFID, permissions, feed-stock and cost-per-head flows. Decision for Ammar: Q-BC-2 (now specific: trial Throf's free tier; optionally a 14-day Farmbrite trial).
3. **Verify UNIFORM-Agri manually** (a person opening the site, or sales contact) before it is cited as a reference for reader integration.
4. **Keep the benchmark alive:** re-check these five before each phase gate; add a column when a product is trialled, recording what was *experienced*, not advertised.
5. Feed §4 into the roadmap as KK Farm's differentiators; feed §5 into module design issues as "reference patterns".

## 7. Questions raised

| ID | Question | For |
|----|----------|-----|
| Q-BC-2 (refined) | Trial Throf's free tier and/or Farmbrite's 14-day trial during discovery to study UX? (no payment details without approval) | Ammar |
| Q-BC-4 | Has Ammar personally used any of the five? Which flows impressed or frustrated him? | Ammar |
| Q-BC-5 | Is Arabic/English RTL support (Throf) a hint that Urdu RTL must be first-class from day one? (links Q-NFR-2) | Ammar |

## 8. Sources

Vendor pages read 2026-11-07: [Throf](https://www.throf.com/en) · [Throf pricing](https://www.throf.com/en/pricing) · [Farmbrite features](https://www.farmbrite.com/features) · [Farmbrite pricing](https://www.farmbrite.com/pricing) · [PeakHerds](https://peakherds.com/) · [PeakHerds pricing](https://peakherds.com/pricing) · [UBIQ article (Seenovia)](https://www.seenovia.fr/ubiq-la-nouvelle-application-pour-piloter-votre-troupeau-caprin/) · [Seenovia – Outils de pilotage](https://www.seenovia.fr/) · UNIFORM-Agri goat page: [URL](https://www.uniform-agri.com/solutions/for-dairy-goat-farmers/) returned HTTP 403 (Wordfence) — not read.
