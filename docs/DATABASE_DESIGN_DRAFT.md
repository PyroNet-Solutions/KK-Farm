# Database Design Draft

**Status:** DRAFT v0.1 — illustrative schema to validate the domain model. Not to be implemented until the stack is chosen and the farm visit findings are approved. Written in PostgreSQL terms because that is the recommended engine (see [ARCHITECTURE_PROPOSAL.md](ARCHITECTURE_PROPOSAL.md)); the design is portable.

## 1. Conventions

| Convention | Rule |
|------------|------|
| Primary keys | `uuid` (client-generatable for offline sync). Human-readable numbers are separate columns. |
| Time | `timestamptz`. Two timestamps where relevant: `occurred_at` (real-world) and `recorded_at` (entered into system). |
| Authorship | `created_by uuid REFERENCES users` on every writable table; `updated_by` where updates are allowed. |
| Deletion | **No hard deletes** on domain tables. Status columns + `closed_at`. Reference tables may use `is_active`. |
| Temporal assignments | `valid_from`, `valid_to` (null = current). Exclusion constraints prevent overlaps. |
| Money | `numeric(14,2)` + `currency char(3)`; never float. |
| Audit | Trigger-based `audit_log` on identity, medical, feeding-plan and finance tables. |
| Naming | `snake_case`, singular table names avoided — plural (`animals`). |

## 2. Core identity

```sql
CREATE TABLE breeds (
  id            uuid PRIMARY KEY,
  name          text NOT NULL UNIQUE,
  description   text,
  default_gestation_days int,            -- [ASSUMED] Q-PB-2
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid NOT NULL
);

CREATE TYPE sex AS ENUM ('male','female');
CREATE TYPE animal_status AS ENUM ('active','left_farm','deceased');
CREATE TYPE animal_origin AS ENUM ('born_on_farm','purchased','gifted_in','unknown');

CREATE TABLE animals (
  id                    uuid PRIMARY KEY,                 -- IMMUTABLE, NEVER REUSED
  farm_number           text UNIQUE,                      -- human-readable; scheme [UNKNOWN] Q-AM-1
  name                  text,
  sex                   sex NOT NULL,
  reproductive_status   text NOT NULL DEFAULT 'intact',   -- intact | castrated  [ASSUMED] Q-AM-3
  breed_id              uuid NOT NULL REFERENCES breeds(id),
  birth_date            date,
  birth_date_is_estimate boolean NOT NULL DEFAULT false,
  age_estimation_method text,                             -- e.g. 'dentition', 'seller statement'
  origin                animal_origin NOT NULL,
  sire_id               uuid REFERENCES animals(id),
  dam_id                uuid REFERENCES animals(id),
  kidding_event_id      uuid,                             -- FK added after kidding_events
  status                animal_status NOT NULL DEFAULT 'active',
  exit_reason           text,                             -- sold | gifted | sacrificed | died | ...  Q-AM-7
  exit_date             date,
  notes                 text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  created_by            uuid NOT NULL,
  updated_at            timestamptz,
  updated_by            uuid,
  CHECK (sire_id IS DISTINCT FROM id AND dam_id IS DISTINCT FROM id),
  CHECK (status = 'active' OR exit_date IS NOT NULL)
);
-- Pedigree acyclicity (I-7) enforced in application + periodic check; recursive CTE for trees.
```

### RFID — separate from identity (AM-2)

