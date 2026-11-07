# GitHub Actions & CI Pipeline — Proposal

**Status:** Proposed (D-018). Workflow *code* is Claude's responsibility; quality gates and required-check policy are the QA Lead's. Exact commands depend on the stack chosen in [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md); the job structure below is stack-agnostic and will be implemented as soon as the first code lands.

## 1. Goals

- Every PR is validated automatically; the QA Lead and owner can judge a PR from GitHub alone.
- Fast feedback (< 10 min for the core PR check), thorough nightly runs.
- Synthetic data only; no secrets in logs; no access to farm infrastructure.
- Evidence (coverage, traces, performance summaries) published as artifacts.

## 2. Workflow layout

```
.github/
├── workflows/
│   ├── pr-validate.yml      # required — lint, typecheck, unit, migration, integration, build
│   ├── e2e.yml              # required on PR-ready — Playwright critical journeys (mobile)
│   ├── security.yml         # required — dependency review, secret scan, static analysis
│   ├── perf-nightly.yml     # scheduled — k6 load + Lighthouse CI mobile + real-time latency probe
│   ├── docs-lint.yml        # docs-only PRs — markdown lint + link check
│   ├── deploy-staging.yml   # manual/tag — deploys to GitHub Environment "staging"; waits for Ammar's approval
│   └── release-readiness.yml# manual — assembles QA report inputs for the QA Lead
├── ISSUE_TEMPLATE/          # exists
├── PULL_REQUEST_TEMPLATE.md # exists
├── CODEOWNERS               # requests review from the owner on docs/ and security-sensitive paths
└── dependabot.yml           # weekly dependency PRs, grouped, security updates immediate
```

## 3. `pr-validate.yml` (required)

| Job | Steps | Fails PR when |
|-----|-------|---------------|
| `lint` | formatter check, linter | any violation |
| `typecheck` | static types (TS / PHPStan-Psalm / mypy as applicable) | errors |
| `unit` | unit suite with coverage; upload `coverage/` artifact; post summary comment | any failure |
| `migrations` | start PostgreSQL service container → migrate up → seed → **migrate down → up** → verify seed intact (R-8) | any error or data loss |
| `integration` | API + RBAC + DB tests against service container; upload JUnit report | any failure |
| `build` | production build of web (bundle size report) and API; fail if bundle budget exceeded (see performance doc) | build error or budget breach |

Triggers: `pull_request` (all branches), `push` to `main`. Concurrency group per branch (cancel superseded runs). Caches for dependency managers.

## 4. `e2e.yml` (required when PR is marked ready)

- Builds the app, starts API + DB + object-storage emulator, runs Playwright journeys from [TESTING_STRATEGY.md](TESTING_STRATEGY.md) §2 on an Android-Chrome mobile profile.
- Uses the **simulated RFID scan source** (no hardware).
- Uploads traces, screenshots and videos of failures as artifacts.
- Sharded for speed; retries limited to 1 to expose flakiness rather than hide it.

## 5. `security.yml` (required)

- `dependency-review` on PRs (blocks known-vulnerable additions).
- Secret scanning / push protection enabled at repo level; a lint job also greps for obvious credentials in diffs.
- Static analysis (CodeQL or the stack's equivalent) on PR and weekly.
- Container/image scan if containers are introduced.

## 6. `perf-nightly.yml` (scheduled + manual)

- Seeds the "expansion" dataset (2,000 goats, 6 sheds).
- k6: API scenarios (profile load, scan resolve, timeline, dashboard) and WebSocket scenario; asserts thresholds from [PERFORMANCE_ACCEPTANCE_CRITERIA.md](PERFORMANCE_ACCEPTANCE_CRITERIA.md); uploads summary JSON.
- Lighthouse CI on key pages with mobile throttling; asserts LCP/INP/CLS budgets.
- Real-time latency probe: emit event → measure time to client receipt; asserts p95.
- Results posted to a rolling issue the QA Lead tracks.

## 6a. `deploy-staging.yml` (manual, approval-gated)

- Trigger: `workflow_dispatch` (choose a commit/tag) or a `v*-rc*` tag — never on plain push.
- Pre-condition job re-checks that `pr-validate`, `security` and `e2e` succeeded for that SHA.
- Deploy job targets the GitHub **Environment `staging`** configured with **required reviewer = Ammar** and environment-scoped secrets (provider token, demo-account passwords). The run pauses until he approves.
- Steps: build → run migrations on the staging DB → `seed:demo` (idempotent) → deploy web/worker/realtime → smoke test (`/healthz`, login page, one authenticated API call) → write commit SHA + URL to the job summary.
- PR preview environments (where the host supports them) are created by the hosting provider's GitHub integration, not by this workflow, and are destroyed on merge/close.
- There is **no `deploy-production.yml`** in this phase; production (farm VM) deployment is a separate, manual runbook with its own owner approval (D-002, STG-4).

## 7. Required checks & branch protection (owner to enable)

- `main`: require PR; require status checks `lint`, `typecheck`, `unit`, `migrations`, `integration`, `build`, `security`, and `e2e` (when ready); require conversation resolution; **no one can merge without Ammar** (enforce via required review from owner / CODEOWNERS + "Restrict who can push").
- No force-push; no branch deletion on `main`.
- Failing required checks are never bypassed with admin override.

## 8. Rules of conduct for CI

- Never `continue-on-error`, skip, `xit`, or lower thresholds to pass. Explain and fix.
- Flaky test → quarantine label + issue within 24 h, fix within the sprint; a quarantined test still runs and reports.
- Secrets only via GitHub Encrypted Secrets; masked in logs; never printed. CI needs **no** farm or production secrets at all.
- Workflow changes are reviewed like code (ChatGPT reviews `.github/**`).

## 9. Artifacts the QA Lead can rely on

| Artifact | Produced by | Retention |
|----------|-------------|-----------|
| `coverage-report` (HTML + lcov) | `unit`, `integration` | 30 days |
| `junit-*.xml` | all test jobs | 30 days |
| `playwright-report`, traces | `e2e` | 14 days |
| `k6-summary.json`, `lighthouse-*.html` | `perf-nightly` | 90 days |
| `bundle-stats.json` | `build` | 30 days |

## 10. Skeleton (illustrative; commands filled in after the stack decision)

```yaml
name: pr-validate
on:
  pull_request:
  push:
    branches: [main]
concurrency:
  group: pr-${{ github.ref }}
  cancel-in-progress: true
jobs:
  lint:       { runs-on: ubuntu-latest, steps: [ {uses: actions/checkout@v4}, {run: "<lint command>"} ] }
  typecheck:  { runs-on: ubuntu-latest, steps: [ {uses: actions/checkout@v4}, {run: "<typecheck command>"} ] }
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: "<unit tests with coverage>"
      - uses: actions/upload-artifact@v4
        with: { name: coverage-report, path: coverage/ }
  migrations:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:<version from TECHNOLOGY_EVALUATION>
        env: { POSTGRES_PASSWORD: ci, POSTGRES_DB: kkfarm_test }
        options: >-
          --health-cmd "pg_isready" --health-interval 5s --health-timeout 5s --health-retries 10
    steps:
      - uses: actions/checkout@v4
      - run: "<migrate up> && <seed> && <migrate down> && <migrate up> && <verify seed>"
  integration: { needs: [migrations], runs-on: ubuntu-latest, steps: [ "<...>" ] }
  build:       { runs-on: ubuntu-latest, steps: [ "<build + bundle budget check>" ] }
```

Action versions (`checkout@v4`, `upload-artifact@v4`, etc.) will be pinned to the latest stable at implementation time and kept current by Dependabot.
