# AGENTS.md

This project uses the Stack Production Engineering OS v4.2.

**Source of truth:** `engineering-os/AGENTS.md` — this root file is only a pointer, not the full constitution.

## MANDATORY workflow for every implementation task

Re-read the applicable sources at the start of **every** new task. Instructions read during an earlier task are not sufficient.

### Before implementation

1. Read this `AGENTS.md` and `agent.md` at the workspace root.
2. Read `engineering-os/AGENTS.md` and follow its context-loading protocol.
3. Read `engineering-os/PROJECT_CONTEXT.md`, `engineering-os/DECISIONS.md`, and the relevant standards/profiles/skills under `engineering-os/`.
4. Identify applicable requirements, constraints, acceptance criteria, design rules and quality gates.
5. Determine which documentation and project-memory records will need updating if behaviour, architecture, requirements or decisions change.

### Implement and verify

6. Follow the Engineering OS lifecycle: `UNDERSTAND → DESIGN → PLAN → IMPLEMENT → VERIFY → REVIEW → DOCUMENT → OPERATE`.
7. Run the applicable verification (lint, type-check, build, route checks, visual inspection). Do not claim a check passed unless it was actually run.

### After implementation

8. Update the relevant records before declaring the task complete:
   - `engineering-os/PROJECT_CONTEXT.md` — durable project facts, constraints, commands.
   - `engineering-os/HOW_IT_WORKS.md` — behaviour and operational guidance.
   - `engineering-os/DECISIONS.md` — an ADR for significant or hard-to-reverse decisions.
   - `engineering-os/CHANGELOG.md` — what changed and what was verified.
   - `engineering-os/ARCHITECTURE.md` / `PRD` / task records — when behaviour or scope changes.
9. Record only verified facts. Distinguish planned, implemented, verified and deferred work.
10. Report what changed, which records were updated, and the actual verification results.

## Hard rules

- Keep all project files inside the `Dash#` folder.
- Do not replace the existing Dash# storefront, brand identity or logo with generic starter content.
- Start the dev server only from the repo root: `npm run dev` (never `next dev` from another directory).
- Do not upgrade Tailwind CSS without re-testing the `#` path constraint (see `engineering-os/DECISIONS.md` ADR-001).
