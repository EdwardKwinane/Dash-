# Skill: AI Evaluation & Release Gate

Use when: any Medium or Large AI capability change (new model, prompt, tool, RAG config, agent loop, or structured-output schema) before production promotion.

## Release gate sequence

`BASELINE → CANDIDATE → OFFLINE EVAL → SAFETY EVAL → LATENCY/COST CHECK → REGRESSION COMPARISON → HUMAN REVIEW (if high-risk) → CONTROLLED ROLLOUT → PRODUCTION MONITORING`

## Required artifacts

- Versioned evaluation set appropriate to the capability.
- Pinned model version (not a floating “latest” alias) unless the product explicitly accepts automatic upgrades and has evals to catch regressions.
- Fallback model defined for deprecation or outage.
- Prompt / retrieval / tool configuration versions recorded so the eval is reproducible.

## Minimum metrics (where applicable)

- Task success rate
- Factuality / hallucination rate
- Grounding and citation correctness
- Structured-output validity rate
- Retrieval relevance / recall
- Tool selection and tool-call accuracy
- Safety / policy adherence
- Prompt-injection resistance
- p50 / p95 latency
- Tokens and cost per successful task

## Rules

- Do not promote a candidate that materially regresses a guardrail metric without explicit approval and an ADR describing the tradeoff.
- High-impact actions (irreversible deletion, high-value financial operations, privilege changes, mass external communication) still require human approval or a product-approved deterministic policy even after the eval gate passes.
- Store enough metadata to reproduce the evaluation later.

## After promotion

- Monitor the same metrics in production.
- Route user feedback and production failures back into the evaluation set.
