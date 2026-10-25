# SECURITY.md — Secure-by-Default Engineering Standard

Version: 3.0

## 1. Principle
Assume clients can be modified, identifiers can be tampered with, inputs can be hostile, credentials can leak, external systems can fail, and authenticated users can still attempt unauthorized actions.

## 2. Authentication
Use mature authentication libraries/providers. Secure sessions, rotation/expiry, cookie flags, recovery flows, and MFA where risk warrants it.

## 3. Authorization
Authorization is server-side and resource-specific. UI visibility is not authorization.

Verify:
`Actor → Action → Resource → Ownership/Role/Policy → Allow/Deny`


## 3A. Threat modeling
For Medium/Large changes that introduce a new trust boundary, privileged capability, sensitive-data flow, public integration, payment flow, authentication/authorization behavior, file ingestion, or AI tool execution, complete `THREAT_MODEL.md` before implementation.

Threat modeling should identify assets, actors, entry points, trust boundaries, abuse cases, controls, and residual risk. Use the result to drive authorization tests, rate limits, audit events, and monitoring.

## 4. Multi-tenant isolation
Every tenant-scoped query must be constrained by tenant identity or equivalent authorization policy. Add tests proving cross-tenant access fails.

## 5. Secrets
Never expose secrets in source control, frontend bundles, screenshots, logs, docs, or error messages. Rotate any secret believed exposed.

## 6. Input validation
Validate type, format, size, range, enum, identifiers, filenames, MIME type, and content assumptions at boundaries.

## 7. Injection defense
Use parameterized queries, safe templating, output encoding, and strict command/tool allowlists.

## 8. API protection
Consider authentication, authorization, rate limiting, abuse detection, payload limits, replay protection, idempotency, and audit logging.

## 9. Web protections
Address XSS, CSRF, clickjacking, insecure cookies, open redirects, SSRF, unsafe CORS, and security headers.

## 10. File uploads
Treat all uploads as hostile. Validate size/type, randomize server-side names, isolate storage, scan when risk warrants it, and never execute user content.

## 11. Payments
Prefer tokenized/hosted provider flows. Verify webhook signatures. Make financial operations idempotent. Reconcile provider state against internal state.

## 12. AI security
Treat prompts, retrieved documents, tool output, and model output as untrusted.

Use:
`MODEL PROPOSAL → SCHEMA VALIDATION → POLICY CHECK → AUTHORIZATION → EXECUTION`

Never grant the model unrestricted privileged access. Use least-privilege tools, allowlists, budget limits, and audit logs.

## 13. Data protection
Classify data:
- public
- internal
- confidential
- highly sensitive

Define retention, encryption, access, deletion, and logging policy accordingly.

## 14. Auditability
Audit security-sensitive events such as:
- login/recovery changes
- role/permission changes
- admin access
- financial operations
- exports
- destructive actions
- AI tool executions affecting user data

## 15. Dependency/supply-chain security
Use lockfiles, vulnerability scanning, minimal dependencies, trusted registries, review of install scripts, and protected CI secrets.

## 16. Incident readiness
Every production project should know:
- who can rotate credentials
- how to disable a compromised integration
- how to revoke sessions
- how to roll back a release
- where audit logs live
