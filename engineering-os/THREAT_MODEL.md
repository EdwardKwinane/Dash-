# THREAT_MODEL.md — Lightweight Threat Modeling Template

Version: 1.0
Status: Complete for Medium/Large security-sensitive changes

## 1. Scope
- Feature/system:
- Change classification:
- Project tier:
- Owner:
- Date:

## 2. Security objective
What must remain confidential, correct, available, and attributable?

## 3. Assets
| Asset | Sensitivity | Owner | Impact if compromised |
|---|---|---|---|
| | | | |

## 4. Actors
- legitimate users:
- administrators/support:
- external providers:
- automated agents/services:
- unauthenticated/internet actors:
- compromised accounts or insiders:

## 5. Entry points
List APIs, pages, uploads, webhooks, queues, admin tools, agent tools, scheduled jobs, and provider callbacks that can affect the scoped assets.

## 6. Trust boundaries and data flow
Describe or diagram where data crosses between browser, edge, application, database, worker, AI provider, payment provider, internal admin, or third party.

## 7. Abuse/threat scenarios
For each meaningful scenario record:
| Threat / abuse case | Preconditions | Impact | Existing controls | Required controls | Residual risk |
|---|---|---|---|---|---|
| | | | | | |

At minimum consider where applicable:
- broken authorization / IDOR
- tenant crossover
- injection / XSS / SSRF
- credential/session theft
- brute force and automated abuse
- replay/duplicate financial operations
- unsafe file content
- sensitive data exposure
- privilege escalation
- webhook spoofing
- dependency/supply-chain compromise
- prompt injection / malicious retrieved content
- unauthorized AI tool execution
- denial of service / cost amplification

## 8. Security tests required
-

## 9. Telemetry and audit events required
-

## 10. Rollback / kill switch
How can the capability be disabled or contained if a control fails?

## 11. Approval and residual risk
- Residual risks accepted:
- Approval/ADR reference:
