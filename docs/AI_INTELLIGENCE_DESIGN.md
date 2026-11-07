# AI-Assisted Farm Intelligence — Design

**Status:** Design v0.1. Builds on confirmed requirements AI‑1…AI‑4; the phasing (rules first, ML later) is `[ASSUMED]` → Q-AI-1.

## 1. Purpose, in one sentence

Help the vets and caretakers notice sooner which goats need attention — never decide for them.

## 2. Non-negotiable guard-rails (from the brief)

| Rule | Implementation |
|------|----------------|
| AI assists; never replaces veterinary judgment | All outputs are *suggestions* with a reason; a human accepts, dismisses or acts. |
| AI never prescribes medicine | The intelligence service has **no write permission** on `treatments`, `medicine_administrations`. |
| AI never diagnoses disease | No write on `diagnoses`. Suggestions say "shows a pattern worth examining", never "has disease X". |
| AI never overrides vet instructions | Suggestions are suppressed when a vet has an active, contradicting instruction (e.g. "do not weigh — fracture") and never change plan status. |
| Vet accountability | Clinical suggestions can only be *accepted* by a Veterinarian; acceptance creates a normal vet-authored record. |

These are enforced by database permissions and server checks (see [SECURITY_AND_RBAC.md](SECURITY_AND_RBAC.md) §8), not just by policy.

## 3. Three layers, built in order

### Layer 1 — Deterministic rules (Phase 2 of roadmap)
Transparent "if-then" checks the vet can read and tune. No machine learning. Examples:

| Area | Example rule (thresholds are placeholders — vets set them, Q-WT-5, Q-VT-5) | Output |
|------|------|--------|
| Weight | Weight loss > X % over Y days; ADG below breed/age peer median by Z % for 2 consecutive weighings; no weighing in N days | "Needs weight monitoring" / "Needs vet examination" |
| Preventive care | Vaccination/deworming due per schedule; overdue | "Preventive care due" list per day |
| Breeding | Heat observed but no mating recorded in 24 h; mating + ~21 days with no return-to-heat and no pregnancy check; expected kidding within 7 days; pregnancy confirmed but no kidding by expected + 7 days | "Breeding follow-up pending" |
| Health | Observation severity ≥ high with no examination in 12 h; treatment active but no dose logged today; follow-up date passed | "Needs vet examination" / "Treatment compliance" |
| Feeding | Animal matches a different feeding group's criteria than the one it is in (pregnancy confirmed, weight band crossed, lactation started); individual plan expired | "Review feeding group" / "Needs special feeding" (requires vet approval to change) |
| Data quality | Animal with no weight for 60 days; tag scanned but assignment closed; kid with no sire | "Data gap" (manager) |

Each rule has: ID, description in plain language, parameters, owner (vet/manager), enabled flag, and a log of every time it fired.

### Layer 2 — Statistical insight (Phase 4)
Computed on top of clean data; still explainable:
- Growth curves per breed/sex/age; percentile of each animal.
- Doe fertility and kid survival vs. herd; buck offspring ADG ranking.
- Cost per kg gain per animal/group (with finance permission).
- Seasonal health patterns (which months, which sheds).
Output: dashboards and ranked lists for breeding selection ("quality, not quantity").

### Layer 3 — Learned models / LLM assistance (Phase 5+, optional)
Only if data volume and quality justify it:
- Anomaly detection on weight/health sequences.
- Natural-language summaries of an animal's history for the vet ("in the last 90 days…"), generated from structured records with citations back to the records.
- Mating suggestions optimising for selected traits while respecting relatedness limits — presented as a *shortlist*, never auto-booked.

Any LLM use must: run on structured data we already hold, cite the records it used, never be shown without a "suggestion — verify" label, and never be used for prescribing or diagnosis.

## 4. Suggestion lifecycle

```
rule/model fires ─► suggestion created (type, animal, reason, evidence links)
      │
      ├─► shown to the right role (vet for clinical, manager for ops, feeding staff for feeding)
      │
      ├─► ACCEPT  → creates a normal human-authored action (exam scheduled, task, plan draft)
      ├─► DISMISS → reason recorded (false alarm / already handled / threshold wrong)
      └─► EXPIRE  → after N days, logged
```
Every suggestion keeps: when, why (rule + data snapshot), who acted, what they did. Dismiss reasons feed back into threshold tuning.

## 5. Data the intelligence layer reads

Medical history · weight records · breeding events · feeding memberships & plans · age/breed/sex · health observations · preventive care · location. It reads **no** financial data unless the user viewing has finance permission (cost-per-kg insights).

## 6. Quality of input decides everything

Rules are only as good as the records. Prerequisites before Layer 1 is useful:
- Regular weighing cadence (Q-WT-4).
- Vet-defined schedules and thresholds (Q-VT-5, Q-WT-5).
- Migrated history validated (pedigree, past treatments).
- Breeds with gestation lengths set.

## 7. Evaluation

- For each rule: precision = accepted / fired. Rules below an agreed precision are tuned or disabled by the vet.
- Monthly review with the vets: which alerts helped, which were noise.
- No model goes live without a side-by-side period where it only *logs* what it would have flagged.

## 8. Open questions

| Question | Link |
|----------|------|
| Rules-first acceptable? | Q-AI-1 |
| Who approves thresholds? | Q-AI-2 |
| Which traits define "quality" for selection ranking? | Q-PB-9 |
| Alert delivery channel | Q-RB-3 |
