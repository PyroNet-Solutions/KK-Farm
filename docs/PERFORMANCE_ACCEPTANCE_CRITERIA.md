# Performance Acceptance Criteria

**Status:** Proposed (D-022). Owner direction: *"The system must be exceptionally fast"* with measurable targets and a documented test method. Targets apply to the production build on realistic data; they are gates for every phase from Phase 1 onward.

## 1. Reference conditions

| Dimension | Reference |
|-----------|-----------|
| **Reference phone** | Mid-range Android (2022–2024 class, 4 GB RAM, e.g. Snapdragon 6xx/MediaTek G-series), Chrome/WebView current stable. The actual models used on the farm are `[UNKNOWN]` → Q-PF-1; the real device list replaces this reference once known. |
| **Networks** | *Healthy*: 4G/Wi‑Fi, ≥ 10 Mbps, RTT ≤ 100 ms. *Degraded*: 3G-class, 1.5 Mbps, RTT 300 ms (Lighthouse "slow 4G"). *Offline*: capture-only mode if Q-FM-3 confirms. |
| **Reference dataset** | "Expansion": 2,000 animals · 6 sheds · 1,000,000 animal events · 200,000 weight records · 50,000 photos · 5 years of finance. (Current farm is ~118 goats; targets must hold at 15–20× scale without redesign.) |
| **Concurrency** | 50 concurrent active users (≈10× current staff), 20 RFID scans/minute, 5 vets editing simultaneously, 3 dashboards open. |

## 2. Targets

### 2.1 Web client (mobile)

| Metric | Target (p75, reference phone, healthy network) | Degraded network | Source of truth |
|--------|-----------------------------------------------|------------------|-----------------|
| Largest Contentful Paint (LCP) | **≤ 2.0 s** first visit; **≤ 1.0 s** repeat (cached shell) | ≤ 3.5 s | Lighthouse CI, web-vitals RUM |
| Interaction to Next Paint (INP) | **≤ 200 ms** | ≤ 200 ms | web-vitals RUM, Lighthouse |
| Cumulative Layout Shift (CLS) | **≤ 0.1** (images reserve space) | ≤ 0.1 | Lighthouse, RUM |
| Route transition (in-app navigation) | **≤ 300 ms** to meaningful content; skeleton within 100 ms | ≤ 800 ms | Playwright timing |
| Scan → goat profile visible (end-to-end) | **≤ 1.0 s**; **≤ 500 ms** when profile is cached | ≤ 2.5 s | Playwright + simulated scan; on-site stopwatch test with real reader |
| Search typeahead (farm number / name) | **≤ 150 ms** p95 round-trip | — | k6, Playwright |
| Initial JS payload (app shell) | **≤ 200 kB gzipped**; per-route chunk ≤ 100 kB; total ≤ 600 kB | — | `build` job bundle budget (fails PR) |
| Full-page reloads during normal use | **0** (SPA/PWA navigation) | — | E2E assertion |
| Lists > 50 rows | Virtualised; scrolling ≥ 55 fps | — | Playwright + DevTools trace |
| Animations / transitions | ≥ 55 fps average, no frame > 50 ms; `prefers-reduced-motion` disables non-essential motion | — | DevTools trace in E2E; manual device check |
| Memory | < 150 MB JS heap on profile + timeline after 10 min use | — | DevTools in nightly |

### 2.2 API and database

| Metric | Target | Source |
|--------|--------|--------|
| Read endpoints (profile, timeline page, dashboard aggregates, lists) | **p95 ≤ 200 ms**, p99 ≤ 500 ms at reference concurrency | k6 |
| Write endpoints (weight, observation, exam, transfer) | **p95 ≤ 400 ms** incl. audit + event emit | k6 |
| Scan resolve (`tag_code → animal`) | **p95 ≤ 50 ms** server time | k6; partial index on open assignments |
| Any single SQL statement | **p95 ≤ 50 ms** on reference dataset; no sequential scans on large tables | `pg_stat_statements`, EXPLAIN budget test in CI |
| N+1 queries | **0** — query-count assertions in integration tests | test harness |
| Pagination | Cursor-based on all lists; page ≤ 50; no unbounded queries | code review + tests |
| Error rate under load | < 0.1 % 5xx | k6 |
| Background job latency (thumbnails, rule evaluation, notifications) | **p95 ≤ 5 s** from enqueue to done | queue metrics |

### 2.3 Real-time

| Metric | Target | Source |
|--------|--------|--------|
| Event emit → visible on an authorised client | **p50 ≤ 300 ms, p95 ≤ 1 s** on healthy network | latency probe (nightly) + RUM timestamp diff |
| Reconnect after network drop | Reconnected and **gap-filled ≤ 5 s** after connectivity returns; no duplicates, no loss | fault-injection test |
| Concurrent WebSocket connections | 200 on one VM with < 10 % CPU idle load | k6 WebSocket scenario |

### 2.4 Media

| Metric | Target |
|--------|--------|
| Photo upload (client-resized ≤ 2048 px, ~400 kB) on 4G | ≤ 5 s to "saved"; thumbnails appear ≤ 5 s later (async) |
| Thumbnail weight | ≤ 30 kB (card), ≤ 8 kB (list avatar) |
| Profile page with 12 photos | LCP target unchanged (lazy gallery, reserved aspect ratio) |

### 2.5 Reliability (single VM)

| Metric | Target |
|--------|--------|
| Availability | ≥ 99.5 % monthly (≈ 3.6 h downtime) |
| RPO (data loss window) | ≤ 1 h (WAL archiving) — ≤ 24 h minimum with nightly dumps |
| RTO (restore time) | ≤ 4 h from backup to working system on a fresh VM |

## 3. How we test

| Layer | Tool (versions per TECHNOLOGY_EVALUATION) | When | Pass/fail |
|-------|-------------------------------------------|------|-----------|
| Lab web vitals | Lighthouse CI, mobile preset, throttled, 5 runs median, on 6 key pages (login, dashboard, profile, timeline, scan flow, finance) | every PR-ready + nightly | budgets in `lighthouserc` |
| Field web vitals (RUM) | `web-vitals` library → internal metrics endpoint | continuously once live | dashboard alerts if p75 breaches |
| API load | k6 scenarios: steady 50 VU 10 min; spike 150 VU 2 min; soak 30 VU 1 h (nightly) | nightly + before each phase gate | `thresholds` in script |
| SQL budget | integration tests wrap requests with query counter + `EXPLAIN (ANALYZE)` on reference dataset; fail if seq scan on tables > 10k rows or count > budget | every push | assertions |
| Real-time latency | probe client subscribes; server emits timestamped events; measures delivery | nightly | p95 threshold |
| Device lab | 2–3 actual farm phones (once known); scripted walkthrough with timing; quarterly | before each gate | checklist |
| Bundle budget | build job compares stats to budget file | every PR | fails PR |

Results are published as workflow artifacts (see [CI_PIPELINE_PROPOSAL.md](CI_PIPELINE_PROPOSAL.md)) and summarised by the QA Lead in the release-readiness report.

## 4. Design rules that make the targets achievable

- Server-side rendered or pre-rendered app shell; code-split per route; prefetch likely next route (profile after scan).
- Read models / materialised aggregates for dashboards refreshed by events, not computed on request.
- Cursor pagination + virtualised lists; never load "all animals".
- HTTP caching for reference data and images (immutable URLs, long max-age); ETags on list endpoints.
- Cache layer (Redis-compatible) for sessions, permission sets, hot aggregates; cache invalidation driven by the same domain events that feed real-time.
- All heavy work (thumbnails, rule evaluation, reports, notifications) in background workers.
- Indexes defined with the schema; every list/filter has a covering index; `(animal_id, occurred_at DESC)` on timelines.
- Images: client-side resize before upload, responsive variants, modern formats, lazy loading with reserved aspect ratio.
- Animations: transform/opacity only (GPU-composited), no layout-thrashing, reduced-motion respected.

## 5. Open questions

| ID | Question |
|----|----------|
| Q-PF-1 | Which phone models do staff actually use? (replaces the reference device) |
| Q-PF-2 | Expected peak concurrent users in 3 years? (sets the k6 profile) |
| Q-PF-3 | Acceptable downtime window for maintenance (night-time)? |
