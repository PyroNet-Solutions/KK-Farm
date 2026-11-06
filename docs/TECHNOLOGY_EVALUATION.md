# Technology Evaluation

**Status:** Proposed (D-023 and related). Research date **2026-11-07**. Versions were verified against official release notes, GitHub releases, package registries and endoflife.date by three parallel research passes; every table row cites its source. Anything not verifiable is marked. **This is a recommendation for the owner's approval, not a decision** (D-011 remains open until Ammar accepts).

Selection rules (owner direction): latest **stable** only; actively maintained, production-ready; no deprecated/abandoned/RC/experimental choices; compare ≥ 2 viable stacks; weigh maintainability, ecosystem maturity, performance, security and the team's ability to maintain it.

---

## 1. Summary of the recommendation

| Area | Recommended | Alternative evaluated | Why |
|------|-------------|-----------------------|-----|
| Backend | **Laravel 13 (PHP 8.5) + Octane** | NestJS 12 (Node 26 LTS, Fastify) | First-party real-time (Reverb), queues (Horizon), auth, policies; fastest path to the premium feature set; team familiarity `[ASSUMED]` |
| Frontend | **Inertia 3 + React 19.3 + Vite 8 + TypeScript 7** | Next.js 16 LTS (with NestJS) | SPA navigation with no full reloads, SSR for fast first paint, one codebase with the backend, optimistic updates built in |
| UI / design system | **Tailwind CSS 4.3 + shadcn/ui (Base UI primitives)** | Mantine 9 | Accessible primitives, full visual control for a premium design system, tiny runtime |
| Animation | **Motion 14** (+ View Transitions API for route transitions) | GSAP 3.15 (now free) | React-native API, reduced-motion support, layout/shared-element animations |
| Tables / lists / data | **TanStack Table 9, TanStack Virtual 3, TanStack Query 5** | AG Grid Community 36 | Headless, virtualised, fits custom design; AG Grid only if spreadsheet-like grids are needed |
| Charts | **Apache ECharts 6.1** (dashboards, growth curves) + **D3 7.9** (pedigree tree) | Recharts 3.10 | ECharts handles large series and touch well; D3 for the custom interactive family tree |
| Database | **PostgreSQL 18.6** | — (PG 19 is RC) | Exclusion constraints, recursive CTEs, JSONB, partitioning, mature tooling |
| Cache / pub-sub / queues | **Valkey 9.1** | Redis 8.10 | Redis-protocol compatible, BSD-3 licence, Linux Foundation governance |
| Real-time transport | **Laravel Reverb 1.12** (WebSocket, Pusher protocol, private/presence channels) with SSE/long-poll fallback via Laravel Echo | Centrifugo 6.10 (stack-agnostic, standalone) | Integrated channel authorisation with the same policies as the API; separate process (G-5); Centrifugo if we later need a fully independent real-time service |
| Background jobs | **Laravel queues + Horizon 5.50** on Valkey | BullMQ 6.7 (Node) | First-party dashboard, retries, rate limiting, metrics |
| Image processing | **imgproxy 4.0** (libvips-based, MIT) as a separate service + **Intervention Image 4.4** for upload-time validation/EXIF | sharp 0.35 (Node) | On-the-fly WebP/AVIF variants, signed URLs, caching, stack-agnostic; keeps CPU-heavy work out of the app |
| Object storage (S3 API) | **Garage 2.5** (single-node mode) | SeaweedFS 4.52; Cloudflare R2 | MinIO Community is **archived/dead**; Garage is lightweight and S3-compatible; S3 API from day one for portability (G-9) |
| Auth | **Laravel Sanctum 4.3** (sessions + device tokens) + Laravel policies/gates for RBAC | Keycloak 26.8 | No external identity server needed for ~10–50 staff; Keycloak only if SSO is ever required |
| Reverse proxy / TLS | **Caddy 2.11** | Nginx 1.31 / Traefik 3.7 | Automatic TLS, HTTP/2 & WS upgrade with minimal config |
| Containers | **Docker Engine 29 + Compose 5**, one Compose project per application | Podman 6 / systemd slices | Reproducible deploys, per-app isolation, resource limits |
| Monitoring / logs / errors | **Prometheus 3.13 LTS + Grafana 13 + Loki 3.7 + Alloy 1.21**; **GlitchTip 6.2** for errors; **Uptime Kuma 2.5** for uptime | Sentry self-hosted (too heavy), Netdata | Modest footprint; Promtail is EOL → Alloy |
| Performance testing | **k6 2.3, Lighthouse CI 0.16, Playwright 1.65, web-vitals 6.2** | Locust / Artillery | Match the acceptance criteria tooling |
| Backups | **pgBackRest 2.60** (WAL + base backups) + **rclone 1.76** / **restic 0.19** for buckets | Barman 3.20 | RPO ≤ 1 h, independent per-app restore |
| Mobile delivery | **Installable PWA** (service worker, IndexedDB offline queue, Background Sync on Android); **Capacitor 8** wrapper only if the RFID reader's SDK requires native code | Native Kotlin (Compose BOM 2026.09) / Expo SDK 58 / Flutter 3.47 | One codebase; Android Chrome/WebView support everything needed; decision finalised after reader inspection (Q-RF-1…3) |

