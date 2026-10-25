# OBSERVABILITY.md — Production Observability Standard

Version: 2.0

## 1. Goal
A production system should make it possible to answer: What is failing? Who is affected? Since when? Why? What changed? How quickly can we recover?

The obligation to detect and diagnose failures applies to every tier. Tooling depth scales with risk and system criticality: a Tier 1 site may need error tracking, uptime checks, and platform metrics; a Tier 3/4 distributed system may require traces, SLOs, RUM, queue/database dashboards, and on-call alerting.

## 2. Three pillars
### Logs
Use structured, searchable logs with timestamps, environment, service, severity, request/correlation ID, and safe contextual metadata.

### Metrics
Track service health, product-critical operations, dependencies, queues, databases, and AI usage.

### Traces
Use distributed tracing when requests cross multiple services/providers or latency is difficult to localize.

## 3. Golden signals
Track:
- latency
- traffic
- errors
- saturation

## 4. Service-level objectives
For critical systems define SLOs such as availability and p95/p99 latency. Use error budgets to guide reliability tradeoffs.

## 5. Required telemetry
Depending on system:
- request count and latency
- error rate by route/service
- database query latency and pool saturation
- queue depth and job age
- external provider latency/failure rate
- cache hit ratio
- payment failure/reconciliation rate
- auth failures
- AI latency, tokens, model errors, tool failures, cost

## 6. Correlation
Propagate request/trace IDs across API, worker, and provider boundaries where possible.

## 7. Alerting
Alerts should be actionable and symptom-based. Avoid alerting on every transient error.

Each alert should define:
- condition
- severity
- likely owner
- first diagnostic steps
- escalation path

## 8. Dashboards
Maintain dashboards for:
- system health
- critical business flows
- dependencies
- queues/workers
- database health
- AI operations where applicable

## 9. Logging hygiene
Never log credentials, tokens, raw payment data, or unnecessary sensitive personal information.

## 10. Incident learning
After meaningful incidents capture timeline, impact, root cause, contributing factors, remediation, and prevention work.

## Agent and AI-specific signals

When the system includes agents, model calls, or tool use, also track:

- Step-level traces: input → context composition → model → tool calls → output → decision
- Tool-call counts, failures, and selection accuracy
- Escalation rate to human approval
- Tokens and cost per successful task
- Context composition / retrieval relevance signals where applicable
- Kill-switch activation events

Correlate these with existing application and infrastructure telemetry. Prefer structured, queryable traces over free-form log dumps for agent runs.
