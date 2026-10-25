# WEB_APPLICATION.md — Service Profile

Version: 1.0
Applies when: building a public or authenticated web application.

## Product boundaries
Define public vs authenticated areas, primary journeys, browser support, responsive behavior, and whether SEO matters for each route.

## Frontend
- Use the project's approved design system and semantic tokens.
- Prefer server rendering/static generation where it improves first load or SEO; use client state only when interaction requires it.
- Every async surface needs loading, empty, error, and success behavior.
- Validate accessibility, responsive layouts, theme behavior, and Core Web Vitals.

## Backend
Keep authoritative business rules and authorization server-side. Do not trust client-supplied ownership, role, price, entitlement, or status fields.

## Data and APIs
Use typed contracts, bounded pagination, safe mutations, and explicit ownership. Avoid direct browser-to-database access unless the platform's policy layer is deliberately designed and tested for it.

## Security
Protect sessions, forms, uploads, public endpoints, and admin routes. Rate-limit abuse-prone actions such as login, password recovery, search, contact forms, and expensive generation.

## Shipping gate
Critical user journeys must have E2E coverage at the rigor appropriate to the project tier, and public pages must meet accessibility/performance requirements before release.
