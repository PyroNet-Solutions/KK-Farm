# GitHub Review Guide — how to review KK Farm progress

**Status:** Accepted strategy (D-035, owner instruction 2026-11-07). GitHub is the **primary access and review location** for all source code, documentation, architecture, issues and development progress. Live application testing is a **future milestone** (see [STAGING_ENVIRONMENT.md](STAGING_ENVIRONMENT.md) §0). Budget is **$0**: nothing in this guide requires or creates a paid resource.

Repository: **https://github.com/PyroNet-Solutions/KK-Farm** (private)

> Until the PR chain is merged, the **latest text of every document is on the chain's tip branch**, currently `docs/github-first-review`. File links below point there; after merge they resolve on `main`. This guide is updated whenever the tip changes.

## 1. Start here (three links)

| What | Link |
|------|------|
| Status — what is done, blocked, next | https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/PROJECT_STATUS.md |
| Five-minute discovery report | https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/DISCOVERY_REPORT.md |
| Fundamental principles (original product, $0 budget) | https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/PROJECT_PRINCIPLES.md |

## 2. Open pull requests (stacked — each builds on the one below; review bottom-up)

| PR | Branch | What it adds | Review link |
|----|--------|--------------|-------------|
| #20 | `docs/github-first-review` | GitHub-first review strategy, this guide (D-035) | https://github.com/PyroNet-Solutions/KK-Farm/pull/20 |
| #19 | `docs/decision-d032-staging-host` | **Withdrawal** of paid hosting approval, budget $0 (D-032 rejected, D-033), fundamental principles (D-034), dependency/licence register | https://github.com/PyroNet-Solutions/KK-Farm/pull/19 |
| #18 | `docs/decision-d023-stack` | Acceptance of technology stack Option A (D-023) | https://github.com/PyroNet-Solutions/KK-Farm/pull/18 |
| #17 | `docs/staging-environment` | Live-staging milestone requirement (D-031), paid-hosting evaluation (reference only) | https://github.com/PyroNet-Solutions/KK-Farm/pull/17 |
| #16 | `docs/competitor-benchmark` | Verified benchmark of Throf, Farmbrite, UNIFORM, PeakHerds, UBIQ; ten gaps KK Farm owns | https://github.com/PyroNet-Solutions/KK-Farm/pull/16 |
| #15 | `docs/farm-visit-discovery-pack` | On-Site Discovery Pack (field guide, templates, RFID inspection, interviews, prioritised questions) | https://github.com/PyroNet-Solutions/KK-Farm/pull/15 |
| #14 | `docs/tech-evaluation` | Technology evaluation (verified versions), performance criteria, real-time, media/photos, shared-VM designs | https://github.com/PyroNet-Solutions/KK-Farm/pull/14 |
| #13 | `docs/team-workflow` | Team workflow & approval boundaries (D-017), testing strategy, CI proposal (D-018) | https://github.com/PyroNet-Solutions/KK-Farm/pull/13 |
| #12 | `docs/platform-comparison` | Open-source/commercial platform comparison, licensing & reuse feasibility (D-016) | https://github.com/PyroNet-Solutions/KK-Farm/pull/12 |
| #11 | `docs/discovery-foundation` → `main` | The 14-document discovery set, templates, `.gitignore` | https://github.com/PyroNet-Solutions/KK-Farm/pull/11 |

All PRs: https://github.com/PyroNet-Solutions/KK-Farm/pulls · Branches: https://github.com/PyroNet-Solutions/KK-Farm/branches · Commits on the tip: https://github.com/PyroNet-Solutions/KK-Farm/commits/docs/github-first-review

**How to authorise a merge:** comment on the PR (e.g. "Approved to merge"). Nothing is merged without that comment. Merging in order #11 → #20 keeps the history linear.

## 3. Issues (questions and decisions tracked in GitHub)

