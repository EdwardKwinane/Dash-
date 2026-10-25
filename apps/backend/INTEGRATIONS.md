# Backend Sprint 01 — Integration Findings (official docs only)

Sources: `docs.medusajs.com/learn/installation`, `resources/commerce-modules/region`, `resources/integrations`, `resources/integrations/guides/sanity`, `resources/integrations/guides/paypal`, `resources/create-medusa-app`.

## Versions used / verified
- `@medusajs/framework`: 2.22.1 (latest as of this sprint)
- `create-medusa-app`: 2.22.1
- Prerequisites: Node >=22.22.0 (LTS); Git CLI; PostgreSQL installed + running; our env is v24.21.0 ✅

## Layout / structure
- `dash-app/` preserved unchanged; `apps/backend/` created as sibling standalone package (ADR-014).
- No root npm workspaces enabled; no `turbo.json` at repo root.
- Backend starts from `apps/backend/` with `npm run dev` → server `http://localhost:9000`, Admin `http://localhost:9000/app`.

## PostgreSQL / database
- Docker unavailable → documented local prerequisite (Homebrew postgresql@17, running at `localhost:5432`).
- DB created: `medusa-dash-backend`; migrations applied; initial-data-seed completed (Europe/EUR region, demo products).
- `.env` placeholders in `.env.example`; `.env` excluded from Git.

## South Africa / ZAR market (prepared; not fully configured live yet)
- Region module (`resources/commerce-modules/region`) supports `currency_code`, countries, country-level tax.
- Default from seed: `Europe` / `eur`. Owner/admin should add SA region (`currency_code: "zar"`, country `za`) via Admin → Settings → Regions.
- Product prices in `dash-app/src/lib/data/products.ts` are already ZAR integer-cent values; mapping ready in `apps/backend/MAPPING.md`.

## Integration boundaries (no implementations yet — documented only)

| Provider | Medusa support | Evidence (official docs) | Status for Sprint 01 |
|---|---|---|---|
| **Sanity (CMS)** | Yes — full guide | `docs.medusajs.com/resources/integrations/guides/sanity`; `@sanity/client` SDK; custom module (`src/modules/sanity/`); `defineLink` Product↔Sanity; subscriber on `product.created`/`updated`; workflow `sanity-sync-products` | Documented; requires project setup + token (`SANITY_API_TOKEN`, `SANITY_PROJECT_ID`) |
| **Clerk (auth)** | Custom only | Auth Module supports Google/GitHub/Okta (`resources/commerce-modules/auth/auth-providers/`); `Custom Authentication Providers` supported | No native Clerk provider → future custom Auth Module Provider needed; Clerk identity→Medusa customer mapping must be server-side verified |
| **PayPal (payment)** | Yes — full guide | `resources/integrations/guides/paypal`; `@paypal/paypal-server-sdk`; `AbstractPaymentProvider`; provider config via `medusa-config.ts`; webhook URL `/hooks/payment/paypal_paypal`; `PAYPAL_CLIENT_ID/SECRET/ENVIRONMENT/WEBHOOK_ID` | Documented; requires sandbox/live credentials + webhook endpoint |
| **Yoco (payment)** | **None found** | Not listed in `resources/integrations` (Payment providers: Stripe + PayPal only); no `@medusajs` yoco package | **Requires custom Payment Module Provider** — compatibility unknown; must verify Yoco server SDK / webhook format before building |
| **AWS (hosting)** | Partial | `AWS S3` file provider (`resources/integrations/guides/s3`); `Medusa Cloud`; no specific deployment guide for self-hosted AWS | Deferred; prepare secrets/logging/networking plan for Sprint 02+ |

## Unresolved decisions / risks (recorded honestly)
- **Yoco compatibility**: no evidence of maintained Medusa provider; can only proceed after owner confirms Yoco API docs + SDK availability.
- **Region / currency**: SA region (ZAR) not auto-seeded; must create via Admin or custom seed after first admin login.
- **Clerk mapping**: server-side Clerk→Medusa customer linking needs design (JWT validation, identity lookup, order authorization).
- **Real inventory / orders**: not implemented (demo checkout preserved); when migration starts, `products.ts` categories/products must enter Medusa via `createProductsWorkflow` / `createProductCategoriesWorkflow`.
- **AWS provisioning**: no resources created; not required for Sprint 01.
