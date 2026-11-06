# Platform & Repository Comparison — Licensing and Reuse Feasibility

**Date:** 2026-11-07 · **Status:** Research v0.1 · **Decision input for:** D-016 (build vs. adopt vs. borrow)

## 1. Purpose and method

Before KK Farm builds anything, this note answers: *is there an existing platform or codebase we should adopt, adapt, or learn from — and does its licence allow it?*

How the data was gathered:

| Source | What it gives | Confidence |
|--------|---------------|------------|
| GitHub API (`gh api repos/…`), queried 2026-11-07 | Licence, stars, primary language, last push, archived flag — **verified** | High |
| Project READMEs / docs (farmOS, ICAR ADE, LambTracker) | Feature claims | Medium |
| Software directories (Capterra, GetApp, G2) and third-party reviews | Commercial pricing and feature claims — **not verified against vendors**; figures conflict between directories | Low–Medium |
| Vendor websites | Where cited | Medium |

Nothing here was installed, run or connected to farm data (brief §8). This is desk research.

## 2. Licensing primer (for non-lawyers; not legal advice)

| Licence | Can we use it internally? | Can we modify it? | What it obliges |
|---------|---------------------------|-------------------|-----------------|
| **Apache-2.0 / MIT / BSD** (permissive) | Yes | Yes | Keep copyright notices; Apache also requires stating changes. Proprietary KK Farm code can include it. |
| **LGPL-2.1 / 3.0** (weak copyleft) | Yes | Yes | If we modify the *library itself* and distribute it, share those modifications. Linking from our own code is fine. |
| **GPL-2.0 / 3.0** (strong copyleft) | Yes | Yes | **If we distribute** a modified or derived program (including shipping an APK to staff phones), we must give recipients the full source under GPL. Running a modified GPL *web application* on our own server for our own staff is generally **not** distribution, so source need not be published — but any Android build derived from GPL code is. |
| **AGPL-3.0** (network copyleft) | Yes | Yes | Even running a modified version as a web service triggers the obligation to offer source to users. None of the main candidates below use AGPL. |
| **No licence file** | **No.** Default copyright = all rights reserved. Reading for ideas is fine; copying code is not. | — | — |

Practical rule for KK Farm: **permissive and LGPL components are safe to embed; GPL platforms are safe to *run* internally but would make any derived mobile app GPL; unlicensed repositories are off-limits for code reuse.** A lawyer should confirm before any GPL fork is distributed.

## 3. Open-source platforms and repositories

### 3.1 Verified repository metadata (GitHub API, 2026-11-07)

| Repository | Licence | Language | Stars | Last push | Archived | What it is |
|------------|---------|----------|------:|-----------|----------|------------|
| `farmOS/farmOS` | **GPL-2.0** | PHP (Drupal) | 1,385 | 2026-11-05 | No | Web-based farm record keeping; generic assets/logs incl. Animal asset type |
| `farmOS/field-kit` | GPL-3.0 | JavaScript | 69 | **2024-04-07** | No | Offline-first companion app to farmOS (PWA) — low maintenance |
| `Farmer-Eds-Shed/farmOS-Livestock-Modules` | GPL-3.0 | PHP | 0 | 2022-04-14 | No | Community add-on: external parents/AI sires, sale/purchase/death logs, cattle flags |
| `LiteFarmOrg/LiteFarm` | **GPL-3.0** | JavaScript | 252 | 2026-11-06 | No | Not-for-profit farm platform; crop-centric; animal features not confirmed in README |
| `usetania/tania-core` | **Apache-2.0** | Go | 824 | 2026-03-03 | No | Smallholder farm management — **crops only**, no livestock |
| `adewg/ICAR` | **Apache-2.0** | Spec (OpenAPI/JSON Schema) | 75 | 2026-11-03 | No | **ICAR Animal Data Exchange (ADE)** standard — data types and APIs for livestock records |
| `OogieM/LambTrackerMobile` | GPL-2.0 | Java (Android) | 8 | 2022-04-26 | No | Sheep flock management; **EID + visual tag** dual identification; SQLite; development moved to GitLab in 2017 |
| `k2288/cattle` | LGPL-2.1 | Dart (Flutter) | 14 | 2021-06-22 | No | Cattle management app |
| `SolangeD/GENMON` | GPL-3.0 | PHP | 3 | 2020-08-28 | No | Web platform for livestock management (research) |
| `woodbri/holistic-herd-management` | LGPL-3.0 | JavaScript + PostgreSQL | 1 | 2019-05-01 | No | Herd rotation / grazing planning |
| `zuhebahmed88091/livestock_management` | **none** | Laravel | 11 | 2022-09-12 | No | Student/portfolio project — **cannot reuse code** |
| `BisRyy/EarlyVet` | **none** | TypeScript | 9 | 2025-07-29 | No | Microservice livestock health + ML prototype — **cannot reuse code** |
| Assorted "goat farm" repos (`GoatFarmManager`, `Goatbook`, `farmhub-africa`, …) | mostly none / MIT | PHP, Python | 0–3 | 2018–2026 | — | Tiny or unlicensed; idea value only |

