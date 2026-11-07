# Third-Party Dependencies, Licences and Security Considerations

**Status:** Register started 2026-11-07 (principle P-3). No application code exists yet, so this lists the **planned** dependencies from the accepted stack (D-023); it becomes the authoritative, generated register (lock-file driven) as soon as code is written. Versions are those verified in [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md) and will be re-verified before the Phase 1 spike.

## Policy

| Rule | Detail |
|------|--------|
| Allowed licences | MIT, BSD-2/3, Apache-2.0, ISC, LGPL (as linked libraries), MPL-2.0 (file-level), PostgreSQL licence |
| Not embedded in distributed code | GPL-2.0/3.0, AGPL-3.0, SSPL, source-available (RSAL, DSAL, FSL) — may be **run as separate infrastructure services** (e.g. Garage, Grafana, k6) but never linked into or shipped with the KK Farm application or mobile build |
| Never used | Code without a licence; copied proprietary code or assets |
| Review | Every new dependency is added here in the same PR with licence, purpose and security note; the QA Lead reviews `.github/**` and dependency changes |
| Updates | Dependabot weekly (grouped), security updates immediately; `dependency-review` blocks known-vulnerable additions |
| Supply chain | Lock files committed; integrity hashes; no post-install scripts from unknown packages; SBOM generated in CI once code exists |

## Planned application dependencies (embedded / distributed)

| Dependency | Version (verified 2026-11-07) | Licence | Purpose | Security considerations |
|------------|-------------------------------|---------|---------|-------------------------|
| PHP | 8.5 | PHP-3.01 | runtime | security releases to 2029-12 |
| Laravel framework | 13.x | MIT | backend framework | monthly security patches; follow release notes |
| Laravel Octane | 2.x | MIT | application server (FrankenPHP/Swoole) | long-lived workers → avoid static state leaks |
| Laravel Reverb | 1.x | MIT | WebSocket server | channel authorisation must reuse API policies |
| Laravel Horizon | 5.x | MIT | queue dashboard/supervisor | dashboard restricted to CEO/engineering |
| Laravel Sanctum | 4.x | MIT | auth tokens/sessions | short-lived tokens; revoke on role change |
| Inertia.js (server + React adapter) | 3.x | MIT | SPA bridge | ESM-only; CSRF via Laravel |
| Intervention Image | 4.x | MIT | upload validation / EXIF | re-encode all uploads; strip GPS |
| React | 19.3 | MIT | UI | — |
| Vite | 8.x | MIT | build | build-time only |
| TypeScript | 7.x | Apache-2.0 | types | build-time only |
| Tailwind CSS | 4.3 | MIT | styling | — |
| shadcn/ui components (copied into repo) + Base UI | rolling / per package | MIT | UI primitives | components live in our repo — review on update |
| Motion (`motion`) | 14.x | MIT | animation | respect reduced-motion |
| TanStack Table / Virtual / Query | 9 / 3 / 5 | MIT | tables, virtualisation, data fetching | — |
| Apache ECharts | 6.1 | Apache-2.0 | charts | large bundle → load per route |
| D3 | 7.9 | ISC | pedigree tree | — |
| web-vitals | 6.x | Apache-2.0 | RUM | sends metrics to our own endpoint only |
| Capacitor (only if required by RFID SDK) | 8.x | MIT | native wrapper | plugin licences reviewed individually |
| RFID vendor SDK (unknown) | — | **unknown** | reader integration | licence/NDA to be checked before any code enters the repo; keep behind the scan-source interface |

## Planned infrastructure services (run alongside, not embedded)

| Service | Version | Licence | Note |
|---------|---------|---------|------|
| PostgreSQL | 18.x | PostgreSQL licence | — |
| Valkey | 9.x | BSD-3 | drop-in Redis protocol |
| Garage (S3) | 2.x | AGPL-3.0 | unmodified, separate service → no obligations beyond offering Garage's own source (public) |
| imgproxy | 4.x | MIT | separate service |
| Caddy | 2.x | Apache-2.0 | reverse proxy |
| Docker Engine / Compose | 29 / 5 | Apache-2.0 | packaging |
| Prometheus / Grafana / Loki / Alloy | 3.13 LTS / 13 / 3.7 / 1.21 | Apache-2.0 / AGPL-3.0 / AGPL-3.0 / Apache-2.0 | observability (Grafana & Loki AGPL as separate services) |
| GlitchTip | 6.x | MIT | error tracking |
| Uptime Kuma | 2.x | MIT | uptime |
| pgBackRest / restic / rclone | 2.60 / 0.19 / 1.76 | MIT / BSD-2 / MIT | backups |

## Development / CI tools (not distributed)

| Tool | Licence | Note |
|------|---------|------|
| Playwright | Apache-2.0 | E2E |
| k6 | AGPL-3.0 | load testing tool only, never embedded |
| Lighthouse CI | Apache-2.0 | web vitals |
| Pest/PHPUnit, Vitest | MIT / BSD-3 / MIT | tests |
| PHPStan / ESLint / Prettier | MIT | static analysis & formatting |

## Open items

- RFID vendor SDK licence (after the reader inspection).
- Final list generated from lock files once code exists; this hand-written table is then replaced by a generated one plus the policy above.
