# Real-Time Architecture

**Status:** Proposed design (D-019 confirms real-time as a core requirement). Transport/library versions are selected in [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md); this document fixes the requirements, the evaluation and the design that any stack must satisfy.

## 1. Requirements (from owner direction, 2026-11-07)

| ID | Live behaviour | Who must see it | Must **not** see it |
|----|----------------|-----------------|---------------------|
| RT-1 | Vet updates a health record → authorised dashboard updates immediately | CEO, manager, vets | feeding/cleaning staff, finance-only users |
| RT-2 | Employee scans an RFID tag → goat profile appears immediately on that device | the scanning user | — |
| RT-3 | Goat moved between sheds → live shed/pen views update | anyone viewing those sheds with animal read permission | — |
| RT-4 | New birth, breeding event, treatment, feeding confirmation, alert → appears without refresh | per permission matrix | unauthorised roles |
| RT-5 | Dashboard figures and activity feeds update automatically | per dashboard permission | — |
| RT-6 | Financial figures update live for finance-authorised users only | CEO, finance | **everyone else** |
| RT-7 | Sub-second visible updates on healthy networks; measured | — | — |
| RT-8 | Reliable delivery: reconnection, no loss, no duplicates; authenticated channels; permission checks on every subscription | — | — |

## 2. Transport evaluation

| Option | How it works | Pros | Cons | Verdict |
|--------|--------------|------|------|---------|
| **WebSockets** | Persistent bidirectional connection | Lowest latency; one connection for all channels; presence; works for push + client acks; universal browser/Android support | Needs a stateful WS server (or managed service); proxies must be configured for upgrade; connection auth must be re-checked on reconnect | **Primary transport** |
| **Server-Sent Events (SSE)** | One-way HTTP stream | Simple; auto-reconnect with `Last-Event-ID` built in; passes through most proxies | One-way only; per-origin connection limits on HTTP/1.1 (6) unless HTTP/2; text only | **Fallback** when WS is blocked |
| **Long polling** | Repeated HTTP requests | Works anywhere | Latency and server load; not sub-second at scale | Last-resort fallback only |
| Push notifications (FCM/Web Push) | OS-level | Reaches closed app | Not for in-app live views; delivery not guaranteed or timely | Separate channel for critical alerts (later, Q-RB-3) |

**Decision (proposed):** WebSockets with automatic fallback to SSE, behind the same reverse proxy, with a pub/sub broker so the WS server and the API/worker processes can scale independently.

## 3. Event-driven design

```
 API write (transaction)                     Worker                 Broker        WS server            Clients
 ┌──────────────────────────┐   poll/notify  ┌────────┐   publish   ┌──────┐   fan-out   ┌───────────┐  frames  ┌────────┐
 │ 1. domain write          │ ─────────────► │ relay  │ ──────────► │ pub/ │ ──────────► │ channel   │ ───────► │ app    │
 │ 2. audit_log row         │                │ outbox │             │ sub  │             │ authz     │          │ cache  │
 │ 3. animal_events row     │                └────────┘             └──────┘             │ sequence  │          │ update │
 │ 4. outbox row (same txn) │                                                            └───────────┘          └────────┘
 └──────────────────────────┘
```

### 3.1 Transactional outbox
Every state change that must be visible live writes an **outbox** row in the *same database transaction* as the domain change. A relay worker publishes outbox rows to the broker and marks them sent. This guarantees: no "ghost" events for rolled-back writes, and no lost events if the broker is down (they wait in the outbox).

### 3.2 Event envelope (minimal by design)
```json
{
  "id": "01J…",                 // ULID/UUIDv7 — globally unique, time-ordered
  "seq": 48213,                 // per-channel monotonic sequence (gap detection)
  "type": "animal.health.examination.created",
  "occurred_at": "2026-11-07T10:21:33Z",
  "channel": "animals.3f9c…",
  "actor": {"id": "…", "role": "veterinarian"},
  "subject": {"animal_id": "3f9c…", "shed_id": "…"},
  "summary": "Examination recorded",
  "version": 17                 // entity version for optimistic refresh
}
```
**No sensitive payload in broadcasts.** The frame tells the client *what changed*; the client re-fetches details through the normal, permission-checked API (or from a server-pushed patch only for public-to-the-channel fields). Financial amounts, diagnoses and treatment details are never in a fan-out frame.

