# PROJECT_CONTEXT.md — Project Identity and Operating Context

Version: 1.1
Status: Active
Last updated: 2026-10-25

## 1. Purpose
Fastest authoritative orientation for humans and agents entering the project. It summarizes only what is needed to make safe decisions and links to deeper records. Do not copy the PRD or architecture into this file.

## 2. Project identity
- Project name: Dash#
- Project tier (AGENTS.md §2): **Tier 2 — Small business** (portfolio-grade storefront, real users possible, cost-sensitive, no regulated data)
- Product/service type: Multi-brand electronics e-commerce storefront
- Business model: Retail (direct product sales); currently a demonstration build with no live payments or fulfilment
- Current phase: **build** (storefront implemented; commerce, AI assistant and admin deferred)
- Primary owner: Project owner (`/Users/user/Developer/Dash#`)
- Primary users: South African electronics shoppers (browse, compare, add to cart, demo checkout)
- Primary business outcome: A credible, premium storefront that can later be connected to real catalogue, payment and fulfilment providers

## 3. Approved stack
| Layer | Choice | Version/Plan | Notes |
|---|---|---|---|
| Frontend | Next.js App Router + React | 16.4.3 / 19.3.0 | Turbopack build and dev |
| Language | TypeScript | ^5 | `strict: true` |
| Styling | Tailwind CSS + PostCSS + Autoprefixer | 3.4.19 / ^8 / ^10 | **v3 deliberately, see ADR-001** |
| UI primitives | Radix Slot, CVA, clsx, tailwind-merge, lucide-react | current | `Button` + icons |
| Backend/runtime | Medusa v2 (Node >=22.23.4) in `apps/backend/`; frontend stays `dash-app/` | 2.22.0 / separate app | Separate backend; `npm run dev` in `apps/backend/` → http://localhost:9000; database `medusa-dash-backend` (PostgreSQL) |
| Database | None | — | Catalogue is a typed in-repo module |
| Auth | None | — | No accounts |
| Storage | Browser `localStorage` | — | Cart persistence only |
| Hosting | Not yet decided | — | Local dev only at present |
| Payments | None | — | Demo checkout, no card data |
| Analytics | None | — | No scripts loaded |
| Observability | None beyond Next.js dev/prod logs | — | Deferred |
| AI/model gateway | None | — | Assistant described as future work, not implemented |
| Queue/jobs | None | — | — |
| Search/vector store | None | — | Search is evaluated in-process over the seeded catalogue |
| Testing | Vitest 5 + React Testing Library (jsdom); Playwright | current | Unit/component + single-browser E2E, see ADR-005 |
| CI | GitHub Actions | — | Lint, type-check, tests, build, Chromium E2E; see ADR-011 |

Do not replace an approved stack component without an accepted ADR.

## 4. Environments and delivery
- Source repository (canonical): `https://github.com/EdwardKwinane/Dash-.git` (remote `origin`, branch `main`, public)
- Local development: `npm run dev` from `/Users/user/Developer/Dash#` → `http://localhost:3000`
- Preview: none configured
- Staging: none configured
- Production: none configured
- Primary domains: none configured
- Deployment platform: undecided
- CI/CD entry point: `.github/workflows/ci.yml` (lint → type-check → unit tests → build → Chromium E2E). No deployment job.

Never place credentials or secret values in this file.

## 5. External integrations
| Provider/System | Purpose | Source of truth? | Criticality | Owner |
|---|---|---|---|---|
| Remote image host (Unsplash; remaining demo images in `src/lib/data/products.ts`) | Demo product imagery for products without verified assets | No | Low | Project owner |
| Local image assets (`dash-app/public/products/`) + `public/products/CREDITS.md` | License-verified, exact-model corrected product imagery (CC BY 4.0, provenance recorded) | Provenance record is authoritative for those files | Low | Project owner |

No payment, email, analytics, AI or shipping provider is integrated.

## 6. Data and trust boundaries
- Primary data owners: Project owner (catalogue records); shopper (cart contents in their own browser)
- Sensitive data classes: None stored server-side. Checkout form values are page-memory only and are not transmitted.
- Tenant model: Single tenant
- High-risk actions: None implemented (no payment capture, no order fulfilment, no account creation)
- Public entry points/webhooks: None
- Data residency/retention constraints: Cart is retained in the shopper's browser until cleared; no server-side retention

## 7. Applicable service profiles
- [x] `profiles/WEB_APPLICATION.md`
- [ ] `profiles/SAAS.md`
- [x] `profiles/ECOMMERCE.md`
- [ ] `profiles/AI_AGENT.md`
- [ ] `profiles/RAG.md`
- [ ] `profiles/VOICE_AGENT.md`
- [ ] `profiles/AI_AUTOMATION.md`
- [ ] `profiles/REALTIME_SYSTEM.md`
- [ ] `profiles/API_INTEGRATION.md`
- [ ] `profiles/VERCEL_AI.md`

## 8. Product constraints and non-goals
### Constraints
- **The project folder name contains `#`.** Tailwind CSS v4 parses stylesheet paths as URLs and inserts a null byte at `#` (`ERR_INVALID_ARG_VALUE ... '/Users/user/Developer/Dash\x00#/...'`), so the project must stay on Tailwind v3. See ADR-001.
- Pure white `#FFFFFF` canvas; `#F9FAFB` only for contained surfaces.
- Brand purple `#A855F7`, hover `#9333EA`; text `#0A0A0A` / `#52525B`; borders `#E5E7EB`; 8px radii; pill badges; Inter; light mode only; ~1440px max width; no gradients.
- All prices in ZAR, VAT inclusive.
- Do not replace the storefront with a generic starter page.
- Only one dev server may run at a time; always start it from the repo root.

### Explicit non-goals (current phase)
- Real payment processing or card data handling.
- Order fulfilment, courier integration, returns processing.
- User accounts, authentication, admin UI.
- AI shopping assistant (design intent documented, not built).
- Real inventory synchronisation; stock values are seeded demo data.

## 9. Current priorities
1. Keep search, catalogue filtering, cart and demo checkout working and covered by tests.
2. Connect real catalogue data before making any availability or delivery claims.
3. Add commerce providers (payment, fulfilment) behind explicit ADRs.

## 10. Repository map
- Application source: `dash-app/src/`
  - Routes: `dash-app/src/app/` (`products`, `products/[slug]`, `search`, `categories/[slug]`, `cart`, `checkout`, `checkout/success`, info pages, `not-found`, `error`)
  - Components: `dash-app/src/components/` (`layout`, `product`, `catalog`, `search`, `home`, `ui` — navigation lives in `ui/navbar2.tsx`)
  - State: `dash-app/src/contexts/cart-context.tsx`
  - Domain logic: `dash-app/src/lib/` (`catalog.ts`, `cart.ts`, `validation.ts`, `format.ts`, `product-badge.ts`)
  - Data: `dash-app/src/lib/data/products.ts`
  - Types: `dash-app/src/types/product.ts`
- Tests: `dash-app/src/**/*.test.{ts,tsx}` (Vitest) and `dash-app/e2e/*.spec.ts` (Playwright)
- Test config: `dash-app/vitest.config.mts`, `dash-app/vitest.setup.ts`, `dash-app/playwright.config.ts`
- Local test launcher: `dash-app/scripts/run-vitest.mjs` (see ADR-010)
- CI: `.github/workflows/ci.yml`
- Migrations: none
- Infrastructure: none
- Designs: brand rules in `engineering-os/DESIGN_SYSTEM.md`; logo at repo root `Logo.jpg` (served as `dash-app/public/logo.jpg`)
- Documentation: `engineering-os/`
- Runbooks: `engineering-os/RUNBOOK.md`

## 11. Important commands
```bash
# install (application dependencies)
cd "/Users/user/Developer/Dash#" && cd dash-app && npm install

# local development (always from repo root)
cd "/Users/user/Developer/Dash#" && npm run dev      # http://localhost:3000

# lint/typecheck
cd "/Users/user/Developer/Dash#" && npm run lint
cd "/Users/user/Developer/Dash#" && npm run typecheck

# unit/component tests (use this, not bare `npx vitest`; see ADR-010)
cd "/Users/user/Developer/Dash#" && npm test

# end-to-end tests (starts a dev server unless PLAYWRIGHT_BASE_URL is set)
cd "/Users/user/Developer/Dash#" && npm run test:e2e

# build
cd "/Users/user/Developer/Dash#" && npm run build

# database/migrations
# (none)
```

## 12. Current risks and open decisions
- **Recurring pitfall:** starting `next dev` from a different working directory (or via `npm --prefix`) creates competing dev-server registrations and stale `.next` directories. Always use the root script. See `HOW_IT_WORKS.md`.
- **Repository history purge completed (2026-10-25).** `dash-app/node_modules.bak` was removed from every commit and `main` republished as `ac09c1f…` (previously `2716c04…`). `.git` fell from 66 MB to ~0.6 MB and the pack from 65.11 MiB to 487.43 KiB (≈99.3%); the 86.27 MiB `next-swc.darwin-arm64.node` blob and all 13,735 backup blobs are no longer reachable. The current tree is unchanged (`c2b3040…`, 91 files) and lint, type-check, build and route checks pass. Recovery bundle: `.migration-backup/history-audit-20261025-090411/Dash-pre-rewrite.bundle`. See ADR-004.
- Catalogue is seeded demo data; no availability, delivery or warranty claim is real.
- No live inventory: stock is a static number per product, so overselling is impossible only because no order is fulfilled.
- Delivery and tax are deliberately unset in the demo checkout; the total equals the subtotal. Do not add invented fees.
- `npx vitest` cannot run from the `#` path; use `npm test`. CI is unaffected.
- Do not re-add `src/app/loading.tsx` without re-testing duplicate DOM ids (ADR-008).
- Deployment platform, payment provider and fulfilment provider remain undecided.

## 13. Last verified
- Date: 2026-10-25
- Verified by: AI agent (OpenCode)
- What was checked: `npx eslint .` exit 0; `npx tsc --noEmit` exit 0; `npm test` 12 files / 100 tests passed; `npm run build` exit 0 (29 static/SSG pages); `npx playwright test` 6/6 passed against the production server on port 3100; route smoke test returned 200 for all public routes and 404 for `/products/does-not-exist`; browser console clean on 7 routes; 390 px layout has no horizontal overflow.
- Post-publication check (2026-10-25): remote `main` = `ac09c1f…`; a fresh fetch from GitHub contains 0 `dash-app/node_modules.bak` objects; working checkout aligned to `origin/main` with `npm run lint`, `npx tsc --noEmit` and `npm run build` all exit 0.
- Note: the quality-sprint changes are on `feature/storefront-quality-sprint` and were not pushed when this record was written; the CI workflow has not yet executed on GitHub.
