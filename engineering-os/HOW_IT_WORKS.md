# HOW_IT_WORKS.md — Human-Readable System Guide

Version: 1.2
Status: Active
Last updated: 2026-10-25

## 1. Purpose
Explain the product and its operation to a competent human who did not build it. This is the practical bridge between business behaviour and implementation; it does not replace architecture or API specifications.

## 2. What the product does
- Primary users: South African electronics shoppers evaluating phones, laptops, audio and accessories.
- Main jobs/workflows: search the catalogue, filter and sort it, open a product, add to cart (stock-capped), review the cart, complete a demo checkout, read policy/info pages.
- Important limitations/non-goals: no real payment, no fulfilment, no accounts, no AI assistant, no admin, no live inventory. The catalogue is seeded demo data and delivery/tax are not configured.

## 3. End-to-end critical flows

### Flow 1 — Search, filter and sort
1. The header search field submits to `/search?q=…` (no full page reload). `/search` is a server component that reads `searchParams`.
2. `parseCatalogQuery` (`src/lib/catalog.ts`) trims and normalises the term, validates category/brand/price/stock/sort values and ignores anything unknown.
3. `queryCatalog` matches every whitespace-separated token against product name, brand, category, subcategory, SKU, description, key selling points and specification values. Matching is case- and diacritic-insensitive.
4. Filter changes (category, brand, price band, in-stock) and sorting write the new query to the URL; the server re-renders the result list. Because the query is in the URL, results survive reloads and can be shared.
5. Success state: a `role="status"` count, the matching products, and a working sort control.
6. Empty state: "No products found" with "Clear search and filters" (returns to `/search`) and "Browse all products". No invented results or suggestions.

### Flow 2 — Browse the catalogue
1. User opens `/products`, optionally with filters in the URL.
2. The page uses the same parser/filter/sort functions as search, so counts and behaviour are identical.
3. Clicking a category on the homepage goes to `/categories/[slug]`, which shows that category's products and links into the filtered catalogue.
4. Clicking a card goes to `/products/[slug]`.

### Flow 3 — View a product
1. `/products/[slug]` is a server component with `generateStaticParams` and `dynamicParams = false`; only slugs in the seeded catalogue exist.
2. An unknown slug calls `notFound()` and returns a real HTTP 404.
3. The page shows price, demo stock, specifications, image and a client `ProductPurchasePanel` with a quantity stepper clamped to `1..stock`.
4. Adding to cart shows inline feedback (`role="status"`); adding beyond stock shows an inline `role="alert"` and the button is disabled at the limit. There is no `alert()`.
5. If `inStock` is false the panel disables the action and explains why.

### Flow 4 — Add to cart and demo checkout
1. `CartProvider` (`src/contexts/cart-context.tsx`) validates the request against current stock, dispatches the accepted mutation and writes the cart to `localStorage["dash-cart"]`.
2. On load, the cart is restored once; malformed JSON, unknown product ids and invalid quantities are discarded. The empty first render never overwrites a saved cart.
3. `/cart` shows line items with accessible increase/decrease/remove controls, disabled controls at stock, and totals derived from the same state. The empty state links to products and search.
4. `/checkout` cannot be used with an empty cart. Fields are validated in `src/lib/validation.ts`; errors appear inline and in a summary, and focus moves to the first invalid field. A duplicate-submit guard disables the button while processing.
5. A valid submit simulates a short delay, clears the cart and navigates to `/checkout/success?ref=DASH-DEMO-XXXXXX`. The success page validates the reference format and repeats that nothing was charged, reserved, emailed or shipped.
6. Delivery and tax are shown as "not configured in this demo"; the total equals the subtotal. No card data is requested.

### Flow 5 — Informational pages
Footer and header link to `/about`, `/contact`, `/shipping`, `/returns`, `/warranty`, `/privacy`, `/terms`. Each renders through `src/components/layout/info-page.tsx` and states plainly that the store is a demo.

## 4. Roles and permissions
| Role | Can do | Cannot do |
|---|---|---|
| Shopper (unauthenticated) | Browse, add to cart, demo checkout, read info pages | Create an account, pay, track an order, leave reviews |
| Developer/operator | Edit seeded catalogue and code, run dev/build | Access an admin UI (none exists) |

## 5. Data lifecycle
- Catalogue: static TypeScript records in `dash-app/src/lib/data/products.ts`; changes ship with a build.
- Cart: stored only in the shopper's browser (`localStorage["dash-cart"]`); restored once on load, persisted on every accepted mutation, cleared on demo checkout or by the user.
- Checkout form values: page memory only; discarded on navigation; never transmitted or persisted.
- No accounts, analytics, cookies for tracking, or server-side customer records exist.

## 6. Integrations
| Provider | Purpose | Data crossing boundary | If unavailable |
|---|---|---|---|
| Remote image host | Demo product imagery | Browser requests image URLs only | Product cards show broken/empty images; layout and data still work |

No payment, email, shipping, analytics or AI provider is connected.

## 7. Admin and support operations
There is no admin UI. Catalogue changes are code changes:
1. Edit `dash-app/src/lib/data/products.ts` (prices are integer cents).
2. Run `npm test` and `npm run build` to confirm the catalogue assumptions and static generation.
3. Restart `npm run dev` if the dev server is running.

## 8. SEO/business-owner actions
Not yet applicable. Before any public launch the owner must: choose a domain and hosting platform, add real catalogue/payment/fulfilment providers, publish genuine policy pages, and add analytics/consent if desired.

## 9. Known constraints
- **Folder path contains `#`.** Tailwind v4 cannot load stylesheets from this path (it inserts a null byte at `#`). The project uses Tailwind v3; see ADR-001 in `DECISIONS.md`. Do not upgrade Tailwind without re-testing.
- **Bare `npx vitest` does not work from this path.** Use `npm test`, which routes through `dash-app/scripts/run-vitest.mjs` (ADR-010). CI is unaffected.
- **One dev server only.** Always run `npm run dev` from the repo root. The root script does `cd dash-app && npx next dev`, so Next's working directory is the app directory. Starting `next dev` from elsewhere creates duplicate registrations and stale `.next` folders.
- **Do not use `npm --prefix dash-app`** to run Next scripts; it was a contributing cause of the duplicate-server/cross-root `.next` problem.
- **Dev requests from `127.0.0.1` need `allowedDevOrigins`.** Next 16 trusts only the startup hostname; the setting in `next.config.ts` keeps Playwright and `curl` working (ADR-009).
- **No root `loading.tsx`.** With Next 16.4.3 it left a hidden duplicate DOM node in a large share of loads; see ADR-008 before re-adding it.
- Product images use `next/image`; the remote host is allow-listed in `next.config.ts`. Adding a new image host requires updating `remotePatterns`.
- Verification is automated: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`, plus the CI workflow.

## 10. Where to look next
- Architecture: `ARCHITECTURE.md`
- Project facts: `PROJECT_CONTEXT.md`
- Decisions: `DECISIONS.md`
- Operations: `RUNBOOK.md`
- Security: `SECURITY.md` / `THREAT_MODEL.md`
