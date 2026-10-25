# CHANGELOG

## v4.2 — agent-native modularization (2026-10-24)

Baseline: Stack Production Engineering OS v4.1.

### Changed
- **AGENTS.md slimmed and restructured (v4.2).** Reduced from ~355 lines to a focused constitution. Detailed operating modes and policy depth remain in the existing standards; the constitution now holds mission, tiering, source-of-truth order, context-loading, change classification, Definition of Ready/Done, non-negotiables, stop conditions, and skills pointer. This matches 2026 agent-instruction best practice (short index + progressive skills) and reduces token cost and instruction conflict risk.

### Added
- **`skills/` directory** with progressive, on-demand procedures:
  - `database-migration.md`
  - `ai-eval-gate.md`
  - `feature-flag-lifecycle.md`
  - `incident-triage.md`
  - `new-provider-integration.md`
  - `adr.md`
  - `skills/README.md` index
- **`profiles/VERCEL_AI.md`** — first-class profile for Vercel AI Cloud (AI Gateway, Sandbox, Workflow/durable agents, Fluid compute, MCP, cost and observability expectations). Prefer these primitives when the project targets Vercel; remains non-prescriptive for other stacks.
- Source-of-truth order and context-loading protocol updated to include `skills/`.
- `PROJECT_CONTEXT.md` and `README.md` updated for skills and the Vercel AI profile.

### Unchanged
All core standards (Security, Privacy, Architecture, AI_ENGINEERING, Deployment, Observability, etc.) retain their existing requirements. No lifecycle, security, accessibility, or privacy obligations were weakened.

### Rationale
Align the OS with current agentic development practice (Claude Code, Codex, Cursor, OpenCode, Vercel AI Cloud) while preserving the rigor that already made v4.1 production-capable.
