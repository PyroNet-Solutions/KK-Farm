# Project Status

**Last updated:** 2026-11-07
**Phase:** 0 — Discovery & repository foundation
**Next milestone:** Farm visit → requirements review → stack decision → approval to start Phase 1

## How to review (owner direction 2026-11-07)

Everything is reviewed **through GitHub** — see [GITHUB_REVIEW_GUIDE.md](GITHUB_REVIEW_GUIDE.md) for direct links to every PR, branch, issue and document. Live application testing is a **future milestone** subject to a genuinely free hosting solution; budget is **$0**.

## Summary for stakeholders

The repository exists and the discovery documentation set is in place. Requirements from the project brief have been captured and separated into *confirmed*, *assumed* and *unknown*. The system shape (architecture, data model, roles, RFID approach, AI guard-rails, roadmap) has been **proposed** so that it can be challenged during and after the farm visit. No software has been built, and none should be until the farm-visit findings are approved.

## Done

- [x] Private repository `PyroNet-Solutions/KK-Farm` created (2026-11-07)
- [x] Documentation structure established (`docs/`, `docs/research/`, `docs/decisions/`)
- [x] Project brief analysed; requirements captured in [REQUIREMENTS.md](REQUIREMENTS.md)
- [x] Open questions catalogued in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md)
- [x] Domain model, architecture proposal, database draft, security/RBAC, RFID research, AI design, roadmap, decisions log drafted
- [x] Issue and PR templates added
- [x] Platform & repository comparison with licensing and reuse feasibility — [research/PLATFORM_COMPARISON.md](research/PLATFORM_COMPARISON.md) (proposes D-016: custom build, reuse open standards, no GPL fork)
- [x] Team workflow and approval boundaries recorded — [TEAM_WORKFLOW.md](TEAM_WORKFLOW.md) (D-017): Ammar decides/merges, Claude implements code + tests + CI, ChatGPT is independent GitHub manager, reviewer and QA lead
- [x] Testing structure and CI pipeline proposed for the QA Lead to own — [TESTING_STRATEGY.md](TESTING_STRATEGY.md), [CI_PIPELINE_PROPOSAL.md](CI_PIPELINE_PROPOSAL.md) (D-018, Proposed)
- [x] Technology evaluation with verified latest-stable versions and two compared stacks — [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md) (D-023…D-030, Proposed)
- [x] Performance acceptance criteria — [PERFORMANCE_ACCEPTANCE_CRITERIA.md](PERFORMANCE_ACCEPTANCE_CRITERIA.md) (D-022)
- [x] Live staging environment requirement recorded (D-031) with a Laravel Cloud vs Railway evaluation (reference only). **Paid hosting approval withdrawn the same day — budget is $0 (D-032 Rejected, D-033).** Free-hosting research in progress; staging may be deferred if nothing free can run the complete app — [STAGING_ENVIRONMENT.md](STAGING_ENVIRONMENT.md) §6b. Nothing provisioned.
- [x] **GitHub-first review strategy recorded (D-035)** — [GITHUB_REVIEW_GUIDE.md](GITHUB_REVIEW_GUIDE.md) with links to every PR/branch/issue/document; screenshots policy; GitHub Pages scoped to static docs/prototypes only (availability on the private repo unconfirmed, not configured); live staging deferred as a future $0 milestone
- [x] **Fundamental project principles recorded (D-034)** — original product built from scratch, competitors for inspiration only, frameworks as tools with licences documented, complete ownership and portability, zero budget, discovery before development, SaaS-ready architecture — [PROJECT_PRINCIPLES.md](PROJECT_PRINCIPLES.md); dependency/licence register started in [DEPENDENCIES_AND_LICENSES.md](DEPENDENCIES_AND_LICENSES.md).
- [x] Verified competitor benchmark of Throf, Farmbrite, UNIFORM Goat (site blocked — unverified), PeakHerds, UBIQ vs. all KK Farm requirements, with the ten gaps none address — [research/COMPETITOR_BENCHMARK.md](research/COMPETITOR_BENCHMARK.md)
- [x] On-Site Discovery Pack for the farm visit — [farm-visit/](farm-visit/) (field guide, blank templates, RFID inspection checklist, role interviews, prioritised questions)
- [x] Real-time, media/photos and shared-VM designs — [REALTIME_ARCHITECTURE.md](REALTIME_ARCHITECTURE.md), [MEDIA_AND_PHOTOS.md](MEDIA_AND_PHOTOS.md), [SHARED_VM_ARCHITECTURE.md](SHARED_VM_ARCHITECTURE.md)