GitHub search found **no** mature, maintained, open-source project specific to goat breeding (pedigree + breeding + veterinary + feeding + finance). The space is dominated by generic farm platforms (farmOS, LiteFarm) and small personal projects.

### 3.2 farmOS — the only serious "adopt" candidate

**What it offers that maps to KK Farm**

| farmOS concept | KK Farm need | Fit |
|----------------|--------------|-----|
| Animal asset (birthdate, sex, castrated flag, nicknames, species/breed taxonomy) | AM-5…AM-8 | Good baseline |
| Asset ID tags (type + value + location) | RFID assignment history (AM-2) | Partial — tags are fields on the asset, not a first-class assignment history with reasons |
| Group assets + movement logs | Sheds/pens, transfers (FM-1, FM-2) | Good |
| Logs (observation, medical, harvest, input…) with quantities | Weight, observations, treatments | Generic; workflow and validation must be built |
| Birth log (v1) / community modules | Kidding → kid registration | Partial, v1-era |
| Roles & permissions (Drupal) | RBAC | Good, but vet-only hard gates are custom |
| JSON:API, OAuth2 | Mobile app integration | Good |
| Field Kit PWA | Offline mobile | **Stale** (last push 2024-04); Android app "not receiving regular updates" per its own docs |

**What is missing or weak for KK Farm:** pedigree trees and breeding cycle (heat → mating → pregnancy check → kidding) as a workflow; veterinary accountability (diagnosis/treatment restricted to vets, withdrawal periods); feeding-plan approval; finance/ledger/lifetime cost; low-literacy, scan-first mobile UX; Urdu; native RFID reader integration; the advisory intelligence layer. Each would be a custom Drupal module.

**Licence consequence:** GPL-2.0. Running a customised farmOS on KK Farm's own server is fine without publishing source. A *custom Android app* that merely talks to farmOS's API is **not** derived from farmOS and can stay proprietary. Only a fork of Field Kit (GPL-3.0) would be copyleft.

**Verdict:** Technically possible, strategically poor fit. KK Farm's differentiators (breeding quality, veterinary accountability, finance) are exactly the parts farmOS does not have, so most effort would still be custom — on a Drupal stack the team would also have to learn. **Recommended: do not adopt as the platform; borrow its data-model ideas** (asset / log / quantity / movement, ID-tag typing, group assets).

### 3.3 ICAR Animal Data Exchange (ADE) — adopt as a vocabulary and interchange reference

- Apache-2.0, actively maintained (pushed 2026-11-03), produced by the International Committee for Animal Recording.
- Defines JSON Schema data types and OpenAPI resources for animals, identifiers, breeds, arrivals/departures, parturition (kidding), reproduction events, weights, treatments/diagnoses, locations.
- **Reuse plan:** align KK Farm's entity and field naming with ADE where sensible (e.g. `animal`, `identifier scheme`, `parturition`, `reproduction event`, `withdrawal`), and keep an ADE-compatible export in mind for future regulatory or breed-registry exchange. No obligation to implement the full API.

### 3.4 LambTrackerMobile — borrow ideas only

A working shepherd's Android app built around **EID + visual tag dual identification**, SQLite on device, and modules added per seasonal task (lambing, weighing, shearing). Code is GPL-2.0, Java, last pushed 2022 and migrated to GitLab in 2017 — too old to reuse. Its *design* validates KK Farm's assumptions: scan-first, offline device database, farm number alongside EID, task-shaped modules.

### 3.5 Others

- **LiteFarm** (GPL-3.0, active): crop- and sustainability-focused; animal management is not confirmed in its README. Worth a 30-minute look only if the team later wants a reference for a modern React/Node farm UI.
- **Tania** (Apache-2.0): permissive licence but **no livestock support**; irrelevant to goats.
- **GENMON / holistic-herd-management / k2288/cattle**: dormant (2019–2021). No reuse.
- **Unlicensed student repos**: do not copy code. Ideas only.

## 4. Commercial platforms (benchmark, not reuse)

> A verified, feature-by-feature benchmark of the owner's five-product shortlist (Throf, Farmbrite, UNIFORM-Agri Goat, PeakHerds, UBIQ) against every KK Farm requirement — including the gaps none of them address — is in [COMPETITOR_BENCHMARK.md](COMPETITOR_BENCHMARK.md).

