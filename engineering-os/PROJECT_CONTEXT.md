# PROJECT_CONTEXT.md — Project Identity and Operating Context

Version: 1.0
Status: Template — complete for each project

## 1. Purpose
This is the fastest authoritative orientation document for humans and agents entering the project. Keep it short, factual, and current. Do not copy the full PRD or architecture into this file; link to them and summarize only what is necessary to make safe decisions.

## 2. Project identity
- Project name:
- Project tier (AGENTS.md §2):
- Product/service type:
- Business model:
- Current phase: discovery / design / build / beta / production / maintenance
- Primary owner:
- Primary users:
- Primary business outcome:

## 3. Approved stack
| Layer | Choice | Version/Plan | Notes |
|---|---|---|---|
| Frontend | | | |
| Backend/runtime | | | |
| Database | | | |
| Auth | | | |
| Storage | | | |
| Hosting | | | |
| Payments | | | |
| Analytics | | | |
| Observability | | | |
| AI/model gateway | | | |
| Queue/jobs | | | |
| Search/vector store | | | |

Do not replace an approved stack component without an accepted ADR.

## 4. Environments and delivery
- Local development:
- Preview:
- Staging:
- Production:
- Primary domains:
- Deployment platform:
- CI/CD entry point:

Never place credentials or secret values in this file.

## 5. External integrations
| Provider/System | Purpose | Source of truth? | Criticality | Owner |
|---|---|---|---|---|
| | | | | |

## 6. Data and trust boundaries
- Primary data owners:
- Sensitive data classes:
- Tenant model:
- High-risk actions:
- Public entry points/webhooks:
- Data residency/retention constraints:

## 7. Applicable service profiles
Select only what applies:
- [ ] `profiles/WEB_APPLICATION.md`
- [ ] `profiles/SAAS.md`
- [ ] `profiles/ECOMMERCE.md`
- [ ] `profiles/AI_AGENT.md`
- [ ] `profiles/RAG.md`
- [ ] `profiles/VOICE_AGENT.md`
- [ ] `profiles/AI_AUTOMATION.md`
- [ ] `profiles/REALTIME_SYSTEM.md`
- [ ] `profiles/API_INTEGRATION.md`
- [ ] `profiles/VERCEL_AI.md`

## 8. Product constraints and non-goals
### Constraints
-

### Explicit non-goals
-

## 9. Current priorities
1.
2.
3.

## 10. Repository map
- Application source:
- Tests:
- Migrations:
- Infrastructure:
- Designs:
- Documentation:
- Runbooks:

## 11. Important commands
```bash
# install

# local development

# lint/typecheck

# test

# build

# database/migrations
```

## 12. Current risks and open decisions
- 

## 13. Last verified
- Date:
- Verified by:
- What was checked:
