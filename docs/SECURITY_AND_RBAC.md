# Security and Role-Based Access Control

**Status:** Draft v0.1. Roles are *candidates* per the brief; actual responsibilities are confirmed after the farm visit (Q-RB-1).

## 1. Principles

1. **Server enforces, UI reflects.** Hiding a button is not security. Every API call checks permission.
2. **Least privilege by default.** A new user has no permissions until a role is granted.
3. **Permissions are configurable** (FN-2): roles are bundles of permissions; the CEO can grant/revoke individual permissions per user (overrides), with history.
4. **Professional gates are role-locked, not configurable away.** Diagnosing and prescribing require the Veterinarian role; approving a feeding plan requires Veterinarian or Nutritionist. These cannot be granted to a caretaker by override.
5. **Everything is attributable.** No shared accounts. Shared *devices* are fine; shared *logins* are not.
6. **Nothing medical or financial is ever deleted.** Corrections are new records.
7. **Finance is a separate domain** with its own permission namespace and audit.
8. **No secrets in Git.** Ever.

## 2. Candidate roles and what they do

| Role | Typical person | Primary job in the app |
|------|----------------|------------------------|
| **CEO / Owner** | Owner | Sees everything; approves money; manages users and permissions; final say on breeding strategy |
| **Farm Manager** | Senior staff | Runs daily operations: tasks, transfers, registers animals, weighs, assigns tags; sees operational reports; no financial posting unless delegated |
| **Veterinarian** | Permanent doctors | Examinations, diagnoses, treatments, preventive care, pregnancy checks, approves feeding plans, defines alert thresholds |
| **Caretaker** | Shed staff | Scans goats, records observations, weights, heat signs, kidding; completes tasks; cannot diagnose or prescribe |
| **Feeding Employee** | Feeding staff | Sees today's feeding plan per group; logs feeding compliance; reports feed issues |
| **Cleaning Employee** | Cleaning staff | Sees cleaning tasks; marks done with optional photo |
| **Finance Employee** | Future | Records expenses/payments, suppliers, bills; views financial reports — *only* once the CEO delegates |

`[ASSUMED]` one person may hold several roles (Q-RB-2).

## 3. Permission matrix (draft)

Legend: **R** read · **W** write (create) · **A** approve/authorise · **M** manage (configure) · — none

| Permission domain | CEO | Manager | Vet | Caretaker | Feeding | Cleaning | Finance |
|-------------------|:---:|:-------:|:---:|:---------:|:-------:|:--------:|:-------:|
| **Animals** — identity, breed, status | R W M | R W | R | R | R | R | R (limited) |
| Animal exit (sold/died/gifted) | W A | W | W (death) | — | — | — | — |
| **RFID** — assign / reassign tags | W M | W | — | W (replace lost) | — | — | — |
| **Location** — transfers | W | W | — | W | — | — | — |
| **Weight** | R W | R W | R W | R W | — | — | — |
| **Health observation** (report concern) | R W | R W | R W | R W | R W | R W | — |
| **Examination / diagnosis / treatment** | R | R | **R W** | R (own animals) | — | — | — |
| **Medicine administration** (record a dose given) | R | R | R W | R W (if vet-instructed) `[ASSUMED]` Q-VT-1 | — | — | — |
| **Preventive care** records & schedules | R | R W | R W M | R W | — | — | — |
| **Health alerts** — acknowledge / resolve | R | R A | R A | R | R | — | — |
| **Breeding** — heat, mating, kidding | R W | R W | R W | R W | — | — | — |
| **Pregnancy check** | R | R | R W | R | — | — | — |
| **Pedigree** view | R | R | R | R | — | — | — |
| **Feeding groups** — membership | R W | R W | R W | R | R | — | — |
| **Feeding plans** — draft | R W | R W | R W | — | R | — | — |
| **Feeding plans** — approve | — | — | **A** | — | — | — | — |
| **Feeding compliance** log | R | R | R | R | R W | — | — |
| **Tasks** — assign | W M | W M | W | — | — | — | — |
| **Tasks** — complete own | W | W | W | W | W | W | W |
| **Users & roles** | M | R | — | — | — | — | — |
| **Permission overrides** | M | — | — | — | — | — | — |
| **Suppliers** | R W | R | R | — | — | — | R W |
| **Expenses / payments** — post | W | — (unless delegated) | — | — | — | — | W (delegated) |
| **Expenses / payments** — approve | A | — | — | — | — | — | — (configurable) |
| **Financial dashboard / reports** | R | — (unless delegated) | — | — | — | — | R |
| **Animal lifetime cost** | R | R `[ASSUMED]` | — | — | — | — | R |
| **Audit log** | R | — | R (medical only) | — | — | — | R (finance only) |
| **AI suggestions** | R | R | R A (clinical) | R (own) | R (feeding) | — | — |
| **Breeds, medicines, feed items** (reference data) | M | M | M (medicines) | — | — | — | — |

