# AI_AUTOMATION.md — Service Profile

Version: 1.0
Applies when: automating business workflows using AI, schedulers, triggers, queues, or third-party systems.

## Workflow ownership
Define trigger, inputs, deterministic steps, AI steps, side effects, source of truth, completion condition, and operator visibility. AI should be used only where probabilistic reasoning adds value.

## Idempotency and retries
Every retryable workflow must tolerate duplicates. External mutations require idempotency keys or equivalent deduplication. Retries need bounded budgets and dead-letter/manual-review behavior.

## Human review
Route ambiguous or high-impact outcomes to review rather than silently forcing a decision. Define review SLA and what happens if nobody reviews.

## Provider boundaries
Validate inbound webhooks/events, verify signatures where supported, and normalize third-party data before business logic. Outbound provider calls need timeouts, backoff, and reconciliation when delivery status matters.

## Auditability
Record trigger, relevant input references, model/prompt version when AI is used, decision/result, external side effects, errors, retries, and operator overrides without unnecessarily storing sensitive content.

## Cost and abuse
Bound schedules, loops, fan-out, model usage, and per-tenant workload to prevent runaway spend or accidental mass actions.
