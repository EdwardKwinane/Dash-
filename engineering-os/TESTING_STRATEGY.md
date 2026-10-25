# TESTING_STRATEGY.md — Quality and Verification Strategy

Version: 3.0

## 1. Philosophy
Testing exists to create confidence. Prefer high-value behavioral coverage over raw test count.

## 2. Test layers
- Static analysis: formatting, linting, type checking.
- Unit: pure logic, policies, validation, calculations.
- Integration: database, auth, queues, adapters, service boundaries.
- Contract: API schemas and provider adapters.
- End-to-end: critical user journeys.
- Security: authorization, tenant isolation, hostile inputs.
- Performance: critical latency/throughput paths.

## 3. Critical-path rule
Every revenue, auth, destructive, payment, provisioning, or AI-action workflow must have broader-than-unit coverage.

## 4. Unit tests
Unit tests should be fast, deterministic, isolated, and focused on domain behavior.

## 5. Integration tests
Prioritize:
- database transactions and constraints
- repository queries
- authentication/authorization
- webhook verification
- queue/job behavior
- provider adapter mapping

## 6. API tests
Test valid, invalid, unauthenticated, unauthorized, missing, conflicting, rate-limited, and dependency-failure cases.

## 7. E2E tests
Examples:
- E-commerce: browse → cart → checkout → payment → order confirmation.
- SaaS: signup → onboarding → core action → billing/account state.
- AI app: request → processing → result → history → retry/failure.

## 8. Security regression suite
Verify:
- cross-user access fails
- cross-tenant access fails
- role escalation fails
- object-ID tampering fails
- unsafe upload types fail
- forged webhooks fail
- secrets do not appear in client output

## 9. AI evaluation
For AI features maintain versioned representative evaluation sets for:
- task success
- factuality/grounding and hallucination rate
- retrieval quality and citation correctness
- structured output validity
- prompt injection resistance
- tool-selection and tool-call correctness
- refusal/policy behavior where relevant
- latency and cost

For Medium/Large AI changes, the evaluation gate in `AI_ENGINEERING.md` is a release requirement. Compare the candidate against a recorded baseline; do not rely on ad-hoc prompt examples.

## 10. Test data
Use fixtures/factories/seeds. Do not depend on production data. Keep tests deterministic and resettable.

## 11. CI gate
Recommended pipeline:
`format → lint → typecheck → unit → integration → build → security scans → selected E2E`

## 12. Flaky tests
Flaky tests are defects. Quarantine only temporarily, with an owner and fix plan.

## 13. Regression rule
Production bug workflow:
`REPRODUCE → FAILING TEST → FIX → PASSING TEST → ADJACENT VERIFICATION`

## 14. Definition of sufficiently tested
A change is tested when the primary path, important edge cases, failure behavior, authorization, and regression risk have appropriate coverage.
