# Decisions Log

Architecture Decision Record (ADR) style. One row per decision; longer rationale can go in `docs/decisions/<id>-<slug>.md` when needed. **Proposed** = awaiting CEO/engineering decision; **Accepted** = confirmed; **Superseded** = replaced by a later decision.

| ID | Date | Decision | Status | Rationale | Consequences |
|----|------|----------|--------|-----------|--------------|
| D-001 | 2026-11-07 | GitHub repository `PyroNet-Solutions/KK-Farm` is the single source of truth for all documentation and code. | Accepted (brief §8) | Mandated by project owner. | No work product lives only on a workstation or VM. |
| D-002 | 2026-11-07 | No deployment, no production infrastructure, no live hardware, no real data during the discovery phase. | Accepted (brief §8) | Risk control; requirements unvalidated. | Local sample-data environments only when coding starts; environments created in a later, separately authorised phase. |
| D-003 | 2026-11-07 | All changes via feature branches and Pull Requests; no PR merged without explicit owner authorization; no destructive Git operations. | Accepted (brief §8) | Traceability and control. | `main` is protected; reviewers never self-merge. |
| D-004 | 2026-11-07 | Animal identity is an immutable, never-reused `Animal.id`; RFID EPC/tag code is **never** the primary key. RFID is modelled as a tag entity with time-bounded assignments to animals. | Accepted (brief §3) | Tags are reusable physical objects; identity must outlive them. | `rfid_tags` + `rfid_assignments` tables; "scan → animal" resolves via the open assignment. |
| D-005 | 2026-11-07 | No domain record is ever hard-deleted. Leaving the farm, death, tag replacement, corrections are new events/entries. | Accepted (brief §3, §12) | Complete historical records; audit. | Status columns, `valid_to` dates, reversing entries; DB roles without DELETE on domain tables. |
| D-006 | 2026-11-07 | AI/intelligence is advisory only: it may create suggestions/alerts, never diagnoses, treatments, feeding-plan approvals or financial entries. Clinical suggestions can only be accepted by a Veterinarian. | Accepted (brief §4) | Veterinary accountability and safety. | Enforced by DB/server permissions, not only policy. |
| D-007 | 2026-11-07 | Requirements are maintained with explicit `[CONFIRMED]` / `[ASSUMED]` / `[UNKNOWN]` tags; assumptions must be confirmed before implementation. | Accepted (brief §9) | Prevents building on invented answers. | Every `[ASSUMED]` links to an open question. |
| D-008 | 2026-11-07 | Pending information listed in brief §10 will **not** be guessed; it is captured as open questions for the farm visit. | Accepted (brief §10) | Owner instruction. | OPEN_QUESTIONS.md is the visit checklist. |
| D-009 | 2026-11-07 | Documentation lives in `docs/`; README at root; research notes in `docs/research/`; detailed ADRs in `docs/decisions/`. | Accepted | Clean, discoverable structure. | Links in README map. |
| D-010 | 2026-11-07 | Architecture shape: modular monolith over a single relational (PostgreSQL-recommended) database, with a mobile-first client and a hardware-agnostic scan interface. | **Proposed** | Scale/complexity fit; ACID invariants; future splittability. | Confirm with stack decision (D-011). |
| D-011 | — | Technology stack (backend framework, mobile approach, hosting). | **Open** | Depends on Q-NFR-3, Q-RF-1…3, team familiarity. | Options in ARCHITECTURE_PROPOSAL.md §3–4. |
| D-012 | 2026-11-07 | Financial records are append-only; corrections are reversing entries. | **Proposed** (`[ASSUMED]` Q-FN-3) | Standard audit practice; satisfies FN-11. | Needs CEO acceptance. |
| D-013 | 2026-11-07 | Phase ordering: Identity/RFID → Vet & weight → Breeding → Feeding/ops → Finance → Intelligence. | **Proposed** | Identity underpins everything; vets create the data AI needs; finance is CEO-only initially. | See IMPLEMENTATION_ROADMAP.md. |
| D-014 | 2026-11-07 | Intelligence layer starts as deterministic, vet-tunable rules; ML/LLM only later on validated data. | **Proposed** (`[ASSUMED]` Q-AI-1) | Transparency; data quality. | Rule engine in Phase 2. |
| D-015 | 2026-11-07 | The `.gitignore` excludes spreadsheets, CSV, databases and `.env` files so real farm data cannot be committed accidentally. | Accepted | Brief §8 "no real data". | The Excel workbook is analysed locally; only the *analysis* is committed, never the file. |

## How to add a decision

1. Next ID, today's date, one-sentence decision.
2. Status: Proposed until the owner (or engineering lead for purely technical items) confirms.
3. Rationale: why this over the alternatives. Consequences: what it forces or forbids.
4. If a decision supersedes another, mark the old one *Superseded by D-xxx*.
