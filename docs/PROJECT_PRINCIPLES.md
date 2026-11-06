# KK Farm — Fundamental Project Principles

**Status:** Accepted — owner instruction, 2026-11-07 (D-034, D-033). These principles override any conflicting statement elsewhere in this repository and apply for the life of the project.

## P-1. An original product, built from scratch

KK Farm Livestock Management System is **PyroNet Solutions' own original software product**, developed from scratch. We are **not** purchasing, reselling, rebranding, white-labelling, forking or modifying any existing livestock-management application.

We build and own:

| Layer | Ours |
|-------|------|
| Frontend & user experience | ✔ |
| Backend & business logic | ✔ |
| Database schema & data relationships | ✔ |
| Animal registration & permanent identification | ✔ |
| RFID integration layer | ✔ |
| Breeding & pedigree management | ✔ |
| Veterinary & health management | ✔ |
| Feeding & nutrition management | ✔ |
| Employee & operational management | ✔ |
| Financial & inventory modules | ✔ |
| Dashboards, reports & AI-assisted intelligence | ✔ |

Every module is designed around **KK Farm's actual requirements**, validated on site — not around what another product happens to do.

## P-2. Competitor research is inspiration only

Throf, Farmbrite, UNIFORM-Agri, PeakHerds, UBIQ, farmOS, EasyKeeper and any other product are **research references**. We study their features, workflows, user experience, operational processes, strengths, weaknesses and missing capabilities to write a *better specification* ([research/COMPETITOR_BENCHMARK.md](research/COMPETITOR_BENCHMARK.md), [research/PLATFORM_COMPARISON.md](research/PLATFORM_COMPARISON.md)).

We do **not** copy their proprietary source code, designs, screens, branding, icons, copy or any copyrighted asset. KK Farm has its own identity, workflows, architecture and implementation.

## P-3. Frameworks and libraries are tools, not the product

We use established open-source **building tools** — Laravel, React, Inertia, PostgreSQL, Valkey, open-source UI libraries, standard authentication and security packages, infrastructure components (see [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md)). They are dependencies, not finished applications we rebrand.

Rules:
- Every third-party dependency is recorded with its **licence and security considerations** in [DEPENDENCIES_AND_LICENSES.md](DEPENDENCIES_AND_LICENSES.md) (started now; completed as code is written).
- Permissive and LGPL components may be embedded; copyleft (GPL/AGPL) components are **not** embedded in anything we distribute (the GPL policy question Q-NFR-5 is answered conservatively by this principle); unlicensed code is never copied.
- Dependencies are kept current and scanned (Dependabot, dependency review — see [CI_PIPELINE_PROPOSAL.md](CI_PIPELINE_PROPOSAL.md)).

## P-4. Complete ownership and portability

The following remain under PyroNet Solutions' control at all times:

- GitHub source code (the single source of truth).
- Database design and migrations.
- Business rules.
- API contracts (documented in the repository, e.g. OpenAPI).
- Application configuration (environment-driven, never provider-specific in code).
- Documentation.
- Deployment process (reproducible from the repository).
- Data export and backup procedures (full export in open formats; restore drills).

**Avoid vendor lock-in:** the application must run unchanged on any hosting provider and on our own VM ([SHARED_VM_ARCHITECTURE.md](SHARED_VM_ARCHITECTURE.md) §4). Provider-specific services are used only behind standard interfaces (S3 API, Redis protocol, SMTP, PostgreSQL wire protocol).

## P-5. Zero-budget development and staging

The current development **and** staging infrastructure budget is **strictly $0** (D-032 withdrawn, D-033):

- No software purchases, no hosting subscriptions, no paid domains, no paid services, no paid trials.
- No credit card or payment method on file anywhere for this project.
- No account creation or resource provisioning that **could** generate charges — even "free tiers" that require a card are excluded.
- Development collaboration happens on GitHub. Free hosting options are researched separately ([STAGING_ENVIRONMENT.md](STAGING_ENVIRONMENT.md) §6b).
- A live staging URL remains a requirement, **but** if a reliable complete staging environment cannot be provided free of charge, the limitation is documented and staging deployment is deferred — charges are never created to meet it.
- No previous approval may be interpreted as permission to spend money. Any provisioning, including free, waits for the owner's explicit approval.

## P-6. Discovery before development

We are in discovery and architecture preparation. Application development does **not** start before:

1. the farm visit and operational validation ([farm-visit/](farm-visit/)),
2. the Excel workbook analysis,
3. the handwritten register inspection,
4. employee workflow discovery,
5. the RFID reader inspection,
6. business-requirements approval by the owner (gate **G0**).

Everything until then prepares a **genuine greenfield implementation**: validated requirements, domain model, architecture, test strategy, CI design.

## P-7. Designed for KK Farm first, built to grow

The architecture serves KK Farm first (118 goats, one shed) but must support **future farms and commercial SaaS expansion** without redesign: tenant-ready data model (`farm_id` on top-level entities), configuration-driven deployment, separated modules, documented APIs, no single-farm assumptions in core logic. Multi-tenancy itself is not built until the business asks for it (see [DATABASE_DESIGN_DRAFT.md](DATABASE_DESIGN_DRAFT.md) §12).

## Final principle

> We are not building another company's farm-management software. We are creating PyroNet Solutions' own livestock-management platform, designed around KK Farm first, with the architecture to support future farms and commercial SaaS expansion.

Every PR, decision and design document in this repository is expected to be consistent with P-1 … P-7.
