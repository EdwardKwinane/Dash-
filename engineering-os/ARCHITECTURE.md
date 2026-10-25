# ARCHITECTURE.md — System Architecture Standard

Version: 3.0

## 1. Purpose
Architecture must be intentional, documented, and evolvable. This file defines the default system-design method used across projects.

## 2. Principles
- Start simple; scale when evidence requires it.
- Prefer modular monoliths before microservices unless organizational or scaling boundaries justify separation.
- Keep domain boundaries explicit.
- Prefer stateless application services where practical.
- Treat third-party providers as fallible dependencies.
- Prefer managed infrastructure when it reduces operational burden without unacceptable lock-in.
- Design for observability from the start.
- Security boundaries must be explicit.
- Data ownership must be unambiguous.

## 3. Required architecture views
Each substantial project should document:
1. System context — users, external systems, trust boundaries.
2. Container view — web app, APIs, workers, databases, queues, storage.
3. Component view — major modules and responsibilities.
4. Data view — entities, relationships, ownership, retention.
5. Runtime flows — critical request and event sequences.
6. Deployment view — environments, regions, networking, CDN, secrets.
7. Failure view — major failure modes and fallback behavior.

## 4. Default logical layers

### Presentation
UI, client state, accessibility, responsive behavior. No authoritative business authorization.

### Application
Use-case orchestration, request context, transactions, authorization coordination.

### Domain
Business rules, policies, domain entities, calculations, workflows.

### Data
Persistence, repositories, queries, transactions, migrations.

### Integration
Payments, email, AI providers, maps, analytics, POS, storage, search, webhooks.

### Background processing
Queues, workers, scheduled jobs, retries, dead-letter handling.

## 5. Request lifecycle
`Client → Edge/CDN → App/API → Authentication → Validation → Authorization → Domain Logic → Data/Provider → Response`

For critical flows, document timeouts, retry behavior, idempotency, and failure responses.

## 6. Asynchronous work
Use background jobs when work is slow, retryable, provider-dependent, expensive, or non-blocking. Examples: media generation, email, document processing, imports, exports, AI generation, webhook fan-out.

Default flow:
`API → Queue → Worker → Provider/Data Store → Event/Notification`

All retryable jobs should define:
- idempotency key
- retry budget
- backoff policy
- poison-message/dead-letter behavior
- timeout
- observability

## 7. Caching
Every cache must define:
- cache key
- source of truth
- TTL
- invalidation strategy
- consistency tolerance
- stampede protection if needed

Do not cache without a reason.

## 8. Scalability
Before optimization, estimate or measure:
- DAU/MAU
- peak requests per second
- read/write ratio
- largest tables and objects
- queue throughput
- payload sizes
- external API rate limits
- latency SLOs

Prefer vertical/simple scaling first; introduce sharding, partitioning, replicas, event streams, or service extraction only when needed.

## 9. Reliability
For every external dependency consider:
- timeout
- retry policy
- exponential backoff and jitter
- circuit breaker where useful
- idempotency
- fallback or graceful degradation
- provider outage behavior

## 10. Multi-tenancy
If applicable, explicitly define:
- tenant identifier
- tenant ownership model
- row-level/data-access isolation
- admin/support access boundaries
- audit requirements
- tenant-scoped indexes and constraints

## 11. Real-time systems
For chat, collaboration, tracking, or live location define:
- transport: WebSocket/SSE/polling
- authoritative state
- reconnect behavior
- ordering expectations
- presence strategy
- fan-out model
- offline reconciliation
- event retention

## 12. E-commerce and payments
Define separately:
- product/catalog source of truth
- inventory source of truth
- POS synchronization strategy
- checkout ownership
- payment provider boundary
- webhook processing
- reconciliation process
- order state machine

## 13. AI systems
Use a model gateway or abstraction when multiple providers/models are likely. Treat prompts, retrieved data, model responses, and tool calls as explicit architecture components.

## 14. Architecture review gates
Architecture review is required before:
- new datastore
- new message broker
- new auth strategy
- new payment architecture
- new service boundary
- new public API version
- major AI-agent capability
- destructive migration
- multi-region deployment
- a new recurring provider/service cost that materially changes the project budget
- a new trust boundary or privileged AI tool path

## 15. Documentation rule
Significant architecture changes require an ADR and updates to diagrams or flows before the implementation is considered complete. Keep `PROJECT_CONTEXT.md` synchronized with the approved stack and applicable service profiles. Security-sensitive architecture changes also update `THREAT_MODEL.md`; new operational dependencies update `RUNBOOK.md`.
=== ARCHITECTURE.md APPEND (verified) ===

## Sprint 02 — South African region + Dash# catalogue seed (verified 2026-10-25)
- Backend scaffolded apps/backend/ (ADR-014); seed idempotent via src/scripts/seed-dash-catalogue.ts.
- DB verified: region = Europe/eur + South Africa/zar; categories 11 (4 scaffold + 7 Dash#); products 10 (4 scaffold + 6 Dash#, SKUs verified).
- Second seed run clean; no EUR leakage on Dash# records; prices confirmed integer ZAR cents.
- Tax automation disabled; delivery rates = 0 (documented); demo inventory clearly labelled; Dell XPS 13 Plus image deferred Sprint 04.
- Store API currently reports 0 published products — SA region not yet linked to default sales channel (owner completes in Admin).
- Deployment to AWS EC2: STOPPED at verified discovery — no authorized AWS identity; get-caller-identity empty; default region unset; profile agent-toolkit unconfigured; dash# instance unknown. No billable resources created; no secrets exposed; .env (local) untracked; .env.example tracked with placeholders.
- Next: provide AWS identity + region, confirm dash# instance, complete region link in Admin, approve deployment method.


## Sprint 02 — Verified EC2 target (`i-05a80ef6bae076027`, eu-north-1)
- Read-only SSM: OS Ubuntu 24.04.5 LTS (aarch64); RAM ~904Mi (~617Mi avail); Swap 0B; Disk 29G total / 2.3G used (9%); 2 CPU cores (t4g.micro).
- Running services: acpid, chrony, cron, dbus, fwupd (no application services); listening ports only :22 (SSH) + lo:53 (DNS); no 9000/5432/6379/80/443.
- Software: node/npm/postgresql-client/docker not installed; PostgreSQL service not running; SSM agent online (`VoltMarketMedusaSSMInstanceProfile`).
- Existing database: none in `eu-north-1` (RDS empty); instance-level PostgreSQL required if co-located (adequate for small Medusa with SA region).
- Security: SG `volt-market-medusa-dev-sg` (`SSM only`) — ingress changes require approval; public IP exists (`13.49.227.22`).
- Proposed architecture (pending approval): co-locate PostgreSQL + Medusa on instance (30GB gp3); systemd supervisor; build from `npm run build`; SG ingress change (only if public endpoint approved); TLS/DNS change (no Route53 zone; new zone/domain requires approval); production secrets via approved secret store (not `.env`); rollback via volume snapshot + service restart.

