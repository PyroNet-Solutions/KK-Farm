# Team Workflow, Roles and Approval Boundaries

**Status:** Accepted — owner instruction, 2026-11-07 (recorded as D-017 in [DECISIONS_LOG.md](DECISIONS_LOG.md)).
**Applies to:** every branch, PR, issue and decision in `PyroNet-Solutions/KK-Farm`.

## 1. Team

| Member | Role | Owns | Does **not** |
|--------|------|------|--------------|
| **Ammar** | Project Owner / CEO | Final business and technical decisions; approves architecture & stack, feature scope and priorities, requirement changes, **every PR merge**, production deployment and infrastructure, anything touching real farm data | — |
| **Claude Code** | Lead Software Engineer | Frontend & backend implementation; database implementation & migrations; APIs & integrations; mobile-responsive app; real-time functionality; RFID integration; goat profiles & photo management; UI/UX implementation & animations; automated test **code** (unit, integration, E2E, regression); GitHub Actions / CI **configuration code**; bug fixing & performance optimisation | Make final business decisions; approve major architectural changes on its own; merge; deploy |
| **ChatGPT** | GitHub Engineering Manager, Independent Reviewer & QA Lead | Repository organisation (issues, labels, milestones, progress & dependency tracking); independent review of every significant PR (security, business logic, data integrity, queries/indexes, auth/RBAC, race conditions, error handling, migrations, dependencies); **testing strategy and quality gates** (test plans per module, acceptance criteria, regression checklists, coverage requirements, CI result monitoring, failure triage, QA status & release-readiness report) | Merge; deploy; run commands on Claude's machine; see unpushed changes |

Claude **builds**; ChatGPT **independently verifies and manages GitHub quality**; Ammar **decides**.

## 2. Approval and safety boundaries

Neither Claude nor ChatGPT may independently:

- merge a PR;
- deploy to any environment the owner has not explicitly authorised;
- change live farm infrastructure;
- introduce real farm data into test environments;
- delete production records or modify production databases;
- change a major architecture decision without approval.

All merges and deployments require Ammar's explicit authorisation, given in GitHub (PR comment or review) so the record is permanent.

## 3. Feature workflow (every feature, no exceptions)

```
 1. Ammar + ChatGPT define/approve requirements
 2. ChatGPT creates/updates the GitHub issue: scope, acceptance criteria, test expectations
 3. Claude studies the issue; implements on a dedicated branch  (feat/<issue>-<slug>)
 4. Claude writes automated tests; updates CI config when needed
 5. Claude pushes; opens a PR referencing the issue ("Closes #N")
 6. ChatGPT reviews code, security, business logic, tests — independently
 7. ChatGPT checks GitHub Actions; reports problems
 8. Problems → ChatGPT posts actionable review comments / requests changes
 9. Claude fixes; pushes another commit; replies to each finding in the PR
10. ChatGPT verifies corrections; updates review + QA status
11. Ammar makes the final merge decision
```

A PR is **not** complete because it works on Claude's machine. It is complete when CI is green on GitHub, ChatGPT's review is resolved, and Ammar has authorised the merge.

## 4. Capability boundary

ChatGPT works only through the connected GitHub integration. It cannot see Claude's terminal, local files or unpushed commits. Therefore Claude must:

- push early and often on the feature branch;
- publish test results and artifacts through GitHub Actions (coverage reports, Playwright traces, k6 summaries) — see [CI_PIPELINE_PROPOSAL.md](CI_PIPELINE_PROPOSAL.md);
- put evidence in the PR (what was tested, how, links to workflow runs), not in chat.

## 5. Collaboration rules

| Rule | In practice |
|------|-------------|
| Decisions and engineering discussions live in GitHub | Issues for tasks/bugs; PRs for changes; `docs/DECISIONS_LOG.md` for decisions |
| Reference issues | `Closes #N` / `Refs #N` in PR bodies; `#N` in commit messages |
| No duplicate work | Check open issues/PRs and the status doc before starting; comment "picking this up" on the issue |
| Never silently overwrite another engineer's changes | Rebase/merge consciously; never force-push shared branches; conflicts are resolved in the PR with a note |
| Read before writing | Study existing docs, models and modules before adding new ones |
| Architecture changes are logged | New `D-xxx` row, status *Proposed* until Ammar accepts |
| Confirmed vs assumed vs proposed | Keep the `[CONFIRMED]` / `[ASSUMED]` / `[UNKNOWN]` tags; decisions are *Proposed* / *Accepted* |
| Status stays current | `docs/PROJECT_STATUS.md` updated in every PR that changes status |
| Findings get answers | When ChatGPT raises a finding, Claude replies in that PR/issue thread: fixed (commit SHA), disagreed (reason), or deferred (new issue) |
| Major problems are escalated | Claude documents it (issue + decisions log entry) and notifies Ammar and ChatGPT via the issue |

## 6. Branch and PR conventions

| Item | Convention |
|------|------------|
| Default branch | `main` — protected; merge only via PR with Ammar's authorisation |
| Branches | `docs/<topic>`, `feat/<issue>-<slug>`, `fix/<issue>-<slug>`, `chore/<slug>`, `ci/<slug>` |
| Stacked PRs | Allowed when a change depends on an unmerged PR; base = the parent branch; say so in the PR body |
| Commit messages | Conventional prefix (`feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`), imperative, reference `#issue` |
| PR template | `.github/PULL_REQUEST_TEMPLATE.md` — includes the "no merge without authorisation" banner |
| Labels | `question`, `needs-ceo-confirmation`, `decision`, `blocks-phase-1`, `research`, `phase-N`; QA labels to be added by ChatGPT (e.g. `needs-tests`, `qa-blocked`, `security`) |
| Required checks | Defined in [CI_PIPELINE_PROPOSAL.md](CI_PIPELINE_PROPOSAL.md); a failing required check is never bypassed, skipped or disabled to get green — the cause is explained and fixed |

## 7. Current gates (unchanged)

- Discovery PR #11 and its stacked PRs remain **unmerged** until Ammar authorises.
- Workbook analysis, staff details, handwritten registers and RFID reader inspection must be completed before implementation assumptions are committed to.
- No application implementation until the discovery and approval gates are satisfied; CI/test *structure* may be proposed and scaffolded in documentation first.