| # | Topic | Link |
|---|-------|------|
| 1 | Supply the Excel workbook for analysis | https://github.com/PyroNet-Solutions/KK-Farm/issues/1 |
| 2 | RFID reader make/model/SDK and tag standard | https://github.com/PyroNet-Solutions/KK-Farm/issues/2 |
| 3 | Technology stack decision (D-011 → D-023 accepted; hosting/mobile remain) | https://github.com/PyroNet-Solutions/KK-Farm/issues/3 |
| 4 | Staff list, roles, literacy, devices | https://github.com/PyroNet-Solutions/KK-Farm/issues/4 |
| 5 | Animal numbering and goat → tag mapping | https://github.com/PyroNet-Solutions/KK-Farm/issues/5 |
| 6 | Shed connectivity / offline; pen layout | https://github.com/PyroNet-Solutions/KK-Farm/issues/6 |
| 7 | Veterinary practice questions | https://github.com/PyroNet-Solutions/KK-Farm/issues/7 |
| 8 | Feeding groups, rations, approval | https://github.com/PyroNet-Solutions/KK-Farm/issues/8 |
| 9 | Finance rules (currency, append-only, allocation, approvals) | https://github.com/PyroNet-Solutions/KK-Farm/issues/9 |
| 10 | goatmart.pk review blocked (site offline) | https://github.com/PyroNet-Solutions/KK-Farm/issues/10 |

All issues: https://github.com/PyroNet-Solutions/KK-Farm/issues

## 4. Every documentation file (tip branch)

Base URL: `https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/`

