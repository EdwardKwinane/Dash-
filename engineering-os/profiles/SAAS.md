# SAAS.md — Service Profile

Version: 1.0
Applies when: building subscription, workspace, organization, or multi-user SaaS products.

## Tenant model
Define tenant/workspace identity, membership, roles, invitations, ownership transfer, suspension/deletion, and support/admin access. Tenant isolation is a security invariant, not a UI convention.

## Entitlements and billing
Separate authentication, authorization, and commercial entitlement. A paid plan may grant capabilities, but billing state must not replace resource authorization. Define plan limits, metering, trial behavior, grace periods, cancellation, and reconciliation with the billing provider.

## Data
All tenant-scoped entities and queries must have explicit ownership. Add tests proving cross-tenant access fails. Consider tenant-scoped uniqueness and indexes.

## Admin/support
Privileged support access requires least privilege, auditability, and clear impersonation/break-glass rules if supported.

## Lifecycle
Design onboarding, invitations, upgrades/downgrades, failed payments, data export, tenant deletion, and offboarding intentionally.

## Reliability and observability
Track signup, activation, core-action success, billing failures, permission failures, and tenant-impacting incidents separately from generic request health.
