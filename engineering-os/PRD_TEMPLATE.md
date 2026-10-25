# PRD_TEMPLATE.md — Product Requirements Document

## 1. Document information
Product:  
Feature:  
Owner:  
Status: Draft / Review / Approved / Shipped  
Created:  
Last updated:

## 2. Executive summary
What are we building, for whom, and why now?

## 3. Problem statement
- What problem exists?
- Who experiences it?
- What is the current workaround?
- Why is it important?

## 4. Goals
Define measurable outcomes.

## 5. Non-goals
Explicitly state what is out of scope.

## 6. Users and personas
For each primary persona define needs, context, constraints, and pain points.

## 7. Jobs-to-be-done / user stories
`As a [user], I want [capability], so that [benefit].`

## 8. User journey
Document entry, discovery, action, confirmation, recovery, and follow-up.

## 9. Functional requirements
Use IDs such as FR-001.

For each requirement include:
- description
- priority
- acceptance criteria using Given/When/Then
- dependencies

## 10. Non-functional requirements
Define measurable expectations for, cross-referencing the relevant standard:
- latency/performance (`PERFORMANCE.md`)
- availability
- scalability
- security (`SECURITY.md`)
- privacy (`PRIVACY_COMPLIANCE.md`)
- accessibility (`ACCESSIBILITY.md`)
- reliability
- SEO where applicable (`SEO.md`)
- compliance where applicable (`PRIVACY_COMPLIANCE.md`)
- cost/usage budgets where applicable (`COST_BUDGETS.md`)

## 11. UX requirements
List pages/screens, states, responsive behavior, accessibility, and design-system constraints. Reference `DESIGN_SYSTEM.md` and the authoritative design source recorded in `PROJECT_CONTEXT.md`.

## 12. System design summary
- context and boundaries
- major components
- data flow
- authentication/authorization
- database impact
- queues/background jobs
- caching
- external providers
- AI components

## 13. Data model
List new/changed entities, ownership, lifecycle, and sensitive fields.

## 14. API requirements
List required endpoints/events. Detailed contracts belong in `API_CONTRACTS.md`.

## 15. Security requirements
List threats, trust boundaries, roles, permissions, abuse cases, audit events, and rate-limit needs. Complete `THREAT_MODEL.md` for Medium/Large security-sensitive changes.

## 16. Analytics and telemetry
For each event define trigger, properties, actor, business purpose, and retention sensitivity.

## 17. Success metrics
Define:
- primary metric
- secondary metrics
- guardrail metrics
- target and measurement window

## 18. Testing requirements
Specify critical unit, integration, E2E, security, and performance tests. For material AI behavior, define the evaluation dataset, baseline, candidate metrics, guardrails, and release threshold per `AI_ENGINEERING.md`.

## 19. Rollout plan
Development → internal → staging → limited rollout → production.
Use feature flags/canaries when risk warrants it.

## 20. Rollback plan
Define how to disable or revert the feature and what happens to new data.

## 21. Risks
| Risk | Impact | Probability | Mitigation | Owner |
|---|---|---|---|---|

## 22. Dependencies and cost
Internal services, providers, designs, infrastructure, legal/compliance dependencies. Record material recurring-cost implications and budget ceilings in `COST_BUDGETS.md`.

## 23. Open questions
List unresolved decisions explicitly.

## 24. Definition of done
Acceptance criteria pass, tests pass, security reviewed, analytics implemented, docs updated, rollout completed, monitoring healthy.
