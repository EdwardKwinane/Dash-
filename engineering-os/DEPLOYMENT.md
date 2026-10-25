# DEPLOYMENT.md — Release and Operations Standard

Version: 2.0

## 1. Environments
At minimum distinguish local/development, staging/pre-production, and production. Production secrets and data must not be reused casually outside production.

## 2. Infrastructure as code
Prefer repeatable, reviewable infrastructure configuration over manual console changes for production-critical resources.

## 3. CI/CD principles
- every deployment is traceable to a commit/build
- production builds are reproducible
- tests and security checks run before release
- secrets are injected securely
- rollback is known before rollout

## 4. Deployment strategies
Choose based on risk:
- rolling deployment
- canary
- blue/green
- feature-flagged release

High-risk features should support incremental rollout.

## 4a. Feature flag lifecycle
Feature flags are a liability the moment they're created, not just at cleanup time. Every flag must have:
- a clear name following a consistent convention (e.g. `ff_<area>_<feature>`)
- an owner
- a stated purpose: release gating, kill switch, experiment, or permanent configuration
- an expected lifetime — release-gating and experiment flags should have a target removal date; kill switches and permanent config flags are explicitly exempt and should be labeled as such
- a defined default state (on/off) for each environment

Review flags regularly (e.g. at each sprint/release boundary or monthly for small teams) and remove stale release-gating/experiment flags whose feature has fully shipped or been abandoned — dead flags accumulate complexity and hide bugs. Do not let a flag outlive its purpose silently.

## 5. Database migrations
Migrations should be:
- forward-compatible where possible
- tested on realistic data volumes
- non-blocking when feasible
- separated into expand/migrate/contract phases for risky changes

Never assume code rollback automatically reverses data migrations.

## 6. Release checklist
Before production verify:
- CI green
- migrations reviewed
- environment variables configured
- monitoring dashboards available
- alerts configured for critical new failure modes
- rollback path understood
- feature flags configured if applicable
- project `RUNBOOK.md` updated for new operational failure modes
- material AI candidate passed its evaluation/release gate
- new cost-sensitive resources have alerts/ceilings where supported

## 7. Rollback
Define rollback for:
- application code
- infrastructure
- configuration
- provider integration
- database/schema changes

## 8. Secrets and access
Use least-privilege deployment credentials. Protect production access and audit administrative changes.

## 9. Disaster recovery
For critical data define:
- backup frequency
- restore testing
- RPO
- RTO
- region/provider failure assumptions

## 10. Post-deployment verification
Verify health checks, error rates, latency, critical user journeys, queues, provider integrations, and business-critical metrics after release.