```sql
CREATE TYPE tag_status AS ENUM ('in_stock','assigned','lost','destroyed');

CREATE TABLE rfid_tags (
  id              uuid PRIMARY KEY,
  tag_code        text NOT NULL UNIQUE,     -- EPC / transponder ID as read by the reader
  tag_type        text,                     -- 'LF_FDXB' | 'LF_HDX' | 'UHF_EPC'  [UNKNOWN] Q-RF-2
  printed_number  text,
  status          tag_status NOT NULL DEFAULT 'in_stock',
  created_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid NOT NULL
);

CREATE TABLE rfid_assignments (
  id              uuid PRIMARY KEY,
  animal_id       uuid NOT NULL REFERENCES animals(id),
  tag_id          uuid NOT NULL REFERENCES rfid_tags(id),
  valid_from      timestamptz NOT NULL,
  valid_to        timestamptz,              -- NULL = currently assigned
  assigned_by     uuid NOT NULL,
  unassigned_by   uuid,
  reason_assigned   text,                   -- 'initial' | 'replacement' | 'reassigned'
  reason_unassigned text,                   -- 'lost' | 'damaged' | 'animal_left' | 'animal_died' | 'reissued'
  created_at      timestamptz NOT NULL DEFAULT now(),
  EXCLUDE USING gist (tag_id WITH =,    tstzrange(valid_from, valid_to, '[)') WITH &&),  -- one animal per tag at a time (I-2)
  EXCLUDE USING gist (animal_id WITH =, tstzrange(valid_from, valid_to, '[)') WITH &&)   -- one tag per animal at a time (I-2)
);
CREATE INDEX ON rfid_assignments (tag_id) WHERE valid_to IS NULL;   -- fast "scan → animal" lookup
```

**Scan resolution query:** tag_code → `rfid_tags` → open `rfid_assignments` → `animals`. If no open assignment: show "tag not assigned" with option to assign.

## 3. Location

```sql
CREATE TABLE sheds (
  id uuid PRIMARY KEY, code text UNIQUE, name text NOT NULL,
  status text NOT NULL DEFAULT 'active',    -- planned | active | closed
  created_at timestamptz NOT NULL DEFAULT now(), created_by uuid NOT NULL
);
CREATE TABLE pens (                          -- [ASSUMED] Q-FM-1; a shed may have exactly one pen
  id uuid PRIMARY KEY, shed_id uuid NOT NULL REFERENCES sheds(id),
  name text NOT NULL, capacity int,
  UNIQUE (shed_id, name)
);
CREATE TABLE location_assignments (
  id uuid PRIMARY KEY,
  animal_id uuid NOT NULL REFERENCES animals(id),
  pen_id    uuid NOT NULL REFERENCES pens(id),
  valid_from timestamptz NOT NULL, valid_to timestamptz,
  moved_by uuid NOT NULL, reason text,
  EXCLUDE USING gist (animal_id WITH =, tstzrange(valid_from, valid_to, '[)') WITH &&)
);
```

## 4. Unified timeline

```sql
CREATE TABLE animal_events (
  id            uuid PRIMARY KEY,
  animal_id     uuid NOT NULL REFERENCES animals(id),
  event_type    text NOT NULL,     -- registered | tag_assigned | moved | weighed | observed | examined | treated | vaccinated | heat | mated | preg_check | kidded | sold | died | note ...
  occurred_at   timestamptz NOT NULL,
  recorded_at   timestamptz NOT NULL DEFAULT now(),
  recorded_by   uuid NOT NULL,
  ref_table     text,              -- which detail table
  ref_id        uuid,              -- which row
  summary       text,              -- short human-readable line for the timeline
  payload       jsonb              -- snapshot of key values at the time
);
CREATE INDEX ON animal_events (animal_id, occurred_at DESC);
```
Written by application services in the same transaction as the detail record. Append-only.

## 5. Weight

```sql
CREATE TABLE weight_records (
  id uuid PRIMARY KEY,
  animal_id uuid NOT NULL REFERENCES animals(id),
  measured_at timestamptz NOT NULL,
  weight_kg numeric(6,2) NOT NULL CHECK (weight_kg > 0),
  method text NOT NULL DEFAULT 'scale',    -- scale | tape | estimate
  context text,                            -- routine | birth | weaning | pre_sale | post_illness
  measured_by uuid NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  notes text
);
CREATE INDEX ON weight_records (animal_id, measured_at);
-- ADG is computed, never stored: (w2 - w1) / days_between.
```

