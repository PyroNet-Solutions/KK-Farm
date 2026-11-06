# Project Status

**Last updated:** 2026-11-07
**Phase:** 0 — Discovery & repository foundation
**Next milestone:** Farm visit → requirements review → stack decision → approval to start Phase 1

## Summary for stakeholders

The repository exists and the discovery documentation set is in place. Requirements from the project brief have been captured and separated into *confirmed*, *assumed* and *unknown*. The system shape (architecture, data model, roles, RFID approach, AI guard-rails, roadmap) has been **proposed** so that it can be challenged during and after the farm visit. No software has been built, and none should be until the farm-visit findings are approved.

## Done

- [x] Private repository `PyroNet-Solutions/KK-Farm` created (2026-11-07)
- [x] Documentation structure established (`docs/`, `docs/research/`, `docs/decisions/`)
- [x] Project brief analysed; requirements captured in [REQUIREMENTS.md](REQUIREMENTS.md)
- [x] Open questions catalogued in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md)
- [x] Domain model, architecture proposal, database draft, security/RBAC, RFID research, AI design, roadmap, decisions log drafted
- [x] Issue and PR templates added

## In progress / blocked

| Item | Status | Blocker | Owner |
|------|--------|---------|-------|
| Excel workbook analysis | **Blocked** | `KK_Farms_360_Goat_Management_System.xlsx` has not been supplied to the engineering side. Placeholder at [research/EXCEL_WORKBOOK_ANALYSIS.md](research/EXCEL_WORKBOOK_ANALYSIS.md). | CEO / project owner to share the file |
| Competitor review (goatmart.pk) | **Partially blocked** | Site returned "deployment paused" on 2026-11-07 and has no web archive. | Re-check later; or CEO to share screenshots / app name |
| RFID hardware capability | **Blocked** | Reader make/model and SDK unknown until inspected. | Farm visit |
| Technology stack decision | **Open** | Depends on CEO preference, hosting constraints and RFID SDK platform. | CEO + engineering |

## Not started (by design)

- Application code, database, CI/CD, deployment — **waits for approval after the farm visit**.

## Next steps

1. Share the Excel workbook → complete workbook analysis → update domain model and open questions.
2. Farm visit: use [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) as the interview checklist. Inspect the RFID reader (photograph the label, note model, OS version, any vendor app).
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
