# Live Staging Environment — Owner Testing Milestone

**Status:** Requirement accepted (D-031, owner instruction 2026-11-07); hosting choice **Proposed** (D-032). **Nothing is provisioned, no account created, no payment details entered** — per the owner's rule, paid resources, domains and payment methods require Ammar's explicit approval first.

## 1. Required outcome

Once the complete MVP is implemented and passes its automated tests, Ammar must be able to test it **online over HTTPS** (e.g. `https://kk-farm-staging.<domain>`) from a desktop browser and a mobile browser, with different roles — **before** anything is deployed to the farm's VM. The staging application is a **mandatory acceptance milestone** (gate **G-STAGE**) in the roadmap; the farm VM is never deployed automatically and staging is never treated as production.

## 2. What staging must include

| Component | Staging requirement | Design reference |
|-----------|--------------------|------------------|
| Frontend + backend | Full application build, same code as the release candidate | TECHNOLOGY_EVALUATION |
| Authentication & RBAC | All roles, permission overrides, PIN re-auth on shared devices | SECURITY_AND_RBAC |
| Database | **Separate** PostgreSQL database with synthetic demo data only; same major version as production target (18) where the host allows | DATABASE_DESIGN_DRAFT |
| Queue workers & scheduler | Horizon worker(s) + scheduler running; outbox relay, thumbnails, rule engine, notifications active | ARCHITECTURE_PROPOSAL §6 |
| Real-time | Reverb (or chosen transport) live; sub-second updates demonstrable between two logged-in devices | REALTIME_ARCHITECTURE |
| Photo & document storage | S3-compatible bucket, signed URLs, imgproxy variants | MEDIA_AND_PHOTOS |
| RFID interface | **Simulated reader mode**: a "scan" UI that emits `TagScanned` events from a demo tag list / typed code / QR; switchable to the real scan source later | RFID_INTEGRATION_RESEARCH §4 |
| Dashboards & reports | Demo dashboards with live figures; reports exportable | AI_INTELLIGENCE_DESIGN, FN |
| Observability | Error tracking + uptime check on staging so testers' failures are captured | D-026 |

## 3. Demo data and test accounts

- **Synthetic only.** Seeded by a repeatable command (`seed:demo`) that generates clearly fake data: farm numbers `DEMO-0001…`, breed names real but animals fictional, photos from a licence-free placeholder set, finance figures obviously illustrative, staff named by role (`Demo CEO`, `Demo Vet 1`). A banner on every staging page reads **"STAGING — simulated data"**.
- **Never** real employee, financial or animal data (brief §8, D-002). Seed scenarios reuse the testing-strategy datasets ("small farm" 120 goats; "expansion" 2,000 goats for performance checks).
- **Test accounts** (roles): CEO/Administrator · Veterinarian · Farm employee (caretaker) · Finance user. Optionally Farm Manager and Feeding staff to exercise every permission path.
- **Credentials handling:** usernames are documented in the repo (`ceo@demo.kkfarm.local` pattern); **passwords are never committed**. They are supplied to the seeder via platform secrets (`DEMO_CEO_PASSWORD`, …), rotated on each reseed, and shared with Ammar through a password manager or another private channel — never in GitHub, chat logs or CI output. CI masks them.
- Staging has `robots: noindex`, basic rate limiting, and optionally an access gate (HTTP basic auth or IP allow-list) in front of the login page.

## 4. Environments and deployment workflow

| Environment | Purpose | Data | Deploys | Who approves |
|-------------|---------|------|---------|--------------|
| **development** | local machines | synthetic | developer | — |
| **PR preview** (where supported) | reviewer looks at one PR | synthetic, ephemeral | automatic per PR, destroyed on merge/close | — |
| **staging** (shared) | owner & QA acceptance of the integrated MVP | synthetic demo DB | **manual promotion** after CI green **and** explicit approval | Ammar |
| **production** (farm VM) | real operations | real | **never automatic**; separate runbook, owner go-live approval | Ammar |

Separate configuration per environment (`.env.*`/platform secrets), separate databases and credentials; staging secrets never reused in production.

GitHub Actions (added to [CI_PIPELINE_PROPOSAL.md](CI_PIPELINE_PROPOSAL.md)): `deploy-staging.yml` runs **only** on `workflow_dispatch` or on a tag, after the required checks pass, and targets a GitHub **Environment `staging` with a required reviewer = Ammar**, so the deployment waits for his click. Every deployment records the commit SHA in the staging footer and in the workflow summary. Rollback = redeploy previous tag / platform rollback.

## 5. Hosting evaluation — Laravel Cloud vs Railway (verified 2026-11-07)

Evaluated for the approved-pending architecture (Laravel 13 + PostgreSQL 18 + Valkey + Reverb + Horizon + S3-compatible storage). Sources at the end; prices are published list prices on the date read.