## 6. Veterinary

```sql
CREATE TABLE health_observations (
  id uuid PRIMARY KEY,
  animal_id uuid REFERENCES animals(id),     -- nullable: group observation
  pen_id    uuid REFERENCES pens(id),
  observed_at timestamptz NOT NULL, observed_by uuid NOT NULL,
  symptoms text[] , severity text NOT NULL DEFAULT 'low',   -- low | medium | high | critical
  notes text, photo_ids uuid[],
  recorded_at timestamptz NOT NULL DEFAULT now(),
  CHECK (animal_id IS NOT NULL OR pen_id IS NOT NULL)
);

CREATE TABLE examinations (
  id uuid PRIMARY KEY,
  animal_id uuid NOT NULL REFERENCES animals(id),
  vet_id uuid NOT NULL,                       -- must hold Veterinarian role at write time (I-4)
  examined_at timestamptz NOT NULL,
  triggered_by text,                          -- observation | schedule | alert | follow_up | routine
  observation_id uuid REFERENCES health_observations(id),
  temperature_c numeric(4,1), body_condition_score numeric(2,1),
  findings text, next_follow_up_at timestamptz,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE diagnoses (
  id uuid PRIMARY KEY,
  examination_id uuid NOT NULL REFERENCES examinations(id),
  condition_code text,                        -- vocabulary [UNKNOWN] Q-VT-8
  condition_text text NOT NULL,
  certainty text,                             -- suspected | confirmed
  notes text
);

CREATE TABLE medicines (
  id uuid PRIMARY KEY, name text NOT NULL, unit text NOT NULL,
  default_withdrawal_days int, requires_vet boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE treatments (
  id uuid PRIMARY KEY,
  examination_id uuid NOT NULL REFERENCES examinations(id),
  animal_id uuid NOT NULL REFERENCES animals(id),
  prescribed_by uuid NOT NULL,                -- vet (I-4)
  medicine_id uuid NOT NULL REFERENCES medicines(id),
  dose numeric(10,3) NOT NULL, dose_unit text NOT NULL, route text,
  frequency text, start_at timestamptz NOT NULL, end_at timestamptz,
  withdrawal_until date,                      -- [ASSUMED] Q-VT-2
  status text NOT NULL DEFAULT 'active',      -- active | completed | stopped
  notes text
);

CREATE TABLE medicine_administrations (
  id uuid PRIMARY KEY,
  treatment_id uuid NOT NULL REFERENCES treatments(id),
  given_at timestamptz NOT NULL, given_by uuid NOT NULL,
  dose_given numeric(10,3), notes text,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE preventive_care_records (
  id uuid PRIMARY KEY,
  animal_id uuid NOT NULL REFERENCES animals(id),
  care_type text NOT NULL,                    -- vaccination | deworming | hoof_trim | ...
  product text, given_at timestamptz NOT NULL, given_by uuid NOT NULL,
  next_due_at date, notes text
);

CREATE TABLE preventive_care_schedules (     -- rules, vet-maintained
  id uuid PRIMARY KEY, care_type text NOT NULL, product text,
  applies_breed_id uuid REFERENCES breeds(id), applies_sex sex,
  first_due_age_days int, repeat_every_days int, is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE health_alerts (
  id uuid PRIMARY KEY,
  animal_id uuid REFERENCES animals(id),
  alert_type text NOT NULL, severity text NOT NULL,
  source text NOT NULL,                       -- rule | vet | observation | ai_suggestion
  rule_id text, message text NOT NULL,
  raised_at timestamptz NOT NULL DEFAULT now(),
  acknowledged_by uuid, acknowledged_at timestamptz,
  resolved_by uuid, resolved_at timestamptz, resolution text
);
```

## 7. Breeding