| Area | File |
|------|------|
| Entry | [README.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/README.md) |
| Principles & ownership | [docs/PROJECT_PRINCIPLES.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/PROJECT_PRINCIPLES.md) · [docs/DEPENDENCIES_AND_LICENSES.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/DEPENDENCIES_AND_LICENSES.md) |
| Status & report | [docs/PROJECT_STATUS.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/PROJECT_STATUS.md) · [docs/DISCOVERY_REPORT.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/DISCOVERY_REPORT.md) |
| Requirements & questions | [docs/REQUIREMENTS.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/REQUIREMENTS.md) · [docs/OPEN_QUESTIONS.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/OPEN_QUESTIONS.md) · [docs/DECISIONS_LOG.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/DECISIONS_LOG.md) |
| Domain & data | [docs/DOMAIN_MODEL.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/DOMAIN_MODEL.md) · [docs/DATABASE_DESIGN_DRAFT.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/DATABASE_DESIGN_DRAFT.md) |
| Architecture & technology | [docs/ARCHITECTURE_PROPOSAL.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/ARCHITECTURE_PROPOSAL.md) · [docs/TECHNOLOGY_EVALUATION.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/TECHNOLOGY_EVALUATION.md) · [docs/PERFORMANCE_ACCEPTANCE_CRITERIA.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/PERFORMANCE_ACCEPTANCE_CRITERIA.md) · [docs/REALTIME_ARCHITECTURE.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/REALTIME_ARCHITECTURE.md) · [docs/MEDIA_AND_PHOTOS.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/MEDIA_AND_PHOTOS.md) · [docs/SHARED_VM_ARCHITECTURE.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/SHARED_VM_ARCHITECTURE.md) · [docs/STAGING_ENVIRONMENT.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/STAGING_ENVIRONMENT.md) |
| Security & intelligence | [docs/SECURITY_AND_RBAC.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/SECURITY_AND_RBAC.md) · [docs/AI_INTELLIGENCE_DESIGN.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/AI_INTELLIGENCE_DESIGN.md) · [docs/RFID_INTEGRATION_RESEARCH.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/RFID_INTEGRATION_RESEARCH.md) |
| Plan & process | [docs/IMPLEMENTATION_ROADMAP.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/IMPLEMENTATION_ROADMAP.md) · [docs/TEAM_WORKFLOW.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/TEAM_WORKFLOW.md) · [docs/TESTING_STRATEGY.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/TESTING_STRATEGY.md) · [docs/CI_PIPELINE_PROPOSAL.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/CI_PIPELINE_PROPOSAL.md) |
| Research | [docs/research/PLATFORM_COMPARISON.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/research/PLATFORM_COMPARISON.md) · [docs/research/COMPETITOR_BENCHMARK.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/research/COMPETITOR_BENCHMARK.md) · [docs/research/COMPETITOR_GOATMART.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/research/COMPETITOR_GOATMART.md) · [docs/research/EXCEL_WORKBOOK_ANALYSIS.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/research/EXCEL_WORKBOOK_ANALYSIS.md) |
| Farm visit pack | [docs/farm-visit/FARM_VISIT_FIELD_GUIDE.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/farm-visit/FARM_VISIT_FIELD_GUIDE.md) · [FARM_DATA_CAPTURE_TEMPLATES.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/farm-visit/FARM_DATA_CAPTURE_TEMPLATES.md) · [RFID_HARDWARE_INSPECTION.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/farm-visit/RFID_HARDWARE_INSPECTION.md) · [FARM_WORKFLOW_DISCOVERY.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/farm-visit/FARM_WORKFLOW_DISCOVERY.md) · [FARM_VISIT_OPEN_QUESTIONS.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/docs/farm-visit/FARM_VISIT_OPEN_QUESTIONS.md) |
| Templates | [.github/PULL_REQUEST_TEMPLATE.md](https://github.com/PyroNet-Solutions/KK-Farm/blob/docs/github-first-review/.github/PULL_REQUEST_TEMPLATE.md) · [.github/ISSUE_TEMPLATE/](https://github.com/PyroNet-Solutions/KK-Farm/tree/docs/github-first-review/.github/ISSUE_TEMPLATE) |

## 5. Screenshots and visual previews (policy)

- Stored in the repository under `docs/assets/<topic>/` (PNG/WebP, ≤ 500 kB each; SVG for diagrams) and embedded in the relevant document, so a reviewer sees them inline on GitHub without any external service.
- **Synthetic content only** — never real animal, employee or financial data; demo names like `DEMO-0001`.
- Mermaid diagrams render natively in GitHub Markdown (already used in `DOMAIN_MODEL.md`), so architecture/flow diagrams need no image at all.
- When UI exists: each UI PR includes before/after screenshots of the changed screens on a mobile viewport; E2E runs upload Playwright screenshots/traces as workflow artifacts (see `CI_PIPELINE_PROPOSAL.md`), downloadable from the Actions tab.
- Short screen recordings (GIF/WebM ≤ 5 MB) are allowed for interaction demos; longer ones are linked as workflow artifacts rather than committed.

## 6. GitHub Pages — scope and limits

- **Purpose, if used:** a static, read-only rendering of the documentation and, later, click-through **frontend prototypes** (static HTML/JS with mock data). It is **never** the application: no backend, database, authentication, real-time, uploads or RFID. Any Pages site will carry a banner saying so.
- **Availability on this repository is not confirmed.** The repository is private and Pages is currently disabled (`has_pages: false`). GitHub offers Pages for private repositories only on paid plans; on a free plan it is available only for public repositories. The organisation's plan could not be read with the current token scope. Therefore Pages is **not configured**; enabling it would require either confirming the org already has a plan that includes it (no new cost) or making the repository public — **both are owner decisions** (Q-STG-6). No paid plan will be purchased for this.
- If enabled later, publishing uses the free, built-in GitHub Actions Pages workflow from a `docs-site/` folder; no third-party service.

## 7. Review cadence

- Ammar reviews through PR links; comments "Approved to merge" when satisfied; asks questions on the PR or issue.
- ChatGPT (QA Lead) reviews each PR independently and maintains issues/labels; findings are answered in the thread by Claude.
- `PROJECT_STATUS.md` is updated in every PR that changes status; this guide is refreshed when PRs open/merge.
