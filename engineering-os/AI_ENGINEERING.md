# AI_ENGINEERING.md — Production AI Systems Standard

Version: 2.0

## 1. Principle
AI is a probabilistic subsystem, not a trusted authority. Design deterministic controls around it.

## 2. Standard pipeline
`INPUT → VALIDATION → CONTEXT → PROMPT → MODEL → STRUCTURED OUTPUT → VALIDATION → POLICY/AUTHORIZATION → ACTION → OBSERVABILITY`

## 3. Model selection
Choose models based on task quality, latency, cost, context window, tool support, structured output, privacy, and provider reliability. Do not default to the largest model for every task.

## 3a. Model version pinning and deprecation policy
Pin the exact model version used in production rather than floating on a provider's "latest" alias, unless the product explicitly wants automatic upgrades and has evals to catch regressions. For every model in production, track:
- the pinned version/identifier
- the provider's announced deprecation/sunset date, if any
- a fallback model to switch to if the primary is deprecated, degraded, or unavailable
- the evaluation suite (per §11) that must pass before adopting a new model version

Treat a provider-announced deprecation as a Medium-or-larger change: re-run evals against the replacement model/version before switching, and record the switch as an ADR if behavior, cost, or quality materially changes.

## 4. Model gateway
When multiple models/providers are expected, centralize:
- provider configuration
- retries/timeouts
- model routing
- usage/cost tracking
- fallbacks
- logging
- safety/policy controls

## 5. Prompt management
Prompts should be versioned and testable. Separate system policy, developer instructions, task context, retrieved context, and user input.

## 6. Structured output
For machine-consumed AI results:
- define a schema
- validate every response
- reject or repair invalid output
- never parse arbitrary prose when structured output is available

## 7. Tool calling
Use least privilege. Each tool should have:
- explicit purpose
- narrow schema
- authorization boundary
- rate/cost limits
- idempotency where needed
- audit logging

Never let model output directly compose privileged shell/database commands without deterministic validation and authorization.

## 8. RAG
RAG systems should define:
- document ingestion and parsing
- chunking strategy
- metadata
- embedding model/version
- vector store
- retrieval strategy
- reranking
- citation/grounding behavior
- freshness/update strategy
- access control before retrieval

Never retrieve data the current user is not authorized to see.

## 9. Agent loops
Agentic systems require:
- maximum step count
- wall-clock limit
- token/cost budget
- tool allowlist
- recursion/loop protection
- state persistence policy
- human approval gates for high-impact actions

## 10. Prompt injection defense
Treat retrieved documents, webpages, emails, attachments, and tool outputs as untrusted content. They may contain instructions designed to override system policy.

## 11. Evaluation and release gate
Production AI behavior must be evaluated, not judged only by examples. Maintain a versioned evaluation set appropriate to the capability. At minimum measure where applicable:
- task success
- factuality / hallucination rate
- grounding and citation correctness
- structured-output validity rate
- retrieval relevance / recall
- tool selection and tool-call accuracy
- safety/policy adherence
- prompt-injection resistance
- p50/p95 latency
- tokens and cost per successful task

For Medium/Large AI changes, use this release gate:
`BASELINE → CANDIDATE → OFFLINE EVAL → SAFETY EVAL → LATENCY/COST CHECK → REGRESSION COMPARISON → HUMAN REVIEW IF HIGH-RISK → CONTROLLED ROLLOUT → PRODUCTION MONITORING`

Do not promote a candidate that materially regresses a guardrail metric without explicit approval and an ADR describing the tradeoff. Store enough metadata to reproduce the evaluation: dataset version, prompt version, model version, retrieval configuration, tool definitions, and scoring method.

## 12. AI observability
Track where appropriate:
- model/provider
- prompt/version
- request latency
- input/output tokens
- cost
- retries
- parse failures
- tool calls and failures
- user feedback
- eval scores

Avoid storing sensitive prompts/responses unnecessarily.

## 13. Fallbacks
Define behavior for timeout, provider outage, rate limit, malformed output, refusal, tool failure, and exceeded budget.

## 14. Privacy
Do not send sensitive user data to a model/provider unless required, authorized, and consistent with the product's privacy design. Minimize context.

## 15. Human approval
Require approval before AI executes high-impact actions such as irreversible deletion, high-value financial operations, privileged access changes, or mass external communication unless the product explicitly and safely supports autonomous execution.

## 16. Continuous evaluation and feedback

In addition to the offline release gate (§11):

- Sample production traffic into a shadow evaluation set where privacy and cost allow.
- Route user feedback and production failures back into the versioned evaluation suite.
- Track successful-task cost and escalation rate as first-class signals for agentic features.
- Do not treat a one-time offline eval as permanent proof of quality.

## 17. Agent identity and kill switch

- Production agents should run under a registered non-human identity (NHI) with scoped credentials, not under a human login.
- Provide a practical kill switch that can disable tool execution or the entire agent path without a full code rewrite. Target disable latency under 60 seconds; test periodically and record evidence.
