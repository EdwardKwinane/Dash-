# agent.md — Agent Quick Reference

This file is a short companion to `AGENTS.md`. `AGENTS.md` and `engineering-os/AGENTS.md` take precedence if anything here conflicts.

## Read order
1. `AGENTS.md` (root)
2. `engineering-os/AGENTS.md`
3. `engineering-os/PROJECT_CONTEXT.md`
4. `engineering-os/DECISIONS.md`
5. Relevant standards, profiles and skills under `engineering-os/`

## Non-negotiables
- Re-read the applicable context before every implementation task.
- Verify with real commands; never claim an unrun check passed.
- Update the relevant `engineering-os/` records after implementation.
- Keep everything inside `/Users/user/Developer/Dash#`.

## Project-specific pitfalls
- The folder name contains `#`. Tailwind v4 cannot load stylesheets from this path; the project is pinned to Tailwind v3 (ADR-001).
- Run exactly one dev server, from the repo root: `npm run dev` → `http://localhost:3000` (ADR-002).
- The catalogue is seeded demo data; do not claim real payments, fulfilment or availability.

## Where things are
- App: `dash-app/src/`
- Docs: `engineering-os/`
- Run/build commands and known constraints: `engineering-os/HOW_IT_WORKS.md`