Prices are from directories and reviews as of 2026 and **conflict between sources**; treat as indicative only. None publishes an Urdu UI, PKR pricing or Pakistan data residency; none is open source; none offers code reuse. Their value to KK Farm is as a **feature and UX benchmark**.

| Platform | Species focus | Goat-relevant features reported | Offline | EID/RFID reader | Pricing (indicative) | Reuse feasibility |
|----------|---------------|---------------------------------|---------|-----------------|----------------------|-------------------|
| **EasyKeeper** | Goats (dairy/meat), sheep | Weight history, scheduled weighing, **ADG incl. offspring ADG per sire/dam**, estrus tracking, gestation calc, kidding schedule, pedigree propagation, health/vaccination records | Not stated | Not stated | ~$19 (Essentials) – $27 (Performance) /month per directories; vendor page says "contact vendor" | None (SaaS). **Best feature benchmark** for breeding + ADG |
| **FarmKeep** | Multi-species incl. goats | Heat cycles, breeding dates, gestation, kidding, pedigree charts | Not stated | Not stated | ~$9.99/mo or $95.99/yr, free tier (vendor-published) | None; web/desktop "launching soon" per vendor |
| **Farmbrite** | Multi-species | General livestock + farm finance | Not stated | Not stated | ~$29/user/month (Capterra) | None |
| **Herdwatch** | Cattle, sheep (UK/IE) | Compliance, medicine book with withdrawal, weights, breeding | **Yes** (sync later) | **Bluetooth EID readers & scale heads** | Quote-based; promo tiers from ~£79/6 months | None. Benchmark for **medicine/withdrawal + EID UX** |
| **AgriWebb** | Cattle, sheep (AU/UK/US) | Mobs, pasture, weights, treatments | Yes | Reportedly no direct EID integration (third-party claim) | Scales with herd size; enterprise quote | None |
| **HerdBoss** | Sheep, goats, cattle | EID scanning, offline capture, auto-sync | **Yes** | **Yes (EID/RFID)** | Free (closed source) | None. Benchmark for **free-tier field UX** |
| **iLivestock** | Sheep, cattle (UK) | Field recording, movements, medicines | **Yes** | Not confirmed | Not found | None |

Observations for KK Farm's design:
1. The goat-specific products (EasyKeeper, FarmKeep) compete on **breeding and ADG analytics** — exactly KK Farm's "quality not quantity" goal. Our breeding and weight modules should at least match: offspring ADG by sire/dam, gestation-based kidding calendar, pedigree propagation.
2. The products that serve real shed work (Herdwatch, HerdBoss) all have **offline capture + Bluetooth EID**. This supports the `[ASSUMED]` offline requirement (Q-FM-3) and the hardware-agnostic scan interface.
3. **Medicine book with withdrawal periods** is standard in regulated markets — supports VT-10 `[ASSUMED]`.
4. None is built for low-literacy, non-English users on shared devices — KK Farm's UX requirement is genuinely unmet by the market.
5. Subscription pricing per user/head would be an ongoing foreign-currency cost with no control over data location — a further argument for a custom build.

## 5. Feature benchmark against KK Farm requirements

Legend: ● present · ◐ partial / generic · ○ absent · ? unknown

| Requirement area | farmOS | EasyKeeper | Herdwatch | HerdBoss | KK Farm target |
|------------------|:------:|:----------:|:---------:|:--------:|:--------------:|
| Permanent animal ID separate from tag, tag history | ◐ | ? | ◐ | ◐ | ● (core rule) |
| Pedigree, multi-generation | ○ | ● | ◐ | ? | ● |
| Breeding cycle (heat → mating → preg check → kidding) | ◐ | ● | ◐ | ◐ | ● |
| Weight + ADG + peer comparison | ◐ | ● | ● | ◐ | ● |
| Veterinary exam / diagnosis / treatment with vet-only authorship | ◐ | ◐ | ◐ | ○ | ● |
| Withdrawal periods | ○ | ? | ● | ? | ● (assumed) |
| Group feeding plans with approval | ○ | ○ | ○ | ○ | ● |
| Tasks / compliance (feeding, cleaning) | ◐ | ○ | ◐ | ○ | ● |
| Finance: expenses, lifetime cost per animal, shed-wise | ○ | ○ | ◐ | ○ | ● |
| Audit trail | ◐ (revisions) | ? | ? | ? | ● |
| Offline mobile | ◐ (stale) | ? | ● | ● | ● (if Q-FM-3) |
| RFID/EID reader integration | ○ (manual tag fields) | ? | ● | ● | ● |
| Urdu / low-literacy UX | ○ | ○ | ○ | ○ | ● |
| Advisory intelligence with vet guard-rails | ○ | ○ | ◐ | ○ | ● |