---

## 2. The two shortlisted stacks

### Option A — Laravel + Inertia/React (recommended)

```
Browser/PWA (React 19 + Inertia 3 client) ──HTTP/JSON──► Laravel 13 on Octane (api + web, SSR)
                                           ──WebSocket──► Laravel Reverb (separate process)
                                                               ▲ broadcast via Valkey pub/sub
                                           Horizon workers ◄── queues on Valkey ── outbox relay, images, rules, notifications
                                           PostgreSQL 18 · Valkey 9 · Garage (S3) · imgproxy
```

| Criterion | Assessment |
|-----------|------------|
| Maintainability | One repository, one language on the server, conventions enforced by the framework; Laravel 13 supported with bug fixes to 2027-09 and security to 2028-03 ([endoflife.date](https://endoflife.date/laravel)); predictable yearly majors |
| Ecosystem maturity | Mature first-party packages for exactly our needs: Reverb (WebSockets), Horizon (jobs), Sanctum (auth), Octane (performance), Scout (search), filesystem S3 driver; Inertia 3 GA since 2026-03 ([Laravel News](https://laravel-news.com/inertia-3-0-0)) |
| Performance | Octane keeps the framework booted (Swoole/FrankenPHP workers), giving p95 API latencies well inside the 200 ms target at our scale; Inertia SSR + Vite 8 code-splitting for LCP; TanStack Virtual for lists |
| Real-time | Reverb implements private/presence channels with authorisation callbacks that call the **same policies** as HTTP routes — directly satisfying RT-3; scales horizontally with Valkey pub/sub; Echo client handles reconnection |
| Security | Built-in CSRF, policies/gates, rate limiting, encrypted cookies, signed URLs (used for media), mass-assignment protection; security releases are frequent and well announced |
| Team ability | `[ASSUMED]` the organisation's existing products use Laravel + Inertia/React + PostgreSQL (Q-NFR-3). If confirmed, this is the decisive advantage: no new runtime to learn, existing deployment habits reusable |
| Risks | Inertia 3 is a recent major (ESM-only, own HTTP client) — mitigated by the v2 maintenance line and clear upgrade guide; PHP image processing is weaker than libvips/sharp — mitigated by offloading variants to imgproxy; TypeScript 7 has no stable programmatic API until 7.1 — type-checking via the CLI is unaffected |

### Option B — NestJS + Next.js (TypeScript end-to-end)

```
Browser/PWA (Next.js 16 LTS, React 19) ──HTTP/JSON──► NestJS 12 on Fastify (Node 26 LTS)
                                        ──WebSocket──► Socket.IO 4.8 gateway (or Centrifugo)
                                        BullMQ 6.7 workers on Valkey; sharp 0.35 for images
                                        PostgreSQL 18 · Valkey 9 · Garage (S3)
```

| Criterion | Assessment |
|-----------|------------|
| Maintainability | One language front and back; strong typing end to end; Nest's module system suits the modular monolith |
| Ecosystem maturity | NestJS 12 shipped 2026-08 with a full ESM migration (fresh; CJS ecosystem friction); Next.js 16 is Active LTS with a monthly security-release programme (7 CVEs patched 2026-11-03) — mature but demands frequent patching; Auth.js v5 never reached stable and merged into Better Auth (1.7) — auth story is in flux |
| Performance | Node + Fastify is excellent for I/O and WebSockets; sharp/libvips is the best image library available; otherwise comparable to Option A at our scale |
| Real-time | Socket.IO is mature but slow-moving (4.8.4, 2026-09); Nest gateways integrate it; channel authorisation must be hand-built to mirror HTTP guards (RT-3 achievable, more code) |
| Security | Good, but more assembled from parts (auth library choice, CSRF handling in SPA, rate limiting middleware); more surface to review |
| Team ability | `[ASSUMED]` less in-house depth than PHP/Laravel; two frameworks (Nest + Next) to master |
| Risks | More glue code (auth, queue dashboards, policies), two frameworks with independent release cadences, auth ecosystem churn |

### Also considered (not shortlisted)

| Stack | Why not |
|-------|---------|
| Phoenix 1.8 + LiveView 1.2 (Elixir 1.20) | Best-in-class real-time, but a niche runtime for the team to maintain long-term; small local talent pool |
| Django 5.2 LTS + Channels 4.3 | Solid, but Channels has no 2026 release (slow cadence) and the real-time story is weaker than Reverb/Socket.IO |
| ASP.NET Core / .NET 10 LTS | Capable; team familiarity assumed low; .NET 11 GA on 2026-11-10 would make choosing a line awkward this month |
| Go (Fiber 3 / Echo 5 / Chi 5) | Excellent performance; too much to hand-build for a product with this breadth (RBAC, admin, uploads, real-time, jobs) |
| Nuxt 4 / Vue 3.5 | Nuxt 3 is EOL, Vue 3.6 (Vapor) still RC — fine options, but no advantage over React with Inertia and Vue 3.6 isn't stable yet |
| SvelteKit 3 | GA only since 2026-10-01; ecosystem of UI/animation/table libraries smaller than React's |

### Why Option A is best for KK Farm

1. **Real-time and background work are first-party**, with channel authorisation reusing API policies — the owner's "never broadcast private data to unauthorised users" rule becomes one code path, not two.
2. **Premium UI is unconstrained**: Inertia delivers a true SPA experience (no full reloads, prefetching, optimistic updates) with the full React ecosystem (Motion, TanStack, ECharts, D3) — identical to what Option B offers on the front end.
3. **Performance targets are achievable** with Octane + PostgreSQL + Valkey caching and the design rules in [PERFORMANCE_ACCEPTANCE_CRITERIA.md](PERFORMANCE_ACCEPTANCE_CRITERIA.md); the heavy pieces (images, real-time) are separate services in both options.
4. **Fewer moving parts to secure and maintain** for a small team; longer defined support windows.
5. **Team ability** (assumed) tips it decisively; if Q-NFR-3 reveals the team is stronger in TypeScript, Option B is a sound second choice with the same front-end and infrastructure layers.

---

## 3. Verified version table

### 3.1 Backend, database, cache, real-time, jobs

| Item | Latest stable | Released | Support / EOL | Source | Notes |
|------|---------------|----------|---------------|--------|-------|
| Laravel | 13.40.0 | 2026-11-03 | bug fixes → 2027-09-30, security → 2028-03-17 | [endoflife.date](https://endoflife.date/laravel) | requires PHP ≥ 8.3 |
| PHP | 8.5.12 | 2026-10-21 | active → 2027-12-31, security → 2029-12-31 | [endoflife.date](https://endoflife.date/php) | 8.6 alpha only |
| Laravel Octane | 2.23.0 | 2026-10-30 | follows framework | [Packagist](https://packagist.org/packages/laravel/octane) | Swoole or FrankenPHP runtime |
| Laravel Reverb | 1.12.0 | 2026-09-22 | follows framework | [Packagist](https://packagist.org/packages/laravel/reverb) | Pusher protocol v7 |
| Laravel Horizon | 5.50.1 | 2026-10-13 | follows framework | [Packagist](https://packagist.org/packages/laravel/horizon) | — |
| Laravel Sanctum | 4.3.3 | 2026-06-23 | follows framework | [Packagist](https://packagist.org/packages/laravel/sanctum) | — |
| NestJS | 12.4.0 | 2026-11-06 | v11 security-only | [npm](https://www.npmjs.com/package/@nestjs/core) | v12 = ESM |
| Node.js | 26 (Active LTS) 26.13.0 | LTS 2026-10-28 | EOL 2029-04-30 | [endoflife.date](https://endoflife.date/nodejs) | build tooling for Option A too |
| Fastify | 5.12.8 | 2026-11-02 | v6 alpha only | [npm](https://www.npmjs.com/package/fastify) | — |
| PostgreSQL | 18.6 | 2026-08-13 | 18 → 2030-11; **14 EOL 2026-11-12** | [postgresql.org](https://www.postgresql.org/support/versioning/) | PG 19 at RC1 — not used |
| Valkey | 9.1.3 | 2026-10-26 | 9.1 → 2031 | [endoflife.date](https://endoflife.date/valkey) | BSD-3 |
| Redis | 8.10.3 | 2026-10-26 | latest minor only | [redis.io/legal](https://redis.io/legal/licenses/) | tri-licence RSALv2/SSPL/AGPLv3 since 8.0 |
| Socket.IO | 4.8.4 | 2026-09-25 | — | [npm](https://www.npmjs.com/package/socket.io) | slow cadence |
| Centrifugo | 6.10.2 | 2026-10-22 | — | [Go proxy](https://proxy.golang.org/github.com/centrifugal/centrifugo/v6/@latest) | standalone alternative |
| BullMQ | 6.7.1 | 2026-11-06 | — | [npm](https://www.npmjs.com/package/bullmq) | Option B |
| pg-boss | 12.38.1 | 2026-11-05 | — | [npm](https://www.npmjs.com/package/pg-boss) | Postgres-backed jobs (Option B alt.) |
| Better Auth | 1.7.18 | 2026-11-05 | — | [authjs.dev](https://authjs.dev/getting-started/integrations) | Auth.js v5 never stable |
| Keycloak | 26.8.2 | 2026-11-05 | latest minor only | [keycloak.org](https://www.keycloak.org/downloads) | only if SSO needed |
| **Avoid** | Soketi (no commits since 2024-03), KeyDB (no commits since 2024-04), Dragonfly (source-available DSAL), Django Channels (no 2026 release) | | | | |

### 3.2 Frontend, UI, animation, data, charts

| Item | Latest stable | Released | Source | Notes |
|------|---------------|----------|--------|-------|
| React | 19.3.0 | 2026-09-09 | [react.dev/versions](https://react.dev/versions) | — |
| Inertia.js | 3.11.0 | 2026-11-02 (3.0 GA 2026-03-26) | [GitHub](https://github.com/inertiajs/inertia/releases) | ESM-only, optimistic updates, own HTTP client |
| Vite | 8.3.6 | 2026-11-05 | [vite.dev](https://vite.dev/blog/announcing-vite8) | Rolldown bundler; Node ≥ 20.19/22.12 |
| TypeScript | 7.0.2 | 7.0 GA 2026-07-08 | [TS devblog](https://devblogs.microsoft.com/typescript/) | Go-native compiler; stable API in 7.1 |
| Next.js | 16.4.5 (Active LTS) | 2026-11-03 | [nextjs.org](https://nextjs.org/blog/november-2026-security-release) | monthly security releases |
| Tailwind CSS | 4.3.5 | 2026-11-06 | [GitHub](https://github.com/tailwindlabs/tailwindcss/releases) | — |
| shadcn/ui | CLI v4 (rolling) | Oct 2026 | [changelog](https://ui.shadcn.com/docs/changelog) | Base UI default primitives since 2026-07 |
| Mantine | 9.7.5 | 2026-11-04 | [GitHub](https://github.com/mantinedev/mantine/releases) | needs React 19 |
| Motion (`motion`) | 14.10.1 | 2026-11-05 | [motion.dev](https://motion.dev/changelog) | install `motion`, not `framer-motion` |
| GSAP | 3.15.1 | 2026-11-04 | [Webflow](https://webflow.com/blog/gsap-becomes-free) | fully free incl. plugins |
| AutoAnimate | 0.10.2 | 2026-11-06 | [GitHub](https://github.com/formkit/auto-animate/releases) | pre-1.0 |
| View Transitions API | Chrome Android 157 ✓, WebView ✓ (same-document); cross-document Chrome ≥ 126 | — | [caniuse](https://caniuse.com/view-transitions) | use for route transitions with fallback |
| TanStack Table | 9.3.1 | 2026-10-12 (v9 GA 2026-08-04) | [GitHub](https://github.com/TanStack/table/releases) | — |
| TanStack Virtual | 3.19.11 | 2026-11-03 | [GitHub](https://github.com/TanStack/virtual/releases) | — |
| TanStack Query | 5.106.1 | 2026-11-05 | [GitHub](https://github.com/TanStack/query/releases) | — |
| AG Grid | 36.3.0 (Community MIT) | 2026-11-04 | [GitHub](https://github.com/ag-grid/ag-grid/releases) | optional |
| Apache ECharts | 6.1.0 | 2026-05-19 | [GitHub](https://github.com/apache/echarts/releases) | — |
| D3 | 7.9.2 | 2026-11-03 | [GitHub](https://github.com/d3/d3/releases) | pedigree tree |
| Recharts | 3.10.1 | 2026 (date unverified) | [npm](https://www.npmjs.com/package/recharts) | alternative |
| Chart.js | 4.6.1 | 2026-10-22 | [GitHub](https://github.com/chartjs/Chart.js/releases) | alternative |
| **Avoid** | lottie-web (no release since 2024-11), Headless UI (maintenance mode), Vue 3.6 (RC), Nuxt 3 (EOL) | | | |

### 3.3 Mobile and PWA

| Item | Latest stable | Released | Source | Notes |
|------|---------------|----------|--------|-------|
| Capacitor | 8.6.0 | 2026-10-28 | [GitHub](https://github.com/ionic-team/capacitor/releases) | wrapper if native RFID SDK needed |
| React Native | 0.88.1 | 2026-10-27 | [GitHub](https://github.com/facebook/react-native/releases) | not recommended (second codebase) |
| Expo SDK | 58 | 2026-10-15 | [expo.dev](https://expo.dev/changelog/sdk-58) | Expo Go login-gated |
| Flutter | 3.47.1 | 2026-08-19 | [docs.flutter.dev](https://docs.flutter.dev/release/release-notes) | not recommended (new language for team) |
| Jetpack Compose BOM | 2026.09.00 | 2026-09-09 | [Google Maven](https://developer.android.com/develop/ui/compose/bom/bom-mapping) | only if a native scan bridge is needed |
| PWA offline on Android | Service Worker + IndexedDB universal; Background Sync & Periodic Sync supported on Chrome Android | — | [caniuse](https://caniuse.com/background-sync) | Safari/Firefox lack Background Sync — irrelevant for Android-only field devices |

### 3.4 Media, storage, formats

| Item | Latest stable | Released | Licence / status | Source |
|------|---------------|----------|------------------|--------|
| imgproxy | 4.0.22 | 2026-11-05 | MIT (core) | [GitHub](https://github.com/imgproxy/imgproxy/releases) |
| libvips / sharp | 8.18.7 / 0.35.5 | 2026-09 | LGPL-2.1 / Apache-2.0 | [libvips](https://github.com/libvips/libvips/releases), [sharp](https://github.com/lovell/sharp/releases) |
| Intervention Image | 4.4.1 | 2026-10-30 | MIT; PHP ≥ 8.3 | [GitHub](https://github.com/Intervention/image/releases) |
| ImageMagick | 7.1.2-35 | 2026-10-31 | ImageMagick licence | [GitHub](https://github.com/ImageMagick/ImageMagick/releases) |
| **MinIO Community** | — | repo archived **2026-04-25** | AGPLv3; **unmaintained** | [GitHub](https://github.com/minio/minio) |
| Garage | 2.5.0 | 2026-10-24 | AGPLv3 (unmodified server use has no obligations for us) | [garagehq](https://garagehq.deuxfleurs.fr/_releases.html) |
| SeaweedFS | 4.52 | 2026-11-02 | Apache-2.0 | [GitHub](https://github.com/seaweedfs/seaweedfs/releases) |
| Cloudflare R2 | SaaS | — | zero egress fees | [pricing](https://developers.cloudflare.com/r2/pricing/) |
| WebP | 97.3 % global; Android WebView since 4.2 | — | [caniuse](https://caniuse.com/webp) | baseline format |
| AVIF | 96.7 % global; Chrome Android 157, Samsung Internet 14+; WebView tracks Chrome | — | [caniuse](https://caniuse.com/avif) | serve via `<picture>` with WebP/JPEG fallback |
| Core Web Vitals thresholds | LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1 (p75) | unchanged 2026 | [web.dev/vitals](https://web.dev/articles/vitals) | our targets are stricter (LCP ≤ 2.0 s) |

### 3.5 Infrastructure, observability, testing

| Item | Latest stable | Released | Licence / status | Source |
|------|---------------|----------|------------------|--------|
| Docker Engine / Compose | 29.9.3 / 5.7.0 | 2026-11-03 / 2026-11-02 | Apache-2.0 | [docs.docker.com](https://docs.docker.com/engine/release-notes/), [GitHub](https://github.com/docker/compose/releases) |
| Caddy | 2.11.9 | 2026-11-05 | Apache-2.0 | [GitHub](https://github.com/caddyserver/caddy/releases) |
| Nginx (mainline) | 1.31.8 | 2026-10-21 | BSD-2 | [nginx.org](https://nginx.org/en/CHANGES) |
| Traefik | 3.7.17 | 2026-10-30 | MIT | [GitHub](https://github.com/traefik/traefik/releases) |
| pgBackRest | 2.60.0 | 2026-10-18 | MIT | [GitHub](https://github.com/pgbackrest/pgbackrest/releases) |
| restic / rclone | 0.19.1 / 1.76.0 | 2026-07-05 / 2026-11-06 | BSD-2 / MIT | [restic](https://github.com/restic/restic/releases), [rclone](https://github.com/rclone/rclone/releases) |
| Prometheus | 3.13.5 LTS (3.16.0 latest) | 2026-10-21 | LTS → 2027-07-31 | [endoflife.date](https://endoflife.date/prometheus) |
| Grafana | 13.3.0 | 2026-10-27 | AGPLv3 | [GitHub](https://github.com/grafana/grafana/releases) |
| Loki / Alloy | 3.7.9 / 1.21.3 | 2026-10 | **Promtail EOL 2026-03-02** → Alloy | [Loki](https://github.com/grafana/loki/releases), [Alloy](https://github.com/grafana/alloy/releases) |
| OpenTelemetry | Collector 0.164.0; PHP SDK 1.16.1 (logs stable); JS SDK 3.1.0 | 2026-10/11 | Apache-2.0 | [status](https://opentelemetry.io/status/) |
| GlitchTip | 6.2.6 | 2026-08-07 | MIT | [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/-/tags) |
| Sentry self-hosted | 26.10.1 | 2026-10-29 | FSL; ~16 GB RAM | [GitHub](https://github.com/getsentry/self-hosted/releases) — too heavy for the shared VM |
| Uptime Kuma | 2.5.9 | 2026-10-31 | MIT | [GitHub](https://github.com/louislam/uptime-kuma/releases) |
| k6 | 2.3.0 | 2026-09-21 | AGPLv3 (tool only) | [GitHub](https://github.com/grafana/k6/releases) |
| Lighthouse CI | 0.16.0 | 2026-11-02 | Apache-2.0; Node ≥ 22.19 | [GitHub](https://github.com/GoogleChrome/lighthouse-ci/releases) |
| Playwright | 1.65.0 | 2026-11-05 | Apache-2.0 | [GitHub](https://github.com/microsoft/playwright/releases) |
| web-vitals | 6.2.3 | 2026-10-05 | Apache-2.0 | [GitHub](https://github.com/GoogleChrome/web-vitals/tags) |

---

## 4. Compatibility notes (Option A)

| Pair | Status |
|------|--------|
| Laravel 13 ↔ PHP 8.5 | Supported (Laravel 13 requires ≥ 8.3) |
| Laravel 13 ↔ Octane 2.23 (FrankenPHP or Swoole) | Supported; FrankenPHP preferred for simpler container images — **verify** FrankenPHP's PHP 8.5 build at implementation time |
| Laravel ↔ Valkey 9 | Redis-protocol compatible via phpredis; **verify** Horizon/Reverb against Valkey in the first spike (expected to work; Valkey is a drop-in fork) |
| Inertia 3 ↔ React 19.3 ↔ Vite 8 | Supported (Inertia 3 is ESM-only; Vite 8 is ESM) |
| TypeScript 7.0 ↔ Vite 8 | Vite transpiles without tsc; type-checking via `tsc` CLI works; IDE plugins are on TS 7 |
| Tailwind 4.3 ↔ shadcn/ui v4 (Base UI) | Supported |
| Motion 14 ↔ React 19 | Supported |
| TanStack Table 9 / Virtual 3 / Query 5 ↔ React 19 | Supported |
| ECharts 6.1 ↔ React | via `echarts-for-react` or direct hooks — **verify** wrapper version at implementation time |
| PostgreSQL 18 ↔ Laravel | Supported |
| imgproxy 4 ↔ Garage (S3) | Supported (S3 source) |
| Caddy 2.11 ↔ Reverb WebSockets | Supported (reverse_proxy with WS upgrade) |

Items marked **verify** are the first tasks of the Phase 1 technical spike.

---

## 5. Decisions proposed from this evaluation

| ID | Decision | Status |
|----|----------|--------|
| D-023 | Recommended stack = Option A (Laravel 13 / Octane / Inertia 3 / React 19 / Vite 8 / TS 7 / Tailwind 4 / shadcn-Base UI / Motion / TanStack / ECharts + D3 / PostgreSQL 18 / Valkey 9 / Reverb / Horizon); Option B (NestJS 12 / Next.js 16) documented as the fallback if team familiarity differs | Proposed |
| D-024 | S3-compatible object storage from day one; **Garage 2.5** self-hosted (MinIO Community rejected — archived); SeaweedFS/R2 as alternatives | Proposed |
| D-025 | **Valkey** rather than Redis for cache, queues and pub/sub (licence clarity, drop-in compatibility) | Proposed |
| D-026 | Observability: Prometheus LTS + Grafana + Loki + Alloy; GlitchTip for errors; Uptime Kuma; OpenTelemetry PHP SDK | Proposed |
| D-027 | Per-application Docker Compose projects behind Caddy with resource limits (implements SHARED_VM_ARCHITECTURE) | Proposed |
| D-028 | Mobile = installable PWA first; Capacitor wrapper only if the RFID reader requires native SDK code; no separate native codebase | Proposed (final after Q-RF-1…3) |
| D-029 | Image variants generated/served by imgproxy from object storage with signed URLs; Intervention Image at upload for validation/EXIF | Proposed |
| D-030 | Real-time = Laravel Reverb (WebSocket, private/presence channels) with transactional outbox; Centrifugo kept as the standalone alternative | Proposed |

---

## 6. Re-verification policy

Versions drift. Before the Phase 1 spike begins (after approval), this table is re-checked against the same sources and updated in a `docs/` PR; Dependabot keeps dependencies current thereafter (see [CI_PIPELINE_PROPOSAL.md](CI_PIPELINE_PROPOSAL.md)).