```sql
CREATE TABLE heat_observations (
  id uuid PRIMARY KEY, animal_id uuid NOT NULL REFERENCES animals(id),
  observed_at timestamptz NOT NULL, observed_by uuid NOT NULL,
  signs text[], intensity text, notes text
);

CREATE TABLE mating_events (
  id uuid PRIMARY KEY,
  dam_id uuid NOT NULL REFERENCES animals(id),
  sire_id uuid REFERENCES animals(id),        -- NULL if unknown/group  [ASSUMED] Q-PB-1
  mated_at timestamptz NOT NULL,
  method text NOT NULL DEFAULT 'natural',     -- natural | ai
  mating_type text NOT NULL DEFAULT 'controlled', -- controlled | group
  expected_kidding_at date,                   -- derived at insert from breed gestation
  recorded_by uuid NOT NULL, notes text,
  outcome text                                -- open | pregnant | not_pregnant | kidded | aborted
);

CREATE TABLE pregnancy_checks (
  id uuid PRIMARY KEY, mating_event_id uuid NOT NULL REFERENCES mating_events(id),
  checked_at timestamptz NOT NULL, checked_by uuid NOT NULL,   -- vet
  method text, result text NOT NULL,          -- pregnant | not_pregnant | inconclusive
  fetus_count_estimate int, notes text
);

CREATE TABLE kidding_events (
  id uuid PRIMARY KEY,
  dam_id uuid NOT NULL REFERENCES animals(id),
  mating_event_id uuid REFERENCES mating_events(id),
  kidded_at timestamptz NOT NULL, attended_by uuid,
  difficulty text, total_born int NOT NULL, born_alive int NOT NULL, stillborn int NOT NULL,
  notes text,
  CHECK (born_alive + stillborn = total_born)
);
ALTER TABLE animals ADD FOREIGN KEY (kidding_event_id) REFERENCES kidding_events(id);
```

Family tree: `WITH RECURSIVE ancestors AS (...)` over `sire_id`/`dam_id`; depth-limited (e.g. 5 generations) for UI.

## 8. Feeding

```sql
CREATE TABLE feed_items (id uuid PRIMARY KEY, name text NOT NULL, unit text NOT NULL, category text, is_active boolean NOT NULL DEFAULT true);

CREATE TABLE feeding_groups (
  id uuid PRIMARY KEY, name text NOT NULL, pen_id uuid REFERENCES pens(id),
  criteria jsonb,                              -- {age_min_days, age_max_days, sex, pregnant, lactating, weight_min, weight_max, health_flag}
  status text NOT NULL DEFAULT 'active', created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE feeding_group_memberships (
  id uuid PRIMARY KEY, animal_id uuid NOT NULL REFERENCES animals(id),
  group_id uuid NOT NULL REFERENCES feeding_groups(id),
  valid_from timestamptz NOT NULL, valid_to timestamptz,
  assigned_by uuid NOT NULL, reason text,      -- rule | manual | vet
  EXCLUDE USING gist (animal_id WITH =, tstzrange(valid_from, valid_to, '[)') WITH &&)
);

CREATE TABLE feeding_plans (
  id uuid PRIMARY KEY,
  group_id uuid REFERENCES feeding_groups(id),
  animal_id uuid REFERENCES animals(id),       -- individual plan (NF-3)
  version int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft',        -- draft | pending_approval | approved | rejected | superseded
  effective_from date, effective_to date,
  created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((group_id IS NULL) <> (animal_id IS NULL))
);
CREATE TABLE feeding_plan_items (
  id uuid PRIMARY KEY, plan_id uuid NOT NULL REFERENCES feeding_plans(id),
  feed_item_id uuid NOT NULL REFERENCES feed_items(id),
  quantity_per_head numeric(8,3) NOT NULL, unit text NOT NULL, times_per_day int NOT NULL, notes text
);
CREATE TABLE feeding_plan_approvals (         -- NF-4
  id uuid PRIMARY KEY, plan_id uuid NOT NULL REFERENCES feeding_plans(id),
  decision text NOT NULL,                      -- approved | rejected
  decided_by uuid NOT NULL, decided_at timestamptz NOT NULL DEFAULT now(), comment text
);
CREATE TABLE feeding_compliance_logs (
  id uuid PRIMARY KEY, group_id uuid NOT NULL REFERENCES feeding_groups(id),
  plan_id uuid REFERENCES feeding_plans(id),
  session text NOT NULL,                       -- morning | midday | evening
  fed_at timestamptz NOT NULL, fed_by uuid NOT NULL,
  status text NOT NULL,                        -- done | partial | missed
  notes text, photo_ids uuid[]
);
```