## 6. Reuse feasibility summary

| Candidate | Decision | How |
|-----------|----------|-----|
| **ICAR ADE** (Apache-2.0) | **Adopt as reference** | Align naming/vocabulary; plan an ADE-compatible export later |
| **farmOS** (GPL-2.0) | **Borrow ideas; do not adopt** | Asset/log/quantity/movement model, ID-tag typing, group assets inform DOMAIN_MODEL; no code dependency |
| **LambTrackerMobile** (GPL-2.0, 2022) | **Borrow ideas** | EID + visual dual ID, offline SQLite, task-shaped modules |
| **EasyKeeper / Herdwatch / HerdBoss** (SaaS) | **Benchmark** | Feature parity list above; optionally trial during discovery to study UX (CEO decision, cost ~$20–30/month) |
| **Tania, LiteFarm** | **No** | Crop-focused |
| **Unlicensed repos** | **No code reuse** | Ideas only |
| Permissive libraries (UI kits, RFID plugins, charting) | **Case by case** | Licence check on every dependency when coding starts |

**Proposed decision D-016:** Build KK Farm as a custom application on the stack chosen in D-011; reuse open standards (ICAR ADE, ISO 11784/11785) and permissive libraries; do not fork a GPL platform. Rationale: the differentiating requirements (breeding quality, vet accountability, approval workflows, finance, low-literacy Urdu UX, RFID) are absent from every candidate, so adoption saves little and adds a foreign stack and licence constraints. Recorded as *Proposed* in [DECISIONS_LOG.md](../DECISIONS_LOG.md) pending CEO review.

## 7. Questions this raises

| ID | Question | For |
|----|----------|-----|
| Q-BC-2 | Should KK Farm subscribe to a trial of one goat-specific SaaS (e.g. EasyKeeper) for a month purely to study its breeding/ADG UX before design? | CEO |
| Q-BC-3 | Is future data exchange with a breed registry, provincial system (PAITS) or buyer required? If yes, ICAR ADE alignment moves from "nice" to "must". | CEO |
| Q-NFR-5 | Is a GPL dependency acceptable anywhere in the stack, or should the policy be permissive-only for anything shipped to devices? | CEO + engineering |

## 8. Sources

Verified via GitHub API on 2026-11-07: farmOS/farmOS, farmOS/field-kit, Farmer-Eds-Shed/farmOS-Livestock-Modules, LiteFarmOrg/LiteFarm, usetania/tania-core, adewg/ICAR, OogieM/LambTrackerMobile, k2288/cattle, SolangeD/GENMON, woodbri/holistic-herd-management, zuhebahmed88091/livestock_management, BisRyy/EarlyVet.

Documentation: [farmOS Animal assets (v1 guide)](https://v1.farmos.org/guide/assets/animals/) · [farmOS asset model](https://farmos.org/model/type/asset) · [farmOS Field Kit guide](https://v1.farmos.org/guide/app/) · [ICAR ADE repository](https://github.com/adewg/ICAR) · [ICAR ADE workshop deck](https://www.icar.org/wp-content/uploads/documents/ADE-Standards-Workshop-Andrew-Cooke.pdf) · [LambTrackerMobile](https://github.com/OogieM/LambTrackerMobile).

Commercial (directory/review data, unverified): [EasyKeeper on Capterra](https://www.capterra.com/p/148787/EasyKeeper/pricing/) · [EasyKeeper on GetApp](https://www.getapp.com/industries-software/a/easykeeper/) · [EasyKeeper (agtecher)](https://agtecher.com/software/easykeeper-herd-management-software) · [FarmKeep pricing guide (vendor)](https://www.farmkeep.com/farm-guides/farm-management/farm-management-software-cost) · [FarmKeep breeding features](https://www.farmkeep.com/features/livestock-breeding-software) · [Farmbrite on Capterra](https://www.capterra.com/p/136765/Farmbrite/) · [Herdwatch](https://herdwatch.com/en-uk/solutions/cattle/) · [Herdwatch review (gappsy)](https://www.gappsy.com/tools/herdwatch/) · [AgriWebb review 2026 (flypix)](https://flypix.ai/agriwebb-tool-review/) · [HerdBoss (App Store)](https://apps.apple.com/gb/app/herdboss/id982037443) · [iLivestock (App Store)](https://apps.apple.com/gb/app/ilivestock-software/id605684529) · [Self-hosted farm software guide 2026](https://www.pistack.xyz/posts/2026-06-05-self-hosted-farm-management-farmos-tania-litefarm-guide/) · [OSU goat kidding record-keeping](https://extension.okstate.edu/programs/meat-goat-production/goat-kidding-record-keeping-software).
