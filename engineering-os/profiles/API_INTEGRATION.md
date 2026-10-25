# API_INTEGRATION.md — Service Profile

Version: 1.0
Applies when: integrating external APIs, webhooks, partner systems, POS/ERP/CRM services, or provider SDKs.

## Boundary adapter
Keep provider-specific request/response shapes inside an integration adapter. Normalize them into application/domain types so provider changes do not leak across the codebase unnecessarily.

## Authentication and secrets
Store provider credentials server-side using approved secret management. Define rotation and revocation. Scope credentials to least privilege where the provider allows it.

## Inbound webhooks/events
Verify signatures, validate schema, capture provider event ID, process idempotently, acknowledge within provider timing constraints, and queue slow work. Store enough event metadata for safe replay/reconciliation without retaining unnecessary secrets or sensitive payloads.

## Outbound calls
Set timeouts; classify retryable vs permanent failures; respect provider rate limits; use exponential backoff/jitter; and avoid retrying non-idempotent actions blindly.

## Compatibility
Pin/version provider APIs or SDKs where possible, track deprecations, and isolate provider changes behind contract tests.

## Reconciliation
When external and internal state can drift, define which system wins and build a reconciliation path. Webhook delivery alone is not a complete consistency strategy for critical financial/inventory state.

## Observability and cost
Track latency, error class, rate-limit responses, retry volume, delivery/reconciliation failures, and usage-based cost where material.
