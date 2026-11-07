# Shared-VM Architecture (Future Hosting)

**Status:** Design for a **confirmed** infrastructure decision (D-021): the KK Farm public website and the livestock management platform will eventually run on the same VM. **Nothing is provisioned in this phase**; this document ensures the design does not couple the two applications. Tool versions are in [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md).

## 1. Goals (owner direction)

| # | Goal |
|---|------|
| G-1 | Separate applications and deployment processes |
| G-2 | Separate databases and credentials |
| G-3 | Reverse-proxy routing |
| G-4 | Isolated resource limits |
| G-5 | Dedicated background-worker and real-time services where appropriate |
| G-6 | Independent backups and restore procedures |
| G-7 | Monitoring and logging |
| G-8 | Secure media storage and backup |
| G-9 | Ability to move the livestock app **or** its database to another VM later without redesign |
| G-10 | Sharing one VM must not mean tight coupling |

## 2. Target layout

```
                     Internet
                        │  443/80 (TLS terminated here)
               ┌────────▼────────┐
               │  Reverse proxy  │  hostname routing, HTTP/2, WS upgrade, rate limits, security headers
               │  (Caddy/Nginx)  │
               └───┬─────────┬───┘
   www.kkfarm.…    │         │   app.kkfarm.…   (+ media.kkfarm.… for signed image URLs)
 ┌─────────────────▼──┐   ┌──▼──────────────────────────────────────────────────────┐
 │ Website stack      │   │ Livestock platform stack                                │
 │ (own compose /     │   │ (own compose / systemd slice)                           │
 │  systemd slice)    │   │ ┌──────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐ │
 │ ┌──────────┐       │   │ │ api      │ │ worker   │ │ realtime│ │ web (static/ │ │
 │ │ web/cms  │       │   │ │ (HTTP)   │ │ (jobs,   │ │ (WS/SSE)│ │  SSR)        │ │
 │ └────┬─────┘       │   │ │          │ │ outbox,  │ │         │ │              │ │
 │      │             │   │ │          │ │ images)  │ │         │ │              │ │
 │ ┌────▼─────┐       │   │ └────┬─────┘ └────┬─────┘ └────┬────┘ └──────────────┘ │
 │ │ db: web  │       │   │      └────────────┼────────────┘                       │
 │ │ (own role│       │   │ ┌─────────────────▼──────────┐  ┌──────────────────┐   │
 │ │  + db)   │       │   │ │ PostgreSQL: livestock DB   │  │ cache/broker     │   │
 │ └──────────┘       │   │ │ (own cluster OR own db+role│  │ (own instance,   │   │
 │ media bucket: web  │   │ │  with pg_hba restrictions) │  │  own password)   │   │
 └────────────────────┘   │ └────────────────────────────┘  └──────────────────┘   │
                          │ object storage bucket: livestock (own credentials)      │
                          └─────────────────────────────────────────────────────────┘
   Shared, VM-level only: OS, reverse proxy, monitoring agent, log shipper, backup scheduler, firewall
```

## 3. Isolation mechanisms

| Concern | Mechanism | Notes |
|---------|-----------|-------|
| Process isolation (G-1, G-4) | Each application in its own container group (Compose project) **or** its own systemd slice with `CPUQuota`, `MemoryMax`, `TasksMax`; separate Unix users | Containers preferred for reproducible deploys; decision in TECHNOLOGY_EVALUATION |
| Network | Private per-app networks; only the proxy is exposed; DB/cache ports bound to localhost or the app's network only; host firewall allows 22/80/443 | The website can never reach the livestock DB |
| Database (G-2) | **Preferred:** two PostgreSQL clusters (separate data dirs/ports) → fully independent upgrades, backups and moves. **Minimum:** one cluster, two databases, two roles, `pg_hba` restricting each role to its DB, no shared superuser used by apps | Two clusters cost ~200 MB RAM extra; worth it for G-9 |
| Cache / broker | Separate Redis-compatible instances (or at least separate ACL users + logical DBs) with distinct passwords | Real-time pub/sub and job queues live in the livestock instance only |
| Secrets | Per-app `.env`/secret files, `0600`, separate owners; never shared; rotated independently | No secrets in Git (D-002) |
| Media (G-8) | S3-compatible store with one bucket + credential pair per app; livestock bucket versioned; signed URLs served via proxy | Backed up independently |
| Deployment (G-1) | Separate repos (`KK-Farm` = platform; website elsewhere), separate pipelines, separate release tags; deploying one never restarts the other | Blue/green or rolling restart per app |
| Real-time & workers (G-5) | `realtime` and `worker` are separate processes/containers from `api`, each independently restartable and scalable (e.g. 2 workers) | Allows moving `realtime` to its own VM later |
| Backups (G-6) | Per-app schedules: livestock DB — WAL archiving + nightly base backup (RPO ≤ 1 h); website DB — nightly dump; media buckets — incremental sync; retention 30/90/365 days; **separate restore runbooks, tested quarterly** | Restore of one app never touches the other |
| Monitoring & logs (G-7) | One VM-level metrics agent + log shipper, but **separate dashboards, alert rules and log streams** per app; health endpoints `/healthz`, `/readyz` per service; uptime checks per hostname | Alerts route to the owner (and later ops) |
| Resource limits (G-4) | Livestock stack reserved ≥ 60 % CPU/RAM; website capped; DB `shared_buffers`/connections sized per cluster | Prevents a website traffic spike from slowing scans |
| TLS & headers | Automatic certificates at the proxy; HSTS; CSP per app; WebSocket upgrade only on `app.`/`rt.` hosts | — |

## 4. Portability (G-9): "move without redesign"

Everything that locates a dependency is **configuration, not code**:

| Dependency | Configured by | Move procedure |
|------------|---------------|----------------|
| PostgreSQL | `DATABASE_URL` | Base backup + WAL → restore on new VM → switch URL → restart `api/worker/realtime` |
| Cache/broker | `REDIS_URL` | Start new instance → switch URL (cache is rebuildable; queue drains first) |
| Object storage | `S3_ENDPOINT/BUCKET/KEYS` | `rclone sync` bucket → switch endpoint |
| Real-time server | `REALTIME_URL` (client) + proxy route | Run on another host; proxy routes `rt.` host there |
| Whole livestock app | Compose project | Copy project + restore data + DNS change |

A **portability drill** (restore the livestock app from backups onto a fresh VM and run the E2E suite) is part of the pre-production checklist and repeated yearly.

## 5. Sizing guidance (initial, to confirm with Q-INF-1)

| Component | Starting point |
|-----------|----------------|
| VM | 4 vCPU, 8–16 GB RAM, 160+ GB SSD, Linux LTS |
| Livestock DB | 2 GB RAM budget; grows ~1 GB/year at 2,000 animals |
| Media | ~50 GB for 50,000 photos (master ≤ 500 kB + variants) |
| Headroom | Keep 30 % free; alert at 80 % disk |

## 6. What is **not** decided here

- Cloud provider / on-prem / existing PyroNet infrastructure (Q-NFR-3; brief forbids assuming PyroNet infra).
- Containers vs. systemd — recommended in TECHNOLOGY_EVALUATION.
- Whether the website shares the object store or uses plain files.

## 7. Open questions

| ID | Question |
|----|----------|
| Q-INF-1 | VM specification, provider and region; who administers it? |
| Q-INF-2 | Domain names for website / app / real-time / media? |
| Q-INF-3 | Off-site backup destination (second VM, object storage, cloud bucket)? |
| Q-INF-4 | Maintenance window and who is on call? |
