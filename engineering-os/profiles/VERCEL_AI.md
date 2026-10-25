# VERCEL_AI.md — Service Profile

Version: 1.0  
Applies when: the project targets Vercel as the primary deployment and AI runtime platform, or when AI Gateway / Sandbox / Workflow primitives are used.

## Principle

Prefer platform primitives that reduce operational burden and improve AI reliability. Treat Vercel AI Cloud capabilities as first-class architecture components when they are in use.

## Preferred primitives

| Concern | Prefer | Notes |
|---------|--------|-------|
| Model access | AI Gateway | Single endpoint, routing, fallbacks, spend controls, optional zero data retention, unified observability |
| Untrusted / agent-generated code | Sandbox (microVMs) | Isolated execution; use Drives for persistent storage across runs when needed |
| Long-running or multi-step agents | Workflow SDK / durable agents (e.g. eve) | Step budgets, crash recovery, observability |
| Streaming, tools, structured output | AI SDK | TypeScript-first; consistent across frameworks |
| Agent tooling | MCP servers + official agent skills/plugins | Keep tool surfaces narrow and authorized |
| Compute for high-idle AI workloads | Fluid compute (Active CPU) | Cost efficiency for agent and inference patterns |

## Architecture rules when this profile applies

1. Route all production model calls through AI Gateway unless an explicit ADR justifies direct provider SDKs.
2. Pin model versions; define fallback models for deprecation or outage (see `AI_ENGINEERING.md`).
3. Never embed long-lived provider secrets in Sandbox environments; use short-lived capability tokens or Gateway proxy patterns.
4. Instrument every model and tool call for latency, tokens, cost, and failure reason.
5. Use feature flags and instant rollback for high-risk AI or agent path changes.
6. Treat Sandbox and agent-generated code as untrusted; apply the same authorization and validation rules as any other external input.

## Cost and observability

- Record AI Gateway and Sandbox usage in `COST_BUDGETS.md`.
- Set spend alerts and ceilings where the platform supports them.
- Include Gateway metrics in the project’s observability dashboards and runbooks.

## When not to force Vercel

This profile does not mandate Vercel for every project. If the approved stack in `PROJECT_CONTEXT.md` uses another platform, follow that stack and apply the equivalent reliability, isolation, and observability principles.

## Related standards

- `AI_ENGINEERING.md` — model, tool, eval, and safety rules  
- `DEPLOYMENT.md` — release, flags, rollback  
- `COST_BUDGETS.md` — recurring cost controls  
- `OBSERVABILITY.md` — telemetry and SLOs  
- `skills/ai-eval-gate.md` — release gate for AI changes  
