# Stack Production Engineering OS v4.2

A reusable engineering constitution for AI-assisted and human software delivery. It governs how projects are understood, designed, implemented, reviewed, tested, secured, deployed, observed, and operated.

**v4.2** introduces a slimmed agent constitution, progressive skills, and a first-class Vercel AI Cloud profile.

## Core lifecycle
`UNDERSTAND → DESIGN → PLAN → IMPLEMENT → VERIFY → REVIEW → DOCUMENT → OPERATE`

`AGENTS.md` is the primary operating constitution. Each project should complete `PROJECT_CONTEXT.md`, select only the applicable profiles under `profiles/`, and then maintain project-specific PRD/architecture/ADR/operations documentation as the product evolves.

## Core standards
- `AGENTS.md` — agent governance, source-of-truth order, context-loading protocol, readiness/done gates
- `skills/` — progressive, on-demand procedures (load only when the task matches)
- `PROJECT_CONTEXT.md` — the fastest orientation document; fill this in first for every new project
- `ARCHITECTURE.md` — system-design method and review gates
- `SECURITY.md` / `THREAT_MODEL.md` — secure-by-default rules and threat modeling
- `PRIVACY_COMPLIANCE.md` — privacy and data-subject obligations
- `API_CONTRACTS.md` — API conventions and compatibility
- `DATABASE_DESIGN.md` — schema, ownership, integrity, migration rules
- `AI_ENGINEERING.md` — production AI, agents, RAG, evals, tool safety
- `DESIGN_SYSTEM.md` — design tokens, components, theme and design-to-code governance
- `CODING_STANDARDS.md` — implementation quality
- `ACCESSIBILITY.md` — WCAG 2.2 AA baseline
- `PERFORMANCE.md` — performance budgets and Core Web Vitals
- `COST_BUDGETS.md` — recurring cost/FinOps controls
- `SEO.md` — search discoverability standard
- `TESTING_STRATEGY.md` — quality and regression strategy
- `DEPLOYMENT.md` — release, migrations, rollback and DR
- `GIT_WORKFLOW.md` — version-control discipline
- `OBSERVABILITY.md` — telemetry, SLOs and alerting
- `INCIDENT_RESPONSE.md` / `RUNBOOK.md` — incident handling and operational procedures
- `HOW_IT_WORKS.md` — practical system guide for owners/operators
- `PRD_TEMPLATE.md` / `DECISIONS.md` — requirements and ADR history

## Adaptive profiles
Only load profiles that apply to the project or current change:
- Web application
- SaaS
- Ecommerce
- AI agent
- RAG
- Voice agent
- AI automation
- Realtime system
- API integration

Profiles refine the universal standards and cannot weaken higher-priority rules.

## Recommended project initialization
1. Copy this directory into the project repository.
2. Read `AGENTS.md`.
3. Complete `PROJECT_CONTEXT.md` and select project tier/profiles.
4. Create/approve the PRD.
5. Fill the project architecture and ADR log before significant implementation.
6. Complete `THREAT_MODEL.md`, `COST_BUDGETS.md`, `RUNBOOK.md`, and `HOW_IT_WORKS.md` as applicability/risk requires.
7. Keep the documents updated as durable project memory; do not rely on chat history.
