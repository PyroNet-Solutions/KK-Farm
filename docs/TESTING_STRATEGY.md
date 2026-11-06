# Testing Strategy — Structure Proposal

**Status:** Proposed by Claude (Lead Engineer) for ChatGPT (QA Lead) to own, refine and enforce. Tool versions are decided in [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md); this document fixes the *structure* and the *business rules that must be protected*, independent of stack.

## 1. Principles

1. **Tests protect business rules, not coverage numbers.** Every critical rule below has named tests; a PR touching a rule must touch its tests.
2. **Synthetic data only.** Factories and seeders generate goats, staff, sheds, expenses. Real farm data never enters a test, fixture or CI log.
3. **Evidence lives in GitHub.** Results, coverage and traces are uploaded as workflow artifacts so the QA Lead can inspect them without access to any machine.
4. **A failing test is information.** It is never skipped, weakened or deleted to go green; the cause is explained in the PR and fixed.
5. **Fast feedback first.** Unit + integration on every push; E2E, performance and security on PR-ready and nightly.

## 2. Test layers

| Layer | What it proves | Runs | Owner of code | Typical tools (final choice per stack decision) |
|-------|----------------|------|---------------|------------------------------------------------|
| **Unit** | Pure logic: ADG calculation, gestation/expected-kidding dates, permission resolution, allocation rules, rule-engine conditions | every push | Claude | Framework's native runner (Pest/PHPUnit, Vitest/Jest, pytest) |
| **Database & migration** | Migrations apply and roll back cleanly; constraints and exclusion indexes enforce invariants; seeded data survives migration | every push | Claude | Real PostgreSQL service container; migrate up → seed → migrate down → up |
| **API / integration** | Endpoints behave per contract; validation; transactions; audit rows written; events emitted | every push | Claude | HTTP test client against real DB; OpenAPI contract checks |
| **Auth & RBAC** | Every endpoint × every role matrix: allowed / forbidden / not-found; hard gates cannot be overridden | every push | Claude | Table-driven tests generated from the permission matrix |
| **Real-time** | Events reach authorised subscribers only; unauthorised channel subscription rejected; reconnection resumes without loss or duplication; ordering per animal | PR-ready | Claude | WebSocket test clients; fault injection (drop connection) |
| **RFID integration** | Scan → resolve → profile; unassigned tag flow; closed-assignment flow; duplicate reads de-duplicated; manual fallback | PR-ready | Claude | **Simulated reader** (fake scan source emitting `TagScanned`); hardware tests only on-site, never in CI |
| **Image pipeline** | Upload → validation → original stored → thumbnails/WebP generated → DB references consistent; failed upload leaves no dangling reference; photos follow the animal, not the tag | PR-ready | Claude | Object-storage emulator or temp bucket; corrupt/oversized file cases |
| **End-to-end (browser)** | Critical user journeys on mobile viewport: login/PIN, scan→profile, weigh, observe, vet exam, move shed, replace tag, kidding, feeding compliance, expense entry | PR-ready + nightly | Claude | Playwright (mobile emulation, Android Chrome profile) |
| **Mobile responsiveness / visual** | Layouts at 360×640, 390×844, tablet; no horizontal scroll; touch targets ≥ 44 px; reduced-motion respected | PR-ready | Claude | Playwright screenshots + assertions |
| **Performance & load** | Targets in [PERFORMANCE_ACCEPTANCE_CRITERIA.md](PERFORMANCE_ACCEPTANCE_CRITERIA.md): API p95, page LCP/INP on throttled mobile, real-time latency, concurrent users | nightly + before each gate | Claude | k6 (API/WebSocket), Lighthouse CI (mobile), custom real-time latency probe |
| **Security** | Dependency vulnerabilities, secret scanning, static analysis, OWASP-style checks on auth/file upload/IDOR | every PR | Claude (config) / ChatGPT (review) | Dependency review, CodeQL or equivalent, lint rules |
| **Regression** | Every fixed bug gets a test named after its issue (`regression/issue-123…`) | every push | Claude | Same runners |

## 3. Critical business rules → required tests

