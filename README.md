# KK Farm — Goat Breeding & Farm Management Platform

> **Phase:** Discovery & repository foundation (no application code yet)
> **Principle:** *Quality of goats, not quantity of goats.*
> **Product principle:** KK Farm is **PyroNet Solutions' own original platform, built from scratch** — not a purchased, rebranded, white-labelled or forked product. Competitors are studied for inspiration only; frameworks are tools; we own code, schema, rules, APIs, configuration, docs, deployment and data; **development and staging budget is $0**. Full text: [docs/PROJECT_PRINCIPLES.md](docs/PROJECT_PRINCIPLES.md).

KK Farm is a professional goat breeding operation. This repository is the single source of truth for the software platform that will manage every goat through its complete lifecycle — identity, pedigree, genetics, breeding, veterinary health, nutrition, weight, finances and day-to-day farm operations — in a way that is easy to use on a mobile phone by staff with limited technical training.

## Where things stand

| Item | Status |
|------|--------|
| Repository | Created 2026-11-07, private, `main` protected by PR workflow |
| Requirements | Captured from the project brief; **not yet validated by a farm visit** |
| Excel workbook (`KK_Farms_360_Goat_Management_System.xlsx`) | **Not yet received** — analysis pending |
| Competitor review (goatmart.pk) | Site offline at time of review — see [research note](docs/research/COMPETITOR_GOATMART.md) |
| RFID hardware | Make/model unknown — see [RFID research](docs/RFID_INTEGRATION_RESEARCH.md) |
| Technology stack | **Decided 2026-11-07 (D-023):** Laravel 13 + Octane · Inertia 3 + React 19 · PostgreSQL 18 · Valkey 9 · Reverb · Horizon · imgproxy + Garage · Caddy · Docker Compose — see [TECHNOLOGY_EVALUATION.md](docs/TECHNOLOGY_EVALUATION.md). Mobile delivery and hosting still open. |
| Product direction | **Premium, real-time livestock intelligence platform** — every goat with its own digital identity, photographs, medical/breeding history and complete lifecycle record (owner, 2026-11-07) |
| Application code | None. Development does not start until farm-visit findings are reviewed and approved. |

See [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) for the live status and [OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md) for everything that still needs an answer.

## Documentation map

Read in this order if you are new:

1. [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) — what is done, what is blocked, what is next
2. [REQUIREMENTS.md](docs/REQUIREMENTS.md) — confirmed requirements vs. assumptions, clearly separated
3. [OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md) — questions for the CEO, vets and staff
4. [DOMAIN_MODEL.md](docs/DOMAIN_MODEL.md) — the "things" the system manages and how they relate
5. [ARCHITECTURE_PROPOSAL.md](docs/ARCHITECTURE_PROPOSAL.md) — proposed system shape (proposal, not decision)
6. [DATABASE_DESIGN_DRAFT.md](docs/DATABASE_DESIGN_DRAFT.md) — draft tables and history strategy
7. [SECURITY_AND_RBAC.md](docs/SECURITY_AND_RBAC.md) — roles, permissions, audit trails
8. [RFID_INTEGRATION_RESEARCH.md](docs/RFID_INTEGRATION_RESEARCH.md) — how ear tags and the Android reader could connect
9. [AI_INTELLIGENCE_DESIGN.md](docs/AI_INTELLIGENCE_DESIGN.md) — advisory intelligence layer, guard-rails
10. [IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md) — recommended phases
11. [DECISIONS_LOG.md](docs/DECISIONS_LOG.md) — decisions taken, with reasons
11a. [TEAM_WORKFLOW.md](docs/TEAM_WORKFLOW.md) · [TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md) · [CI_PIPELINE_PROPOSAL.md](docs/CI_PIPELINE_PROPOSAL.md) — how the team works, tests and validates PRs
11b. [TECHNOLOGY_EVALUATION.md](docs/TECHNOLOGY_EVALUATION.md) — two stacks compared with verified latest-stable versions; recommendation (proposed)
11d. [STAGING_ENVIRONMENT.md](docs/STAGING_ENVIRONMENT.md) — mandatory live-staging acceptance milestone; paid-hosting evaluation kept as reference only; **budget $0 — free options under research (D-033)**; staging deferred if nothing free is reliable
0. [PROJECT_PRINCIPLES.md](docs/PROJECT_PRINCIPLES.md) · [DEPENDENCIES_AND_LICENSES.md](docs/DEPENDENCIES_AND_LICENSES.md) — fundamental principles (original product, ownership, $0 budget) and the dependency/licence register
11c. [PERFORMANCE_ACCEPTANCE_CRITERIA.md](docs/PERFORMANCE_ACCEPTANCE_CRITERIA.md) · [REALTIME_ARCHITECTURE.md](docs/REALTIME_ARCHITECTURE.md) · [MEDIA_AND_PHOTOS.md](docs/MEDIA_AND_PHOTOS.md) · [SHARED_VM_ARCHITECTURE.md](docs/SHARED_VM_ARCHITECTURE.md) — speed targets, live updates, goat photographs, shared-VM isolation
12. [docs/research/](docs/research/) — competitor and workbook analysis, the [platform & repository comparison](docs/research/PLATFORM_COMPARISON.md) (licensing and reuse feasibility) and the [five-product competitor benchmark](docs/research/COMPETITOR_BENCHMARK.md) (feature matrix and the gaps KK Farm must own)
13. [docs/farm-visit/](docs/farm-visit/) — **On-Site Discovery Pack**: [field guide](docs/farm-visit/FARM_VISIT_FIELD_GUIDE.md) · [blank data-capture templates](docs/farm-visit/FARM_DATA_CAPTURE_TEMPLATES.md) · [RFID hardware inspection](docs/farm-visit/RFID_HARDWARE_INSPECTION.md) · [workflow interviews & observation](docs/farm-visit/FARM_WORKFLOW_DISCOVERY.md) · [prioritised open questions](docs/farm-visit/FARM_VISIT_OPEN_QUESTIONS.md)

