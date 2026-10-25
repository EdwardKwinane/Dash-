# Skill: New Provider Integration

Use when: adding a third-party provider, external API, payment, AI model gateway, storage, email, analytics, or similar dependency.

## Pre-flight

1. Confirm the platform or current stack cannot reasonably solve the need.
2. Check package/provider is actively maintained, license is compatible, and security posture is acceptable.
3. Disclose any new recurring cost and check against `COST_BUDGETS.md`. Medium/Large cost changes require disclosure and approval.
4. Classify the change; most new providers are Medium or Large and need an ADR.

## Design requirements

- Timeout, retry policy (with jitter), and circuit-breaker behavior if useful.
- Idempotency for any write or side-effecting call.
- Fallback or graceful degradation when the provider is unavailable.
- Observability: latency, error rate, and (for usage-based providers) cost signals.
- Secrets injected securely; never in client code or source control.
- Data that crosses the boundary and privacy implications (`PRIVACY_COMPLIANCE.md`).

## Done criteria

- ADR recorded if Medium/Large.
- Failure modes and fallback documented in architecture or runbook.
- Cost impact reflected in `COST_BUDGETS.md` if material.
- `PROJECT_CONTEXT.md` external integrations table updated.