### 3.3 Channel model

| Channel | Who may subscribe | Carries |
|---------|-------------------|---------|
| `user.{id}` | that user only | scan results for their device, their tasks, personal alerts |
| `animals.{id}` | users with `animal.read` (scoped by shed if scoped roles exist) | profile/timeline changes |
| `sheds.{id}` | users with `animal.read` for that shed | movements, counts, group changes |
| `ops.activity` | manager, CEO, vets | activity feed |
| `vet.alerts` | vets, manager, CEO | health alerts |
| `feeding.{group_id}` | feeding staff, manager, vets | plan approvals, compliance |
| `dashboard.ops` | roles with ops dashboard permission | aggregate deltas |
| `finance.*` | **CEO, finance role only** | finance aggregate deltas |

Authorisation uses the **same permission resolver as the API** (`effective(user)` in [SECURITY_AND_RBAC.md](SECURITY_AND_RBAC.md)); it runs on every `subscribe` and again on every reconnect. Permission changes (role revoked) force-close affected subscriptions within seconds.

### 3.4 Reliability
- **At-least-once** delivery from broker to client; clients de-duplicate by `id`.
- **Sequence numbers per channel**: a gap triggers a `replay?since=seq` request answered from a retained event log (outbox retained ≥ 24 h) — reconnect is therefore lossless.
- **Heartbeats** every 25 s; client reconnects with exponential backoff + jitter; UI shows a subtle "reconnecting" indicator (animated status, per UX direction).
- **Ordering** guaranteed per channel (per animal), not globally.
- **Backpressure**: slow clients get coalesced "refresh" hints instead of unbounded queues.
- **Idempotent client updates**: entity `version` prevents stale overwrites.

### 3.5 Scan → profile path (RT-2)
1. Scan source emits `TagScanned` locally → app resolves via cached assignment map if present (**instant**), else calls `GET /scan/resolve?tag=…` (p95 ≤ 50 ms server).
2. Profile renders from cache/API; subscribes to `animals.{id}`.
3. Subsequent changes to that goat arrive live.
No round trip through the broker is needed for the scanning device itself; the broker informs *other* viewers.

### 3.6 Offline interplay
If offline capture (Q-FM-3) is confirmed: queued local writes sync on reconnect through the normal API; the resulting domain events then flow to other clients as usual. The device's own UI updates optimistically.

## 4. Security checklist

- WS/SSE endpoints require the same auth token as the API; tokens are short-lived; reconnect re-authenticates.
- Subscribe is authorised server-side per channel; unauthorised → rejected and logged.
- No PII/financial values in frames; details fetched via API.
- Rate limits per connection; max subscriptions per user; origin checks.
- Audit: subscription denials and forced closes logged.
- Finance channels isolated by name prefix and a separate permission domain.

## 5. Measurement

- Each frame carries `occurred_at`; client records `received_at` and `rendered_at`; the difference feeds RUM.
- Nightly latency probe (see [PERFORMANCE_ACCEPTANCE_CRITERIA.md](PERFORMANCE_ACCEPTANCE_CRITERIA.md) §3).
- Fault-injection test: kill connection mid-stream → assert gap-fill and no duplicates.

## 6. Tests required (see TESTING_STRATEGY R-7)

- Unauthorised subscribe rejected for every channel class × role.
- Role revoked → subscription closed.
- Outbox: rolled-back transaction emits nothing; broker outage → events delivered after recovery.
- Reconnect replay: no loss, no duplicates, correct order.
- Latency under load within targets.

## 7. Open questions

| ID | Question |
|----|----------|
| Q-RT-1 | Which dashboards/screens must be live in Phase 1 (minimum: profile, shed view, ops activity, vet alerts)? |
| Q-RT-2 | Do critical alerts also need push/SMS/WhatsApp when the app is closed? (links Q-RB-3) |