## In progress / blocked

| Item | Status | Blocker | Owner |
|------|--------|---------|-------|
| Excel workbook analysis | **Blocked** | `KK_Farms_360_Goat_Management_System.xlsx` has not been supplied to the engineering side. Placeholder at [research/EXCEL_WORKBOOK_ANALYSIS.md](research/EXCEL_WORKBOOK_ANALYSIS.md). | CEO / project owner to share the file |
| Competitor review (goatmart.pk) | **Partially blocked** | Site returned "deployment paused" on 2026-11-07 and has no web archive. | Re-check later; or CEO to share screenshots / app name |
| RFID hardware capability | **Blocked** | Reader make/model and SDK unknown until inspected. | Farm visit |
| Technology stack decision | **Decided** — Option A accepted 2026-11-07 (D-023; see [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md)) | Owner to confirm on GitHub (PR #18 / issue #3). Staging host: paid option withdrawn, free options under research (D-033). Mobile delivery (D-028) still open. Development still gated on G0. | Ammar (GitHub confirmation) |
| Premium / real-time / performance / photo requirements | **Documented, awaiting review** | Folded into REQUIREMENTS §11 and the new design docs; decisions D-019…D-030 (D-019/020/021 accepted as owner direction, the rest *Proposed*). | Ammar to review |

## Not started (by design)

- Application code, database, CI/CD, deployment — **waits for approval after the farm visit**.

## Next steps

1. Share the Excel workbook → complete workbook analysis → update domain model and open questions.
2. Farm visit: use the **On-Site Discovery Pack** in [farm-visit/](farm-visit/) — [field guide](farm-visit/FARM_VISIT_FIELD_GUIDE.md), [templates](farm-visit/FARM_DATA_CAPTURE_TEMPLATES.md), [RFID inspection](farm-visit/RFID_HARDWARE_INSPECTION.md), [interviews](farm-visit/FARM_WORKFLOW_DISCOVERY.md), [prioritised questions](farm-visit/FARM_VISIT_OPEN_QUESTIONS.md). Answers flow back into [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).
3. Review this documentation set with the CEO and veterinary staff; confirm or correct every `[ASSUMED]` item.
4. Decide the technology stack and hosting environment; record in [DECISIONS_LOG.md](DECISIONS_LOG.md).
5. Only then: authorise Phase 1 of the [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md).

## Risk watch-list (top 5)

| # | Risk | Why it matters | Mitigation |
|---|------|----------------|------------|
| 1 | RFID reader has no usable SDK / closed vendor app | Core "scan goat → open record" workflow would need a workaround | Inspect at farm visit; design reader-agnostic scan interface; keep manual ID entry and QR fallback |
| 2 | Building on unvalidated assumptions | Rework of core data model later is expensive | Everything marked `[ASSUMED]` must be confirmed before Phase 1 |
| 3 | Poor connectivity inside sheds | Mobile app must still work | Offline-first design is proposed; confirm connectivity at visit |
| 4 | Low-tech users abandon the app | System is only useful if data is entered | Scan-first UX, large buttons, local language, minimal typing; pilot with real caretakers |
| 5 | Historical data migration quality (handwritten registers, Excel) | Pedigree and medical history are only as good as the import | Dedicated migration phase with vet sign-off; never silently "fix" source data |
