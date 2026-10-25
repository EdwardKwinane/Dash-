# CODING_STANDARDS.md — Production Coding Standard

Version: 2.0

## 1. Priority order
Correctness → readability → maintainability → security → testability → performance.

## 2. General rules
- Prefer explicit, boring, understandable code.
- Keep modules cohesive and dependencies directional.
- Avoid hidden side effects and global mutable state.
- Validate at boundaries.
- Use typed interfaces where available.
- Avoid premature abstractions.
- Remove dead code instead of commenting it out.
- Keep business rules out of UI components.

## 3. Naming
Use domain language. Names should explain purpose without needing comments.

Avoid `data`, `temp`, `thing`, `handleStuff`, `misc`, `utils2`.

## 4. Functions and modules
- One conceptual responsibility per function/module.
- Prefer early returns to deep nesting.
- Keep public interfaces small.
- Separate orchestration from pure business logic.
- Preserve error context.

## 5. Type and schema safety
- Avoid unsafe escape hatches such as unrestricted `any`.
- Validate environment variables at startup.
- Runtime-validate network, file, webhook, and AI payloads.
- Prefer generated/shared types for API contracts where possible.

## 6. Error handling
Errors should be classified into:
- validation
- authentication
- authorization
- not found
- conflict
- rate limit
- dependency failure
- internal failure

User-facing messages must be safe; logs may contain more context but never secrets.

## 7. Configuration
Never hardcode secrets, environment-specific endpoints, or credentials. Centralize configuration and make required settings fail fast.

## 8. Frontend standards
Every interactive flow must account for:
- loading
- empty
- error
- success
- disabled
- permission denied
- retry/degraded behavior where relevant

Use semantic HTML, keyboard navigation, visible focus, labels, alt text, and accessible contrast. Full requirements live in `ACCESSIBILITY.md` and `PERFORMANCE.md` — this section is a summary, not the source of truth.

## 9. Backend standards
- Keep controllers/routes thin.
- Put reusable business logic in services/domain modules.
- Keep persistence logic isolated.
- Use transactions for multi-step consistency.
- Avoid N+1 and unbounded queries.
- Paginate collections.

## 10. API/client boundaries
All external calls must define timeout and error behavior. Retry only operations that are safe to retry.

## 11. Logging
Use structured logs. Include correlation/request identifiers where useful. Never log passwords, tokens, raw card data, or unnecessary personal data.

## 12. Dependency hygiene
Pin or lock dependencies appropriately. Remove unused packages. Review major upgrades separately from feature work.

## 13. Refactoring
Do not mix large unrelated refactors into feature changes. If refactoring is required, preserve behavior with tests and isolate the change.

## 14. Code review checklist
Review for:
- correctness
- naming
- cohesion
- duplication
- authorization
- validation
- data consistency
- query efficiency
- error semantics
- test coverage
- accessibility
- documentation