## 9. Users, roles, operations

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY, full_name text NOT NULL, phone text UNIQUE, login text UNIQUE NOT NULL,
  password_hash text NOT NULL, pin_hash text,  -- quick re-auth on shared devices
  preferred_language text NOT NULL DEFAULT 'ur',
  is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE roles (id text PRIMARY KEY, name text NOT NULL);           -- ceo, farm_manager, veterinarian, caretaker, feeding, cleaning, finance
CREATE TABLE permissions (id text PRIMARY KEY, description text);       -- e.g. 'animal.read', 'treatment.write', 'finance.read'
CREATE TABLE role_permissions (role_id text REFERENCES roles(id), permission_id text REFERENCES permissions(id), PRIMARY KEY (role_id, permission_id));
CREATE TABLE user_roles (
  user_id uuid REFERENCES users(id), role_id text REFERENCES roles(id),
  granted_by uuid NOT NULL, valid_from timestamptz NOT NULL DEFAULT now(), valid_to timestamptz,
  PRIMARY KEY (user_id, role_id, valid_from)
);
CREATE TABLE user_permission_overrides (     -- configurable delegation (FN-2)
  user_id uuid REFERENCES users(id), permission_id text REFERENCES permissions(id),
  granted boolean NOT NULL, granted_by uuid NOT NULL, valid_from timestamptz NOT NULL DEFAULT now(), valid_to timestamptz,
  PRIMARY KEY (user_id, permission_id, valid_from)
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY, task_type text NOT NULL,          -- feeding | cleaning | observation | weighing | custom
  target_type text, target_id uuid,                      -- pen | group | animal
  assigned_to uuid REFERENCES users(id), assigned_by uuid NOT NULL,
  due_at timestamptz NOT NULL, status text NOT NULL DEFAULT 'open',  -- open | done | missed | cancelled
  completed_at timestamptz, completed_by uuid, notes text, photo_ids uuid[],
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE activity_logs (                  -- operational history (FM-7)
  id uuid PRIMARY KEY, actor_id uuid NOT NULL, activity text NOT NULL,
  target_type text, target_id uuid, occurred_at timestamptz NOT NULL DEFAULT now(), details jsonb
);
```

## 10. Finance (append-only)

```sql
CREATE TABLE suppliers (id uuid PRIMARY KEY, name text NOT NULL, supplier_type text, phone text, address text, notes text, is_active boolean NOT NULL DEFAULT true);

CREATE TABLE expenses (
  id uuid PRIMARY KEY,
  category text NOT NULL,                      -- feed | medicine | veterinary | employee | utilities | maintenance | animal_purchase | other
  supplier_id uuid REFERENCES suppliers(id),
  amount numeric(14,2) NOT NULL CHECK (amount > 0), currency char(3) NOT NULL DEFAULT 'PKR',
  incurred_on date NOT NULL, description text, attachment_ids uuid[],
  recorded_by uuid NOT NULL, recorded_at timestamptz NOT NULL DEFAULT now(),
  reverses_expense_id uuid REFERENCES expenses(id),   -- correction = reversing entry (I-6)
  status text NOT NULL DEFAULT 'posted'
);
CREATE TABLE expense_allocations (            -- FN-8, FN-9
  id uuid PRIMARY KEY, expense_id uuid NOT NULL REFERENCES expenses(id),
  target_type text NOT NULL,                   -- animal | shed | feeding_group | farm
  target_id uuid, share numeric(14,2) NOT NULL, method text   -- direct | per_head_day | manual
);
CREATE TABLE payments (
  id uuid PRIMARY KEY, direction text NOT NULL,          -- in | out
  amount numeric(14,2) NOT NULL CHECK (amount > 0), currency char(3) NOT NULL DEFAULT 'PKR',
  method text NOT NULL,                                   -- cash | bank | mobile_wallet | other
  paid_on date NOT NULL, counterparty text, reference text,
  linked_type text, linked_id uuid,                       -- expense | animal_transaction
  recorded_by uuid NOT NULL, recorded_at timestamptz NOT NULL DEFAULT now(),
  reverses_payment_id uuid REFERENCES payments(id)
);
CREATE TABLE animal_transactions (
  id uuid PRIMARY KEY, animal_id uuid NOT NULL REFERENCES animals(id),
  transaction_type text NOT NULL,              -- purchase | sale | gift_in | gift_out | sacrifice
  counterparty text, amount numeric(14,2), currency char(3) DEFAULT 'PKR',
  occurred_on date NOT NULL, document_ids uuid[], recorded_by uuid NOT NULL, recorded_at timestamptz NOT NULL DEFAULT now()
);
```

Lifetime cost of a goat = Σ `expense_allocations.share` where target = animal (+ purchase price). Allocation rule `[ASSUMED]` Q-FN-2.

## 11. Audit & files

```sql
CREATE TABLE audit_log (
  id bigserial PRIMARY KEY,
  actor_id uuid, actor_role text, action text NOT NULL,     -- insert | update | status_change
  table_name text NOT NULL, row_id uuid NOT NULL,
  before jsonb, after jsonb, at timestamptz NOT NULL DEFAULT now(),
  device_id text, ip inet
);
-- Populated by triggers on: animals, rfid_assignments, examinations, diagnoses, treatments,
-- medicine_administrations, feeding_plans, feeding_plan_approvals, expenses, payments,
-- animal_transactions, user_roles, user_permission_overrides. INSERT-only; no UPDATE/DELETE grants.

CREATE TABLE files (
  id uuid PRIMARY KEY, kind text NOT NULL,          -- photo | bill | receipt | document
  storage_key text NOT NULL, mime text, size_bytes bigint,
  uploaded_by uuid NOT NULL, uploaded_at timestamptz NOT NULL DEFAULT now(),
  access_domain text NOT NULL                       -- animal | finance | ops  (drives permission check)
);
```

## 12. Scaling notes

- All hot paths are indexed by `(animal_id, time)`; herd size grows linearly, queries stay per-animal.
- Partial index on open `rfid_assignments` keeps scan lookup O(log n) regardless of history size.
- `animal_events` and `audit_log` can be partitioned by month when volume warrants; nothing in the design depends on their size.
- No table has a "shed" or "farm" assumption that would break with 6 sheds or 6,000 goats. A `farm_id` column could be added to top-level entities later for multi-farm without changing relationships.

## 13. Open design questions

| # | Question | Linked |
|---|----------|--------|
| D-1 | Vocabulary tables for symptoms/diagnoses vs. free text | Q-VT-8 |
| D-2 | Lactation / milk records needed? | Q-AM-5 |
| D-3 | Cost allocation method | Q-FN-2 |
| D-4 | Pens: real or always 1 per shed? | Q-FM-1 |
| D-5 | Offline client IDs: UUIDv7 for time ordering? | engineering |
| D-6 | Keep `animal_events` as a table or a view over detail tables? (table recommended for offline sync and timeline speed) | engineering |
