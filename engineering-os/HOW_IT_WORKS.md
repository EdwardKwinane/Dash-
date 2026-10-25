# HOW_IT_WORKS.md — Human-Readable System Guide

Version: 1.0
Status: Project-specific template

## 1. Purpose
Explain the product and its operation to a competent human who did not build it. This document is not a substitute for architecture or API specifications; it is the practical bridge between business behavior and technical implementation.

## 2. What the product does
- Primary users:
- Main jobs/workflows:
- Important limitations/non-goals:

## 3. End-to-end critical flows
For each critical flow describe the user action, system processing, data changes, provider calls, success state, and common failure state.

### Flow 1

### Flow 2

## 4. Roles and permissions
| Role | Can do | Cannot do |
|---|---|---|
| | | |

## 5. Data lifecycle
Describe what important user/business data is collected, where it is stored, how long it is retained, and how deletion/export requests are handled.

## 6. Integrations
For each external provider explain its purpose, what data crosses the boundary, and what happens when the provider is unavailable.

## 7. Admin and support operations
Document safe everyday operations that a non-developer owner may need: user support, content/product changes, refunds, imports/exports, feature flags, or moderation.

## 8. SEO/business-owner actions
Record non-code tasks required for successful operation (for example domain/DNS ownership, Google Business Profile, analytics access, provider billing ownership, app-store accounts).

## 9. Known constraints
-

## 10. Where to look next
- Architecture: `ARCHITECTURE.md`
- Project facts: `PROJECT_CONTEXT.md`
- Decisions: `DECISIONS.md`
- Operations: `RUNBOOK.md`
- Security: `SECURITY.md` / `THREAT_MODEL.md`