| # | Rule | Minimum tests |
|---|------|---------------|
| R-1 | Reassigning an RFID tag must never transfer animal history | Assign tag T to goat A; record weight/treatment; close; assign T to goat B → B has zero history; A's history intact; scan T → B; A's timeline still shows "tag removed" |
| R-2 | A goat's permanent identity is never reused | Attempt to create an animal with an existing ID → rejected; deleting/"leaving farm" never frees the ID; exported/deceased animal remains queryable |
| R-3 | Unauthorised employees must not access financial information | For every finance endpoint and the dashboard: caretaker/feeding/cleaning/vet → 403; manager → 403 unless delegated; delegated finance user → 200; revoked delegation → 403 |
| R-4 | Only authorised veterinary personnel can perform restricted veterinary actions | Create diagnosis/treatment/pregnancy-check/feeding-plan approval as non-vet → 403; as vet → 201 with `vet_id` = actor; permission override cannot grant the hard gate |
| R-5 | Concurrent updates must not corrupt animal records | Two parallel weight entries, two parallel transfers, two parallel tag assignments → both recorded or one rejected with a clear conflict; exclusion constraint violations are surfaced, never silently lost |
| R-6 | Failed image uploads must not leave broken or misleading profiles | Simulate storage failure mid-upload → no `animal_photos` row, no partial file, profile shows previous picture; retry succeeds idempotently |
| R-7 | Real-time events must respect user permissions | Subscribe as caretaker to `finance.*` → rejected; vet's exam event reaches manager and CEO, not feeding staff; private channel auth checked on every (re)connect |
| R-8 | Database migrations must preserve existing records | Seed a realistic dataset → run all pending migrations → row counts, FK integrity and sample records unchanged; rollback restores schema |
| R-9 | Photos stay attached to the animal across tag reassignment | Upload photo for goat A; reassign tag; scan new tag → correct animal and its photos; goat B shows none |
| R-10 | Append-only finance | UPDATE/DELETE on posted expense/payment → forbidden at DB and API level; correction creates reversing entry linked to original |
| R-11 | No hard delete of domain records | Every "delete" API on animals/medical/finance is absent or returns 405; soft states only |
| R-12 | Audit completeness | Every write on audited tables produces an `audit_log` row with actor, before/after |

## 4. Test data

- **Factories** for every entity with realistic defaults (breeds, sex, ages, sheds).
- **Seed scenarios**: "small farm" (120 goats, 1 shed), "expansion" (2,000 goats, 6 sheds) for performance tests.
- **Fixtures are code**, versioned in the repo; no spreadsheets.
- A `make seed:demo` (or equivalent) command for local/staging demo data — clearly labelled synthetic (names like `GOAT-DEMO-0001`).

## 5. Coverage policy

- Coverage is **reported** on every PR (artifact + summary comment) but gates are **rule-based**: the QA Lead maintains a checklist of rules R-1…R-12 and module acceptance criteria that must have passing tests.
- Indicative floor once code exists: 80 % line coverage on domain/services; UI components exempt from % but covered by E2E journeys. The QA Lead may adjust.

## 6. Environments for testing

| Env | Purpose | Data |
|-----|---------|------|
| CI (GitHub Actions) | All automated layers | Synthetic |
| Local dev | Developer runs same suites | Synthetic |
| Staging (future, needs owner approval) | E2E with real RFID reader on-site, UAT by vets/caretakers | Synthetic or anonymised only |

No test environment ever receives real farm data without Ammar's explicit written approval.

## 7. Per-module test plans (to be created by the QA Lead as issues)

Each module (Identity/RFID, Weight, Veterinary, Breeding, Feeding, Farm Ops, Finance, Real-time, Media, Intelligence) gets a `[Test plan]` issue with: acceptance criteria, rule mapping (R-x), E2E journeys, performance targets, and a regression checklist. Claude links tests to these issues in PRs.

## 8. Definition of Done (testing part)

A PR is testing-complete when:
- [ ] All required CI checks pass on GitHub.
- [ ] New/changed behaviour has unit + integration tests; user-facing flows have E2E coverage.
- [ ] Any touched business rule R-x has its tests updated and passing.
- [ ] A bug fix includes a regression test referencing the issue.
- [ ] Coverage and test artifacts are attached to the workflow run.
- [ ] The QA Lead's review comments are resolved or explicitly deferred with an issue.
