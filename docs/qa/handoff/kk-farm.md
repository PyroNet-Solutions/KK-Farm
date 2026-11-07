# Handoff: KK Farm — discovery docs plus local app prototype
Updated 2026-11-07 · session 1 · branch prototype/kk-farm-local-preview

## Goal
PyroNet's own goat-farm platform for KK Farm (118 goats, 1 shed, 6 planned). Done for now means Ammar reviews and merges the docs, then the farm visit validates requirements before production work.

## State
- [x] Docs chain PRs #11 to #21 (each based on the one before) and app PR #22 (based on `main`). All pushed, none merged (verified: `git for-each-ref` shows no ahead/behind).
- [x] Local app `apps/kk-farm` runs at http://127.0.0.1:8000 (verified: `/up` returns 200)
- [x] 17 rule tests pass on PostgreSQL; Playwright smoke passes on desktop and phone (run locally, not in CI)
- [ ] Ammar: confirm D-023 (stack) on PR #18 or issue #3; review and authorise merges #11, then #12 … #22
- [ ] blocked: Excel workbook not supplied (issue #1); farm visit; RFID reader model (issue #2)
- [ ] CI workflows not created; first confirm the Actions allowance (Q-STG-7)

## Decisions that are settled
- Budget is $0: no paid hosting, no card, no trials (D-033, Ammar, 2026-11-07). The Railway approval was withdrawn the same day (D-032 rejected).
- Stack is Laravel 13 + Inertia 3 + React 19 + PostgreSQL 18 (D-023, Ammar)
- Original product built from scratch; competitors are for inspiration only (D-034)
- Review happens through GitHub; live staging is deferred because no free option runs the full app (D-035, §6b)
- The local prototype was allowed before the farm visit (D-036); gate G0 still governs production
- RFID tag is never the goat ID; history and photos stay with the animal; nothing is hard-deleted
- Roles: Ammar decides and merges; Claude codes; ChatGPT reviews and owns QA via GitHub (D-017)

## Files touched
All committed and pushed. Docs live under `docs/` on the docs branches; the app is in `apps/kk-farm/` on the prototype branch.
Untracked on purpose: root `.claude/`; app `.env`, `.mcp.json`, uploads, `public/build`.

## How to verify
- App: open http://127.0.0.1:8000. The sign-in page lists 7 roles.
- Rules: `cd apps/kk-farm; php artisan test`. Expect `Tests: 17 passed`.
- Browser: with the app running, `npm run test:e2e`. Expect `All browser checks passed`. It adds demo records, so reset with `php artisan migrate:fresh --seed` afterwards.

## Open questions
Ammar: whether to merge; the workbook; the staging host if a free option appears. The full list is in `docs/OPEN_QUESTIONS.md` and `docs/farm-visit/FARM_VISIT_OPEN_QUESTIONS.md`.

## Do not
- Do not touch the other Docker containers on this laptop (saas_portal, isp3, kkn_ftth). KK Farm uses only `kkfarm_local_db` on port 5442.
- Do not write PHP files with PowerShell `Set-Content -Encoding utf8`: it adds a byte-order mark, and the app then returns 500 errors.
- `migrate:fresh` does not drop `animal_number_seq`, so the migration uses `CREATE SEQUENCE IF NOT EXISTS`. Keep it that way.
- `php artisan serve` started from a Claude tool dies when the session ends. Start it with `start-local.ps1`, or detached through `Win32_Process Create`.
- Switching branches removes the other side's files from the folder (docs vs `apps/`).
- Never merge, deploy, or create anything that can be charged without Ammar's written approval.
