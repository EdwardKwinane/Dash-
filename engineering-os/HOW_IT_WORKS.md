# HOW_IT_WORKS.md — Human-Readable System Guide

Version: 1.1
Status: Active
Last updated: 2026-10-25

## 1. Purpose
Explain the product and its operation to a competent human who did not build it. This is the practical bridge between business behaviour and implementation; it does not replace architecture or API specifications.

## 2. What the product does
- Primary users: South African electronics shoppers evaluating phones, laptops, audio and accessories.
- Main jobs/workflows: browse the catalogue, filter by category, open a product, add to cart (stock-capped), review the cart, complete a demo checkout, read policy/info pages.
- Important limitations/non-goals: no real payment, no fulfilment, no accounts, no working search, no AI assistant, no admin. The catalogue is seeded demo data.

## 3. End-to-end critical flows

### Flow 1 — Browse and view a product
1. User opens `/` (server-rendered static page).
2. Homepage shows category grid, featured products and new arrivals, all read from `src/lib/data/products.ts` at build time.
3. Clicking a category goes to `/categories/[slug]`; the page filters products by `product.category === category.name`.
4. Clicking a card goes to `/products/[slug]`; unknown slugs call `notFound()` → 404.
5. Success state: product detail with price, stock, specs, quantity selector.
6. Failure state: unknown product/category returns the 404 page; empty category renders an explicit empty state.

### Flow 2 — Add to cart and demo checkout
1. User selects a quantity on the product page. Quantity is capped by `product.stock`.
2. `CartProvider` (`src/contexts/cart-context.tsx`) dispatches `ADD_ITEM`, rejects quantities above stock, and persists items to `localStorage` under `dash-cart`.
3. Cart page (`/cart`) recalculates totals and allows quantity changes/removal.
4. Checkout (`/checkout`) renders an empty state and redirects to `/cart` in an effect when the cart is empty.
5. Submitting the form simulates processing for 1.5s, clears the cart, and navigates to `/checkout/success?ref=…`.
6. Success page reads `ref` from the query string and displays it. No payment is taken, no stock is reserved, no email is sent.
7. Failure state: invalid quantities are rejected; no card data is ever requested.

### Flow 3 — Informational pages
Footer and header link to `/about`, `/contact`, `/shipping`, `/returns`, `/warranty`, `/privacy`, `/terms`. Each renders through `src/components/layout/info-page.tsx` and states plainly that the store is a demo.

## 4. Roles and permissions
| Role | Can do | Cannot do |
|---|---|---|
| Shopper (unauthenticated) | Browse, add to cart, demo checkout, read info pages | Create an account, pay, track an order, leave reviews |
| Developer/operator | Edit seeded catalogue and code, run dev/build | Access an admin UI (none exists) |

## 5. Data lifecycle
- Catalogue: static TypeScript records in `dash-app/src/lib/data/products.ts`; changes ship with a build.
- Cart: stored only in the shopper's browser (`localStorage["dash-cart"]`); cleared on demo checkout or by the user.
- Checkout form values: page memory only; discarded on navigation; never transmitted or persisted.
- No accounts, analytics, cookies for tracking, or server-side customer records exist.

## 6. Integrations
| Provider | Purpose | Data crossing boundary | If unavailable |
|---|---|---|---|
| Remote image host | Demo product imagery | Browser requests image URLs only | Product cards show broken/empty images; layout and data still work |

No payment, email, shipping, analytics or AI provider is connected.

## 7. Admin and support operations
There is no admin UI. Catalogue changes are code changes:
1. Edit `dash-app/src/lib/data/products.ts`.
2. Run `npm run build` to confirm types and static generation.
3. Restart `npm run dev` if the dev server is running.

## 8. SEO/business-owner actions
Not yet applicable. Before any public launch the owner must: choose a domain and hosting platform, add real catalogue/payment/fulfilment providers, publish genuine policy pages, and add analytics/consent if desired.

## 9. Known constraints
- **Folder path contains `#`.** Tailwind v4 cannot load stylesheets from this path (it inserts a null byte at `#`). The project uses Tailwind v3; see ADR-001 in `DECISIONS.md`. Do not upgrade Tailwind without re-testing.
- **One dev server only.** Always run `npm run dev` from the repo root. The root script does `cd dash-app && npx next dev`, so Next's working directory is the app directory. Starting `next dev` from elsewhere creates duplicate registrations and stale `.next` folders.
- **Do not use `npm --prefix dash-app`** to run Next scripts; it was a contributing cause of the duplicate-server/cross-root `.next` problem.
- Remote product images are plain `<img>` elements (with lint suppressions) because `next/image` would require adding the remote host to `next.config.ts`.
- No test suite; verification is lint, type-check, production build and manual route/visual checks.

## 10. Where to look next
- Architecture: `ARCHITECTURE.md`
- Project facts: `PROJECT_CONTEXT.md`
- Decisions: `DECISIONS.md`
- Operations: `RUNBOOK.md`
- Security: `SECURITY.md` / `THREAT_MODEL.md`
