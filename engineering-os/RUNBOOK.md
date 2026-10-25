# RUNBOOK.md — Production Operations Template

Version: 1.0
Status: Project-specific template

## 1. Purpose
Document how to diagnose, contain, recover, and verify the project's most important operational failures. Keep commands safe, current, and environment-specific without embedding secrets.

## 2. Service map
- User-facing applications:
- APIs/services:
- Workers/queues:
- Databases/storage:
- Critical providers:
- Observability links/location:
- Deployment system:

## 3. Access and escalation
- Production owner:
- Who can deploy/rollback:
- Who can rotate credentials:
- Who can disable integrations:
- Provider support/escalation paths:

## 4. Standard incident workflow
`DETECT → ASSESS → CONTAIN → COMMUNICATE → RECOVER → VERIFY → LEARN`

Follow `INCIDENT_RESPONSE.md` for severity and communication rules.

## 5. Rollback
- Last-known-good deployment procedure:
- Database compatibility constraints:
- Feature flags/kill switches:
- Verification after rollback:

## 6. Database degradation
Symptoms:

First checks:

Safe mitigations:

Do not:

Recovery verification:

## 7. Queue/worker backlog
Symptoms:

First checks:

Safe mitigations:

Poison/dead-letter procedure:

Recovery verification:

## 8. Authentication outage or compromise
Symptoms:

Disable/contain:

Session revocation:

Credential rotation:

Recovery verification:

## 9. Payment/provider outage
Symptoms:

Degraded-mode behavior:

Reconciliation steps:

Do not retry non-idempotent financial actions blindly.

## 10. AI provider degradation
Symptoms:

Fallback model/provider:

Budget/rate-limit checks:

Tool-execution kill switch:

Recovery verification:

## 11. Webhook failure/backlog
Signature verification checks:

Replay procedure:

Idempotency checks:

Reconciliation:

## 12. Cost spike
Identify provider/resource/user/tenant/job responsible. Disable runaway loops or traffic safely, preserve audit information, and verify budget alerts before closure.

## 13. Post-recovery checklist
- [ ] customer-impacting functionality verified
- [ ] queues/backlogs normalizing
- [ ] data integrity/reconciliation verified
- [ ] alerts cleared for the right reason
- [ ] temporary mitigations tracked for removal
- [ ] incident review created if required
