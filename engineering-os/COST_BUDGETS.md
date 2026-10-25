# COST_BUDGETS.md — Engineering Cost and FinOps Standard

Version: 1.0

## 1. Principle
Recurring cost is an architectural constraint. Agents may recommend paid infrastructure or APIs, but must expose the cost model before committing the project to it.

## 2. Cost inventory
Maintain estimates for applicable categories:
| Category | Provider | Pricing driver | Current estimate | Budget/ceiling | Alert threshold |
|---|---|---|---:|---:|---:|
| Hosting/compute | | | | | |
| Database | | | | | |
| Storage | | | | | |
| Bandwidth/CDN | | | | | |
| AI inference | | | | | |
| Search/vector DB | | | | | |
| Email/SMS/voice | | | | | |
| Maps/location | | | | | |
| Observability | | | | | |
| Auth | | | | | |
| Other SaaS | | | | | |

## 3. Required disclosure
Before a Medium/Large change that introduces or materially increases recurring cost, state:
- provider and product
- free tier if relevant
- unit of billing
- expected low/base/high usage scenario
- known minimum monthly commitment
- egress/storage/seat costs that are easy to miss
- credible lower-cost alternative, if one exists

Do not imply that a usage-based service is “free” merely because it has a trial or free tier.

## 4. AI cost budgets
For production AI workloads track where practical:
- cost/request or cost/task
- input/output tokens
- model mix
- cache hit rate
- retries
- tool/provider costs triggered by an agent
- monthly projected cost at expected traffic

Agent loops require a per-run cost or resource budget in addition to step/time limits.

## 5. Guardrails
Use provider budgets/alerts when available. Application-level quotas are required where a single user, tenant, bug, or agent loop could create material spend.

## 6. Optimization order
Optimize cost by removing waste before degrading user value:
1. eliminate duplicate/unnecessary work
2. cache or batch where correctness allows
3. right-size resources/models
4. use tiered model/provider routing
5. negotiate/commit only after usage is stable
6. trade quality/performance for cost only with explicit product approval

## 7. Cost incidents
Unexpected spend spikes are operational incidents when material. Investigate the trigger, stop uncontrolled spend safely, preserve evidence, and add a guardrail or alert to prevent recurrence.