## Ground rules for this phase

These come from the project brief and are **mandatory**:

- GitHub is the source of truth. All documents and code live here.
- No deployment anywhere. No production VM, no PyroNet infrastructure, no production database, no production credentials.
- No connection to live farm hardware (RFID reader, tags).
- No real employee, customer, animal or financial data in this repository — sample data only.
- All changes go through feature branches and Pull Requests.
- **No Pull Request is merged without explicit authorization from the project owner.**
- No destructive Git operations (force-push, history rewrite, branch deletion of others' work).

## Team and how we work

| Who | Role |
|-----|------|
| **Ammar** | Project Owner / CEO — final business & technical decisions, approves every merge and deployment |
| **Claude Code** | Lead Software Engineer — implementation, migrations, APIs, real-time, RFID, photos, UI, automated tests, CI configuration |
| **ChatGPT** | GitHub Engineering Manager, Independent Reviewer & QA Lead — issues/labels/milestones, independent PR review, testing strategy and quality gates |

Full workflow, approval boundaries and collaboration rules: [docs/TEAM_WORKFLOW.md](docs/TEAM_WORKFLOW.md). Testing structure: [docs/TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md). CI: [docs/CI_PIPELINE_PROPOSAL.md](docs/CI_PIPELINE_PROPOSAL.md).

```
main                      ← protected; only merged via PR authorised by Ammar
└── docs/<topic>          ← documentation branches
└── feat/<issue>-<slug>   ← feature branches (not before Phase 1 approval)
└── fix/<issue>-<slug>    ← bug fixes (always with a regression test)
```

1. Start from a GitHub issue with acceptance criteria (created/approved by ChatGPT and Ammar).
2. Branch; keep facts labelled (`[CONFIRMED]`, `[ASSUMED]`, `[UNKNOWN]`); record decisions in `docs/DECISIONS_LOG.md`.
3. Write tests with the code; push early so CI and the reviewer can see it.
4. Open a PR with the template, `Closes #N`; respond to every review finding in the thread.
5. CI green + review resolved → wait for Ammar's explicit merge authorisation.

## Glossary (for non-technical readers)

| Term | Meaning |
|------|---------|
| **Animal ID** | A permanent number the system gives each goat. Never changes, never reused — even after the goat leaves the farm. |
| **RFID tag / EPC** | The electronic ear tag and the code it transmits. Tags are physical objects: they can fall off, be replaced, or be reused on another goat. That is why the tag code is *not* the goat's identity. |
| **Sire / Dam** | Father / mother of a goat. |
| **Kidding** | A doe giving birth. Kids are the offspring. |
| **ADG** | Average Daily Gain — how much weight a goat gains per day between two weighings. |
| **RBAC** | Role-Based Access Control — who is allowed to see or do what. |
| **Audit trail** | A permanent record of who changed what, and when. Nothing financial is ever silently edited or deleted. |