Cells marked **bold** are hard gates that overrides cannot change.

## 4. Permission model (technical)

```
user ──< user_roles >── role ──< role_permissions >── permission
  └──< user_permission_overrides (grant / revoke a single permission, with validity dates)
effective(user) = ∪ role permissions  + granted overrides  − revoked overrides  (hard gates excluded from overrides)
```

Permission IDs are strings like `animal.read`, `treatment.write`, `feeding_plan.approve`, `finance.payment.write`, `finance.report.read`, `user.manage`. The server checks `effective(user)` on every request; the mobile app caches it for UI only.

Scope dimension (later, if needed): a role can be limited to specific sheds (e.g. caretaker of Shed 2). Design keeps a `scope` column available on `user_roles`.

## 5. Authentication

| Concern | Proposal |
|---------|----------|
| Login | Phone number or username + password; set up by CEO/manager. |
| Shared devices (the RFID gun, a shed phone) | Short session timeout; **PIN re-auth** to switch user quickly without full logout; the active user is shown on every screen. |
| Device registration | Each device registered to the farm; lost device can be revoked. |
| Passwords | Hashed with a modern algorithm (argon2/bcrypt); minimum length; no reuse of defaults. |
| 2FA | Recommended for CEO and Finance roles (SMS/TOTP). `[ASSUMED]` |
| Session tokens | Short-lived access + refresh; revoked on role change or user deactivation. |

## 6. Audit trails

| What | How | Who can read |
|------|-----|--------------|
| Identity changes (animal, tag assignment, status) | `audit_log` trigger, before/after JSON | CEO, Manager |
| Medical writes (exam, diagnosis, treatment, dose) | `audit_log` + author stored on row | CEO, Vets |
| Feeding plan approvals | `feeding_plan_approvals` + `audit_log` | CEO, Vets, Manager |
| Financial entries | append-only tables + `audit_log` | CEO, Finance |
| Permission changes | `user_roles`, `user_permission_overrides` history + `audit_log` | CEO |
| Operational actions | `activity_logs` | CEO, Manager |

`audit_log` is INSERT-only at the database-permission level; the application DB user has no UPDATE/DELETE on it.

## 7. Data protection

- Personal data held: staff names, phones, logins; supplier contacts; financial figures. Minimise; no national ID numbers unless a legal need is confirmed.
- Files (bills, photos) served through authenticated, permission-checked URLs, never public links.
- Backups encrypted at rest; restore drills (future, deployment phase).
- Export of financial data limited to CEO/Finance and logged.

## 8. AI-specific controls

- The intelligence layer has **read** access to clinical/weight/breeding data and **write** access only to `health_alerts` (source = `ai_suggestion`) and suggestion tables.
- It has **no** permission on `diagnoses`, `treatments`, `feeding_plans` status, or finance.
- Every suggestion shows its reasoning data and requires a human (vet for clinical items) to accept or dismiss. See [AI_INTELLIGENCE_DESIGN.md](AI_INTELLIGENCE_DESIGN.md).

## 9. Repository & development security (this phase)

- No real data in the repo — sample/synthetic only.
- No credentials, API keys, hostnames of production systems.
- Branch protection on `main`; PRs required; merges only with explicit owner authorization.
- Dependency scanning and secret scanning to be enabled when code is added.

## 10. Open items

| Question | Link |
|----------|------|
| Who may record a dose given (caretaker under vet instruction)? | Q-VT-1 |
| Finance delegation limits / dual approval | Q-FN-4 |
| Multiple roles per person | Q-RB-2 |
| Shed-scoped roles needed? | Q-FM-1, Q-RB-1 |
| Notification channel for critical alerts | Q-RB-3 |