| Criterion | **Laravel Cloud** | **Railway** |
|-----------|-------------------|-------------|
| Laravel + PostgreSQL | First-class Laravel runtime. "Serverless Postgres" (Neon-based); pricing FAQ states **PG 17**; **PG 18 not confirmed** | Laravel auto-detected (php-fpm + Caddy). Official Postgres template image tag `postgres-ssl:18` → **PG 18 available** |
| Queue workers & scheduler | Horizon as a background process on the app cluster (Starter) or a dedicated worker cluster (Growth+); scheduler toggle. Managed SQS queues exist but are **not Horizon-compatible** | Separate services from one repo: `queue:work`/Horizon worker + a looping `schedule:run` service (platform cron is ≥ 5 min and must exit) |
| WebSockets (Reverb) | **Managed Reverb clusters** (region, connection tiers from 100 connections/$5); env vars auto-injected | No Reverb documentation; run `reverb:start` as another service behind the proxy (community guidance only). Long-lived WebSockets allowed |
| Persistent object storage | S3-compatible object storage (Cloudflare R2) auto-configured as a Laravel disk; app disk is ephemeral | Persistent volumes per service + S3-compatible **Storage Buckets** ($0.015/GB-mo, private only → signed URLs) |
| HTTPS & custom domains | Free `*.laravel.cloud`; custom + wildcard domains with auto-TLS; 10 domains on Starter | Free `*.up.railway.app`; custom + wildcard with auto-TLS; Hobby: 2 custom domains per service |
| Asia region / latency | AWS **Singapore** (also Tokyo, Sydney, EU, US). From Pakistan ≈ 60–90 ms (estimate) | **Singapore** metal region (also Amsterdam, Virginia, California). Same latency class |
| Backup & recovery | Serverless Postgres with **point-in-time recovery**, configurable retention, restore to new cluster | Volume snapshots daily/weekly/monthly; Postgres **PITR via pgBackRest** to a bucket (~4-week window) |
| Deployment & rollback | Push-to-deploy, zero-downtime, **PR preview environments** (1 automation on Starter), deployment history; explicit one-click rollback **not documented** | GitHub auto-deploy, **PR environments** (auto-deleted), **one-click rollback** to a previous deployment, free builds |
| Trial / credits | First month of Starter free; $5/mo usage credit; scale-to-zero; spending limits | $5 one-time trial credit; Hobby $5/mo incl. $5 usage; Pro $20 |
| Compliance | SOC 2 Type 2, ISO 27001 | SOC 2 Type II, GDPR DPA |
| **Estimated monthly cost (staging)** | **≈ $42–54** (Starter, Singapore rates unverified — Ohio rates used) | **≈ $18–25** typical idle usage (Hobby); theoretical ceiling ≈ $136 if every container were fully busy |

### Cost arithmetic

**Laravel Cloud (Starter, always-on, 672 h/month cap):** plan $5 + app Flex 2 GiB $0.03571/h × 672 = $24.00 + Reverb 100-connection tier $5 + Postgres 0.25 CU × $0.106/CU-h × 672 = $17.81 + Postgres storage 1 GB $0.50 + Valkey 250 MB $0.00893/h × 672 = $6.00 + object storage 20 GB × $0.02 = $0.40 − $5 credit ≈ **$53.71**. With Postgres scale-to-zero (~240 awake hours) ≈ **$42**. Dedicated worker cluster requires Growth ($20) → ≈ $69.

**Railway (Hobby):** plan $5 (includes $5 usage) + RAM billed on actual use ($10/GB-mo; ~1.2 GB average across web/worker/Reverb/PG/Valkey ≈ $12) + vCPU on actual use ($20/vCPU-mo; ~0.25 avg ≈ $5) + volumes 6 GB × $0.15 = $0.90 + bucket 20 GB × $0.015 = $0.30 + egress ~5 GB × $0.05 = $0.25 − $5 included ≈ **$18.45**; realistic range $18–25.

### Alternatives (one line each)
- **Render** — Singapore region; 2026 prices not extractable (JS-rendered page) — unverified.
- **Fly.io** — Singapore and Mumbai; cheap machines but Managed Postgres from $38/mo → not cheaper for this stack.
- **DigitalOcean App Platform** — Bangalore/Singapore; ≈ $60–70/mo for the equivalent stack.
- **Hetzner VPS (Singapore) + Ploi/Forge or our own Compose stack** — ≈ €15–20/mo, cheapest and **highest parity with the production VM**, but self-managed (we run Postgres, Valkey, Reverb, backups).

## 6. Recommendation (D-032, Proposed)

| Rank | Option | Why |
|------|--------|-----|
| **1** | **Railway (Hobby → Pro if needed), Singapore** | Cheapest realistic bill ($18–25); **PostgreSQL 18 parity** with the production target; services-per-container model mirrors the shared-VM Compose design (web / worker / realtime / imgproxy as separate services); PR environments and one-click rollback; PITR. Cost: Reverb and scheduler are self-configured services (documented pattern for workers/cron; Reverb by community guidance — to be proven in the Phase 1 spike). |
| 2 | **Laravel Cloud Starter, Singapore** | Best Laravel ergonomics (managed Reverb, Horizon, scheduler, R2 storage as toggles) and PR previews; 2–3× the cost; Postgres 17 (18 unconfirmed) breaks version parity; rollback not documented. Choose if the spike shows Reverb-on-Railway is troublesome and the owner accepts PG 17 on staging. |
| 3 | **Hetzner VPS + production Compose stack** | Required anyway as a **pre-production rehearsal** (restore + portability drill, SHARED_VM_ARCHITECTURE §4) before the farm VM; could double as staging if the team prefers full parity over managed convenience. |

Either way: **no resource is created until Ammar approves the provider, plan, region and monthly budget in GitHub.**

## 7. Acceptance package (delivered before declaring staging ready)

1. **Live staging URL** (HTTPS).
2. **Repository + deployed commit SHA** (shown in the app footer and the deployment workflow run).
3. **Test-account instructions** (roles, how credentials are shared — never in Git), including the simulated-reader how-to.
4. **Automated test results** — links to the green CI run (unit, migrations, integration, RBAC, E2E, security) and the latest performance run against the acceptance criteria.
5. **Manual QA checklist** — owner walkthrough per role: login/PIN, scan → profile, photo capture, weigh, observe, vet exam, treatment, feeding compliance, transfer, kidding, expense entry, dashboards, real-time between two devices, offline capture (if in scope), permission denials (finance as caretaker, prescribe as caretaker).
6. **Known limitations & unfinished features** — explicit list with issue links.
7. **Estimated monthly staging cost** — actual invoice-based figure after the first month.
8. **Bug-reporting instructions** — GitHub issue template `bug.md` (role, device, steps, screenshot, commit SHA from footer); the QA Lead triages.

## 8. Open questions

| ID | Question | For |
|----|----------|-----|
| Q-STG-1 | Approve provider/plan/region/budget for staging (D-032)? | Ammar |
| Q-STG-2 | Is PostgreSQL 17 acceptable on staging if Laravel Cloud is chosen, or is 18 parity mandatory? | Ammar + engineering |
| Q-STG-3 | Staging domain: subdomain of the farm's future domain or provider default? | Ammar |
| Q-STG-4 | Who else gets staging accounts (vets, ChatGPT QA via screenshots/reports)? | Ammar |
| Q-STG-5 | Gate staging behind basic-auth/IP allow-list, or open login page with rate limiting? | Ammar |

## 9. Sources (read 2026-11-07)

Laravel Cloud: [pricing](https://laravel.com/cloud/pricing) · [docs pricing](https://laravel.com/cloud/docs/pricing.md) · [Postgres](https://laravel.com/cloud/docs/resources/databases/postgres.md) · [Valkey](https://laravel.com/cloud/docs/resources/caches/valkey.md) · [object storage](https://laravel.com/cloud/docs/resources/object-storage) · [WebSockets](https://laravel.com/cloud/docs/resources/websockets) · [workers](https://laravel.com/cloud/docs/workers.md) · [queues](https://laravel.com/cloud/docs/queues.md) · [scheduled tasks](https://laravel.com/cloud/docs/scheduled-tasks.md) · [deployments](https://laravel.com/cloud/docs/deployments) · [preview environments](https://laravel.com/cloud/docs/preview-environments.md) · [domains](https://laravel.com/cloud/docs/domains.md) · [regions API](https://laravel.com/cloud/docs/api/meta/list-regions.md) · [compliance](https://laravel.com/cloud/docs/compliance).
Railway: [plans](https://docs.railway.com/reference/pricing/plans) · [free trial](https://docs.railway.com/reference/pricing/free-trial) · [regions](https://docs.railway.com/reference/regions) · [backups](https://docs.railway.com/reference/backups) · [PITR](https://docs.railway.com/volumes/point-in-time-recovery) · [Postgres template](https://railway.com/deploy/postgres.md) · [storage buckets](https://docs.railway.com/storage-buckets) · [bucket billing](https://docs.railway.com/storage-buckets/billing.md) · [networking limits](https://docs.railway.com/networking/public-networking/specs-and-limits.md) · [domains](https://docs.railway.com/networking/domains/working-with-domains) · [cron](https://docs.railway.com/reference/cron-jobs) · [deployment actions](https://docs.railway.com/deployments/deployment-actions) · [environments / PR envs](https://docs.railway.com/guides/environments) · [Laravel guide](https://railway.com/guides/laravel) · [compliance](https://docs.railway.com/enterprise/compliance.md).
Alternatives: [Render regions](https://render.com/docs/regions) · [Fly.io pricing](https://fly.io/pricing.md) · [DO App Platform](https://www.digitalocean.com/pricing/app-platform) · [DO managed DBs](https://www.digitalocean.com/pricing/managed-databases) · [Hetzner locations](https://docs.hetzner.com/cloud/general/locations/) · [Ploi](https://ploi.io/pricing) · [Forge](https://laravel.com/forge/pricing).
