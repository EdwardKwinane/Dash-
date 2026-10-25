# CHANGELOG

## Verified product image resolution (2026-10-25)

Branch: `feature/storefront-quality-sprint`, stacked on the catalogue-consistency sprint. Not pushed.

### What changed
- **Replaced two of the three confirmed image mismatches with verified exact-model assets**, both **CC BY 4.0** from Wikimedia Commons, verified visually at full resolution before use:
  - `samsung-galaxy-s25-ultra.jpg`: the in-frame demo-sticker reads **SM-S938B/DS 256GB** (the official S25 Ultra model code), the retail placard reads "Galaxy S25 Ultra", S Pen pad and 2025 signage visible; author Jakub CA; original 3317×2488.
  - `logitech-mx-master-3s.jpg`: unmistakable sculpted MX Master body with "logi" branding, thumb-rest scallop and dual thumb buttons; author Hayden Schiff (`IagoQnsi`), deliberate 3S photo series, October 2025 EXIF date.
  - Both were downscaled to 1600 px and had EXIF/XMP/IPTC segments stripped (no capture-hardware/personal metadata ships in the repo); `products.ts` points the two records at the local files and seeds precise `altText` describing the verified content.
- **Dell XPS 13 Plus remains unresolved by evidence**: Wikimedia Commons has zero photos of the 9320 ("XPS 13 Plus" / "XPS 9320" searches → 0 hits; the existing "Dell XPS 13 9350" file is the later model line), and manufacturer/retailer imagery carries no redistribution license. The current mismatched asset is kept, per policy, and recorded.
- Added the provenance/licensing record `dash-app/public/products/CREDITS.md`: per-file source page, author, license, modifications, attribution obligation lines, residual uncertainty, and the documented status of all four remaining Unsplash-hosted images.
- **Extended the catalogue guardrails** (`src/lib/data/products.test.ts`): local `/products/...` images must exist in `public/`, be traversal-safe, and their filename must include the product slug; Unsplash-hosted images must remain on the approved https host; seeded `altText` must be non-empty; the in-repo asset edge is now enforced, not just asserted.
- Config unchanged: `images.remotePatterns` still lists only Unsplash — local asset paths require no allowlist. **ADR-013** records the local-hosting decision.

### Files
- Created: `dash-app/public/products/samsung-galaxy-s25-ultra.jpg`, `dash-app/public/products/logitech-mx-master-3s.jpg`, `dash-app/public/products/CREDITS.md`.
- Changed: `dash-app/src/lib/data/products.ts` (2 image records + altText), `dash-app/src/lib/data/products.test.ts` (extended guardrails), `engineering-os/DECISIONS.md` (ADR-013), `engineering-os/PROJECT_CONTEXT.md` (integration table).

### Verified
- `npm run lint` → exit 0; `npx tsc --noEmit` → exit 0; `npm test` → **14 files / 123 tests passed**; `npm run build` → success; `npx playwright test` → **15 passed** (recorded after the change; see table below for the actual run).
- Visual inspection of the replaced products' surfaces (homepage hero + category cards, product detail, cart, checkout) at 1440/768/390 px: local images render correctly through `next/image` (object-cover crops are sensible for the new aspect ratios), no overflow, no console errors.

## Product presentation consistency & catalogue trust sprint (2026-10-25)

Branch: `feature/storefront-quality-sprint`, stacked on the homepage polish sprint. Not pushed.

### What changed
- New shared helper `dash-app/src/lib/product-badge.ts` (`productBadgeLabel`) — the single source of truth for the Sale/New/Featured badge (precedence Sale > New > Featured), used by both the product card and the product detail page so listing and detail can never disagree. The card's inline badge conditionals were replaced with the helper (no behaviour change).
- Product detail page (`products/[slug]`): brand line restyled to the same uppercase kicker the cards use, and the product's badge now appears next to it in the same purple pill as on cards — the two views now present identical identity and price-discount signals. No new claims: the badge comes from catalogue flags, the strikethrough compare-at price and "reviews in demo data" wording were already there.
- Demo checkout: order-summary thumbnails corrected from 4px `rounded` to the 8px `rounded-card` radius, matching every other thumbnail (cards, cart, detail, homepage).
- New automated guardrails: `src/lib/data/products.test.ts` enforces catalogue invariants the whole storefront relies on (unique id/slug/SKU, route-safe slugs, positive integer-cent prices with `compareAtPrice > price`, stock/`inStock` coherence, real category assignment via `getProductsInCategory`, images only from the approved https Unsplash host, complete descriptive fields, sale claims backed by a compare-at price) and `src/lib/product-badge.test.ts` locks the badge precedence.

### Catalogue/image audit findings (documented, no replacements)
All six seeded product images were downloaded and visually inspected. Per the image-replacement policy, replacements require a verified matching asset; the repository has none (public/ contains only the brand logo, svgs) and Unsplash's site/API blocked automated verification attempts (HTTP 307/401 on `napi` search and `/s/photos` pages, plus headless-browser scraping produced no usable results). **No image was replaced.** Findings for review:
1. **Galaxy S25 Ultra** — the photo demonstrably shows a Galaxy **S21 5G** (the phone lies on its retail box printed "S21 5G"). Confirmed model-level mismatch; the most prominent case (hero showcase + product page). Needs an owner-provided or verifiably sourced S25 Ultra asset.
2. **Dell XPS 13 Plus** — the photo is unmistakably a **MacBook** (Apple unibody). Confirmed brand-level mismatch. Needs a verified XPS asset.
3. **Logitech MX Master 3S** — the photo shows a compact symmetric travel-style mouse (M325-class), not the MX Master's characteristic sculpted ergonomic body. Confirmed model-level mismatch. Needs a verified asset.
4. MacBook Pro 14" M4 — a lit-logo pre-2016 MacBook: brand correct, model unverifiable. Sony WH-1000XM5 / iPad Air 11" M3 — type correct, model unverifiable. Left unchanged; not actionable.
- Presentation findings that were corrected: the detail page's divergent brand/badge presentation (badges existed only on cards) and the checkout thumbnail radius. Alt text was audited: because no `altText` is seeded, every meaningful product image falls back to the product name consistently across all six surfaces — acceptable and consistent, no change needed.

### Files
- Created: `dash-app/src/lib/product-badge.ts` (+ test), `dash-app/src/lib/data/products.test.ts`.
- Changed: `dash-app/src/app/products/[slug]/page.tsx`, `dash-app/src/app/checkout/page.tsx`, `dash-app/src/components/product/product-card.tsx` (badge via shared helper).

### Verified
- `npm run lint` → exit 0; `npx tsc --noEmit` → exit 0; `npm test` → **14 files / 121 tests passed** (121 = 107 previous + 14 new guardrail tests); `npm run build` → success; `npx playwright test` → **15 passed**.
- Visual inspection with headless Chrome at **1440 / 768 / 390px** on the product detail page (Sony WH-1000XM5, with Sale badge) and the demo checkout (pre-seeded 2-item cart): no horizontal overflow (`scrollWidth === clientWidth` at all widths), no heading skips, no duplicate ids, no images missing `alt`, console clean; checkout totals arithmetic verified on-screen (2 × R29,999.00 + R1,499.00 = R61,497.00).

## Homepage visual polish — hero showcase, category discovery, product cards (2026-10-25)

Branch: `feature/storefront-quality-sprint`, stacked on the navbar2 sprint. Not pushed.

### What changed
- `dash-app/src/app/page.tsx`:
  - The hero's right-hand dev-stats panel was replaced by a **featured-product showcase card** built from real catalogue data (first `featured` product: image, name, formatted ZAR price, "View product" link to `/products/samsung-galaxy-s25-ultra`). The honest demo-data facts are folded into a compact caption line under the CTAs: `7 categories · 6 products · prices in ZAR · seeded demo data`.
  - **Category cards are now visual**: each of the seven category cards shows a representative product image from that category's real products (`alt=""` — decorative, the adjacent heading conveys meaning), the real product count, and the existing description. Categories with zero products ("Speakers & Audio", "Monitors & Displays") get an honest "New products arrive here first" surface instead of a misleading image.
  - Section rhythm unified to `py-12` with aligned heading + sub-copy and "View all" links already backed by `/products`.
  - The featured grid changed from 4 to `lg:grid-cols-3` (3 real featured products) and the new-arrivals grid from a claimed 4-col to 3-col with only the 2 real arrivals — no unbalanced empty halves.
  - Thesr-only `assurance-heading` is now a real `<h2>` with the third card's heading hierarchy corrected (no skipped levels).
- `dash-app/src/components/product/product-card.tsx`: **brand kicker** (uppercase, tracking-wide), title `line-clamp-2` so long names wrap cleanly with even card heights, a "View details →" footer strip, visible-focus border on the card link, and the previously-unused `priority` prop is now actually applied to the image (`fetchpriority` for the first card / LCP).
- `dash-app/src/lib/data/products.ts`: added `getProductsInCategory()` so the homepage derives category membership from the same source as `/categories/[slug]` (single source of truth; no duplicated filter logic).
- Created `dash-app/e2e/homepage-visual.spec.ts` (4 tests: hero CTA + showcase navigation, real category card counts → real slug, shared card behaviour, mobile no-overflow).
- No dependency changes; Tailwind stays v3.4.19 (ADR-001); no root `loading.tsx` added (ADR-008).

### Files
- Changed: `dash-app/src/app/page.tsx`, `dash-app/src/components/product/product-card.tsx`, `dash-app/src/lib/data/products.ts`.
- Created: `dash-app/e2e/homepage-visual.spec.ts`.

### Verified
- `npm run lint` → exit 0; `npx tsc --noEmit` → exit 0; `npm test` → **107 tests passed**; `npm run build` → success; `npx playwright test` → **15 passed** (the 4 new homepage tests plus the 11 existing navbar/mobile/journey tests).
- Visual inspection with headless Chrome at **1440px, 768px and 390px** (hero, megamenu, mobile menu, full-page bottom): no horizontal overflow (`scrollWidth === clientWidth` at all three widths), no heading-level skips, no duplicate ids, 0 unlabeled controls, no main images missing `alt`, console clean (no errors, warnings or hydration issues).

### Known limitations
- The hero showcase image is owner-owned seeded catalogue imagery: the photo shows a Galaxy S21+ while the product name reads "Galaxy S25 Ultra". Left as-is deliberately — no image replacement was authorized.
- "Speakers & Audio" and "Monitors & Displays" remain zero-product categories and intentionally render the empty-state surface.

## Navigation rebuild — navbar2 mega-menu (2026-10-25)

Branch: `feature/storefront-quality-sprint`, stacked on the quality sprint. Not pushed.

### What changed
- Added `dash-app/src/components/ui/navbar2.tsx` and replaced the two-tier `header.tsx` in the root layout with it, so only one header renders.
- **Shop mega-menu**: a disclosure button (not hover-only) reveals a 680 px panel listing all seven real categories with their descriptions and linking to `/categories/<slug>`, a featured product card taken from real catalogue data (name, formatted ZAR price, image, link to the product page), and a "Browse all products →" link to `/products`.
- **Fixed desktop links**: Laptops → `/categories/laptops-computers`, Smartphones → `/categories/smartphones`, Audio → `/categories/headphones-earbuds`, Accessories → `/categories/accessories`.
- **Support menu**: small disclosure dropdown to the existing `/contact`, `/shipping`, `/returns`, `/warranty` pages.
- **Deliberately omitted**: "Deals" (no deals route or data exists), an account entry point (no account experience exists), and any language selector. No dead `#` links — a unit test asserts every rendered link has a real `href`.
- **Search**: the header reuses the existing `SearchBar` (single implementation), shown inline on desktop and inside the mobile menu below `lg`.
- **Cart**: the cart icon keeps the real count from the cart context with a pill badge and an accessible label (`Cart, N items` / `Cart, empty`); hydration-safe via the existing `isHydrated`-aware context.
- **Mobile (below `lg`)**: compact row (logo, cart, hamburger toggle with `aria-expanded`/`aria-controls`); the menu panel holds search, "All products", all seven categories, and support links; closes on link click, Escape, and outside pointer-down.
- **Interaction safety**: opening one menu closes the others; Escape returns focus to the trigger; outside `pointerdown` closes without stealing clicks; navigation closes all menus (route-snapshot state, no setState-in-effect).
- **Motion**: open panels animate 200 ms ease-out via a Tailwind keyframe; the global `prefers-reduced-motion` rule neutralises it. No `motion` or `react-icons` dependency was added — existing `lucide-react` and CSS cover everything.
- Added a `menu-reveal` keyframe/animation token to `tailwind.config.ts`.

### Files
- Created: `dash-app/src/components/ui/navbar2.tsx`, `dash-app/src/components/ui/navbar2.test.tsx`, `dash-app/e2e/navbar.spec.ts`.
- Deleted: `dash-app/src/components/layout/header.tsx`, `dash-app/src/components/layout/header.test.tsx`.
- Changed: `dash-app/src/app/layout.tsx`, `dash-app/tailwind.config.ts`.

### Verified
- `npm run lint` → exit 0; `npx tsc --noEmit` → exit 0.
- `npm test` → 12 files / **107 tests passed** (navbar2 unit tests cover mega-menu toggle, Escape + focus return, outside-click close, close-on-navigate, real catalogue links, cart label, search submission, and the mobile menu).
- `npm run build` → success.
- `npx playwright test` → **11 passed** (mega-menu open/close/outside-click/navigate, support menu, header search, cart badge count, plus the existing journey and mobile suites).
- Visual inspection with headless Chrome at 1440 px, 768 px and 390 px: real logo, no horizontal overflow (`scrollWidth === clientWidth` at all three widths), no duplicate ids, no console errors or warnings, panel overlaps the page content cleanly without layout shift.

## Storefront quality sprint — search, catalogue, cart, demo checkout, tests and CI (2026-10-25)

Branch: `feature/storefront-quality-sprint` (from `75b4b44`). Not pushed at the time of writing; `main` is unchanged.

### Pre-existing defects found and fixed
- **Search was decorative.** The header search input did not navigate anywhere, and no `/search` route existed. The homepage and product pages advertised search that could not work.
- **Catalogue filters and sorting did not exist.** `/products` rendered every product in source order; there was no category, brand, price, availability or sort control.
- **Unknown product slugs returned HTTP 200.** `notFound()` was streamed after the shell had been sent, so `/products/does-not-exist` was not a real 404.
- **`alert()` was the only add-to-cart feedback**, and it was the only validation feedback on quantity/stock.
- **Cart could exceed stock** (client-side quantity was not clamped) and persistence was restored in an effect that could overwrite a returning shopper's saved cart.
- **Checkout invented an R150 delivery fee** and showed no tax line, so the totals were not honest. It also allowed duplicate submits and used browser-native validation only.
- **Hydration could fail silently in development.** Next 16 trusts only the hostname it was started on; requests from `127.0.0.1` were blocked, so React never hydrated (Playwright and `curl` use `127.0.0.1`).
- **A streamed duplicate DOM node appeared in roughly 40% of production loads.** The root `loading.tsx` left a `<div hidden id="S:0">` staging node containing a second copy of the page, duplicating element ids and text.
- **`/favicon.ico` returned 404** on every page.
- **Next.js warned that the header/footer logo had only one dimension changed.**
- **Heading order skipped from `h1` to `h3`** in the footer (and therefore on every page).
- **Dead navigation links** (`/account`, `/wishlist`) pointed at routes that do not exist.
- **Copy implied capabilities that do not exist**: "AI-powered" in metadata/footer, and an assistant section that read as if it were live.

### Search and discovery
- New `/search` route (`src/app/search/page.tsx`) with server-side query evaluation over the in-repo catalogue.
- `src/lib/catalog.ts`: query parsing/validation, diacritic- and case-insensitive normalisation, whitespace collapsing, multi-token matching across name, brand, category, subcategory, SKU, description, key selling points and specification values, filters (category, brand, price band, availability) and sorting (featured, price ascending/descending, name).
- Search state lives entirely in the URL (`?q=&category=&brand=&price=&stock=&sort=`), so results are shareable, reload-safe and work without JavaScript. Invalid values degrade to defaults rather than erroring.
- `SearchBar`, `CatalogFilters`, `CatalogSort` and `ProductResults` components: labelled controls, a `role="status"` result count, explicit empty state with "Clear search and filters", and no full page reloads.
- `/products` now supports the same filters and sorting with accurate counts.
- Category pages link into the filtered catalogue instead of rendering an ad-hoc list.

### Product detail
- Converted to an async server component with `generateStaticParams`, per-product metadata, `notFound()` and `dynamicParams = false`, so unknown slugs return a real 404.
- Client `ProductPurchasePanel` replaces `alert()` with inline, `role="status"`/`role="alert"` feedback, a quantity stepper clamped to `1..stock`, a disabled add button at stock, and an explicit "out of stock" state.

### Cart
- `src/lib/cart.ts` holds the reducer, stock clamping, `parseStoredCart` (rejects malformed JSON and unknown products, clamps quantities) and serialisation.
- `cart-context.tsx` restores once, persists from the dispatch itself, keeps a synchronous state snapshot for rapid clicks, and exposes `isHydrated` via `useSyncExternalStore` (server snapshot `false`, client `true`) — no `setState` in an effect and no hydration mismatch.
- Cart page: reliable increment/decrement/remove, per-line and order totals derived from the same state, disabled controls at stock, accessible labels, empty state.

### Pricing and demo checkout
- All prices remain integer cents and are formatted by `src/lib/format.ts` (`R1 234.56` style with deterministic separators).
- Checkout distinguishes subtotal from delivery and tax: both are shown as "not configured in this demo", and the total equals the subtotal. The invented R150 shipping charge is gone.
- `src/lib/validation.ts` provides field-level validation (email, names, address, city, SA province, 4-digit postal code, SA phone) with inline messages, `aria-invalid`/`aria-describedby`, an error summary, focus moved to the first invalid field, and a duplicate-submit guard.
- Empty carts cannot check out. Success is shown only after the demo submit, with a generated `DASH-DEMO-XXXXXX` reference validated on the success page. No card data is requested, stored or transmitted; no payment, stock reservation, email or fulfilment is claimed.

### Accessibility, responsiveness and polish
- Landmarks: one `main`, one `banner`, one `contentinfo`, labelled navigation; footer column headings changed from `h3` to `h2` to remove the heading-level skip.
- Accessible mobile menu (`aria-expanded`, `aria-controls`, Escape to close, closes on navigation) and a mobile-visible search field.
- Every image has meaningful alt text; the logo and product images use `next/image` (`fill` inside a sized wrapper for the logo), removing the dimension warning and the remote-image lint suppressions.
- Empty, loading, error and not-found states added (`not-found.tsx`, `error.tsx`); live regions announce cart and validation changes.
- Mobile 390 px check: `scrollWidth === clientWidth` (390), no horizontal overflow.
- Removed dead `/account` and `/wishlist` links; replaced implied-live assistant copy with explicit "planned" wording.

### Tests
- Added Vitest 5 + React Testing Library + jsdom: 12 files / **100 tests** covering ZAR formatting, catalogue normalisation/search/filter/sort/URL building, cart reducer/clamping/persistence parsing, checkout validation and reference generation, and component behaviour (search bar, filters, results, header, purchase panel, cart page, checkout page, cart provider).
- Added Playwright E2E: 6 tests covering search → product → cart → demo checkout, URL-driven filters/sorting, empty search + 404, empty-cart checkout guard, mobile navigation/search, and mobile layout without overflow.
- Test data is the deterministic in-repo catalogue; no network or production data is used.

### CI
- Added `.github/workflows/ci.yml`: Node 24, `npm ci`, lint, type-check, unit/component tests and production build in a `quality` job; a dependent `e2e` job installs Playwright Chromium and runs the E2E suite, uploading the report on failure.
- Limits: E2E runs Chromium only (local runs use installed Google Chrome); no deployment, preview or security-scanning jobs exist yet.

### Verified
- `npm test` → 12 files / 100 tests passed.
- `npx eslint .` → clean (exit 0).
- `npx tsc --noEmit` → exit 0.
- `npm run build` → success; 29 static/SSG pages generated.
- Production server route checks (`next start --port 3100`): `/`, `/search`, `/search?q=sony`, `/search?q=zzzz`, `/products`, `/products?category=laptops-computers&sort=price-desc`, `/products/samsung-galaxy-s25-ultra`, `/categories/laptops-computers`, `/cart`, `/checkout`, `/checkout/success`, `/checkout/success?ref=DASH-DEMO-ABC123`, `/about`, `/contact`, `/shipping`, `/returns`, `/warranty`, `/privacy`, `/terms`, `/icon.jpg`, `/logo.jpg` → 200; `/products/does-not-exist` → 404.
- Playwright: 6/6 passed, repeated across consecutive full-suite runs.
- Browser console scan on 7 routes: no errors or warnings (the 404 page logs the expected failed document request); no duplicate element ids; no heading-level skips; all images have alt text; all inputs are labelled.
- Known limitation: `npx vitest` cannot run directly from the `#` path; use `npm test` (see ADR-010). CI is unaffected.

## Repository history purge — published (2026-10-25)

### Published
- `dash-app/node_modules.bak` removed from every commit and `main` republished with one explicit-lease force-push, authorised by the owner in ADR-004:
  `git push --force-with-lease=main:2716c047894249eab0e1973dff00277e5cc43e20 github refs/heads/main:refs/heads/main`.
- Previous published SHA `2716c047894249eab0e1973dff00277e5cc43e20` → new published SHA **`ac09c1f004c2b31aa913d5c0f58b90b8c9a3f4bd`**.
- Rewrite performed in an isolated mirror with the built-in `git filter-branch` (`git-filter-repo` is still not installed); only `dash-app/node_modules.bak` was removed. No other branch, tag or ref was touched.
- Published chain (7 commits): `97ddf4b` → `21bd0b8` → `96002bc` → `b492ce6` → `7b93e25` → `8b4b619` → `ac09c1f`. Commit messages, authors, emails and dates are preserved.

### Measured result

| Metric | Before (`2716c04`) | After (`ac09c1f`) |
|---|---:|---:|
| `.git` | 66 MB | 604 KB (candidate mirror); 612 KB freshly fetched from GitHub |
| Pack | 65.11 MiB | 487.43 KiB (candidate); 498.01 KiB (fetched) |
| Objects | 15,743 | 181 |
| Blobs / trees / commits | 13,852 / 1,886 / 5 | 121 / 53 / 7 |
| Tracked files | 91 | 91 |
| `HEAD^{tree}` | `141a451…` | `c2b3040…` |

Pack reduction: **≈99.3%**. The working repository's local `.git` is still ~67 MB because the pre-rewrite pack and reflog remain locally; those objects are unreachable from `main` and can be pruned later. The recovery bundle is the authoritative backup.

### Verified after publication
- `git ls-remote origin` and `gh api repos/EdwardKwinane/Dash-/commits/main` both return **`ac09c1f004c2b31aa913d5c0f58b90b8c9a3f4bd`**.
- A fresh fetch **from GitHub** into an empty bare repository: 7 commits, 181 objects, `dash-app/node_modules.bak` objects **0**, 86.27 MiB blob `11d4a09…` **absent**, `git fsck --full` clean, `HEAD^{tree}` = `c2b3040…`, 91 files.
- Fresh clone of the publish candidate: `npm ci` 0, `npm run lint` 0, `npx tsc --noEmit` 0, `npm run build` 0; routes `/` 200, `/products` 200, `/categories/smartphones` 200, `/categories/does-not-exist` 404, `/about` 200, `/cart` 200, `/checkout` 200.
- Working repository reset to `origin/main` (clean tree, upstream tracking intact); `npm run lint` 0, `npx tsc --noEmit` 0, `npm run build` 0.

### Recovery
- Original history and SHAs: `.migration-backup/history-audit-20261025-090411/Dash-pre-rewrite.bundle` (65 MB, verified complete). Restore with `git clone <bundle> restore/` and force-push the original `main` if the rewrite ever has to be undone.
- Prepared artifacts retained: `publish-candidate.git`, `publish-candidate-approved.git`, `Dash-verify*`, `remote-verify.git` under the same directory.

## Repository history audit and cleanup rehearsal — `node_modules.bak` (2026-10-25)

### Measured (read-only audit of published history)
- `.git` 66 MB; pack 65.11 MiB; 15,743 objects reachable from `main` (13,852 blobs, 1,886 trees, 5 commits).
- `dash-app/node_modules.bak`: **13,735 blobs, 220.17 MB uncompressed, 63.78 MiB compressed — 97.96% of the pack**.
- Largest object: `@next/swc-darwin-arm64/next-swc.darwin-arm64.node`, **86.27 MiB** (90,462,712 bytes), compressed 29.88 MiB — roughly 46% of the pack on its own.
- Added in `1cb153e`, deleted in `4738005`. Absent from the current tree but reachable from `refs/heads/main` and `refs/remotes/origin/main` (blob `11d4a09…`).
- Everything else in history is 117 blobs / 1.07 MB plus 0.78 MB of trees. No `.next`, `out`, `dist`, `build` or `.migration-backup` paths exist in history.
- No genuine secrets in history. Secret-named paths are library files (`caniuse-lite/.../credential-management.js`, `prop-types/lib/ReactPropTypesSecret.js`); the RSA-looking strings are `dotenv` README placeholders.

### Rehearsed (isolated, not published)
- Full-history bundle (`Dash-pre-rewrite.bundle`, 65 MB) and a mirror clone were created under the git-ignored `.migration-backup/history-audit-20261025-090411/`. Published SHA `2716c04…` remains recoverable from the bundle.
- `dash-app/node_modules.bak` was removed from every commit **in the mirror only**, using the built-in `git filter-branch` (`git-filter-repo` is not installed and was not installed). No other path was touched.
- Rehearsal result (`main` = `7b93e25…`): 5 commits, 171 objects (117 blobs, 49 trees), pack **482.12 KiB**, repository **592 KiB** — a **99.3%** reduction from 65.11 MiB.
- Current tree unchanged: `HEAD^{tree}` = `141a451a9c1803481d4a92b67ea163a2b0122f25`, identical to published `main`; 91 tracked files; commit messages, authors and dates preserved. Only the import commit's tree differs (`962c3d9…` → `d7c4bcb…`) because it no longer contains the backup.
- All 5 commit SHAs change and the result is not a descendant of published `main`, so publication requires a force-push. See ADR-004.

### Verified on a fresh clone of the cleaned mirror
- `dash-app/node_modules.bak` reachable objects: **0**; 86.27 MiB blob `11d4a09…`: **absent**; `git fsck --full`: clean.
- `npm ci` exit 0; `npm run lint` exit 0; `npx tsc --noEmit` exit 0; `npm run build` exit 0 (all routes generated).
- Route checks on port 3100: `/` 200, `/products` 200, `/categories/smartphones` 200, `/categories/does-not-exist` 404, `/about` 200, `/cart` 200, `/checkout` 200.

### Not done at rehearsal time (superseded)
- No rewrite of the working repository, no force-push, no remote branch deletion, no repository recreation. At that point `origin/main` remained `2716c04…`; publication was subsequently approved and completed — see "Repository history purge — published" above.
- The rehearsal figures above were measured from the published tip `2716c04…`; the publication run was repeated from the approved tip and produced the SHA mapping recorded above.

## Repository publication — GitHub (2026-10-25)

### Published
- Added remote `origin` → `https://github.com/EdwardKwinane/Dash-.git` (public). The target repository existed but was **empty** (no branches), so no remote history had to be integrated.
- Pushed local `main` (trunk-based, per `GIT_WORKFLOW.md`) with upstream tracking: `git push -u origin main`.
- Published commit: `f77af9b9c7a71bd45dc520fed3fcb0939a65be75` — `Document root lint command in Engineering OS`. Remote `refs/heads/main` confirmed at this SHA.
- Pre-push verification: `npm run lint` exit 0; `npm run build` exit 0 (all routes generated); working tree clean.
- Content audit: 91 tracked files, no `.env` files, no secrets, no `node_modules/` or `.next/` in the current tree. The RSA-key strings found in history are `dotenv` README placeholders (`Kh9NV...`) inside the previously committed `node_modules.bak`, not credentials.

### Known issue (not remediated)
- GitHub reported `GH001` for `dash-app/node_modules.bak/@next/swc-darwin-arm64/next-swc.darwin-arm64.node` (86.27 MB). The `node_modules.bak` backup was committed in `1cb153e` and deleted in `4738005`; it remains in history (15,572 objects, ~66 MB `.git`). Removing it requires a history rewrite and force-push, which was **not** performed because it would overwrite published history. See ADR-003 in `DECISIONS.md`.

## Dash# storefront — duplicate dev server, styling and render fixes (2026-10-25)

### Fixed
- **Tailwind produced no utilities.** Tailwind v4 crashed on the `#` in `/Users/user/Developer/Dash#` (`ERR_INVALID_ARG_VALUE`, null byte in path), emitting a ~390 B stylesheet with no utilities. Switched to Tailwind v3.4.19 with PostCSS + Autoprefixer and a `tailwind.config.ts` token set. Served CSS is now ~23 KB and includes brand tokens and utilities. See ADR-001.
- **Homepage had reverted to the create-next-app starter.** `src/app/page.tsx` was rebuilt as the Dash# storefront (demo disclosure bar, hero, categories, featured products, new arrivals, assurance strip, newsletter) on a pure white canvas.
- **Build OOM during TypeScript checking.** A 580 MB `node_modules.bak` matched `**/*.ts` in `tsconfig.json`; removed it and hardened `exclude` to `["node_modules", "node_modules.bak", ".next"]`.
- **Prerender crash on `/checkout`.** `router.push()` was called during render (`ReferenceError: location is not defined`); moved to `useEffect` and added an explicit empty state.
- **Hydration/purity error on `/checkout/success`.** `Math.random()` ran during render; the order reference is now generated in the checkout submit handler and passed as a `?ref=` query parameter, read through `useSearchParams` inside a `Suspense` boundary.
- **Dead navigation.** Added `/categories/[slug]` (7 categories, 404 for unknown) and `/about`, `/contact`, `/shipping`, `/returns`, `/warranty`, `/privacy`, `/terms` via a shared `InfoPage`.
- **Missing declared dependencies.** `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` were imported but absent from `package.json`; installed and declared.
- **Duplicate dev servers / stale artefacts.** Removed stale root `.next` and stopped competing `next` processes; root scripts now consistently run `cd dash-app && npx next …`. See ADR-002.
- **Footer pushed below the fold.** `main` had `min-h-screen` on top of page-level `min-h-screen` wrappers, creating a large blank gap. The layout is now a flex column (`body` `min-h-screen`, `main` `flex-1`) and redundant page-level `min-h-screen` classes were removed, so the footer follows content on every route.

### Changed
- Root `package.json` added with `dev`/`build`/`start`/`lint` scripts (minimal; app keeps its own manifest and lockfile). The lint script runs `eslint` directly because Next.js 16 removed `next lint`.
- `globals.css` rewritten to Tailwind directives plus brand tokens, focus ring and reduced-motion handling.
- `/products` now uses the shared `ProductCard` component.
- Footer apostrophe escaped; unused catch binding removed; `<img>` lint suppressions documented.

### Verified
- `npx tsc --noEmit` → exit 0.
- `npx eslint .` → exit 0 (no errors or warnings).
- `npm run build` → exit 0, static/dynamic routes generated.
- All storefront, category and info routes return expected HTTP status; unknown category returns 404.
- Homepage visually inspected via headless Chrome.

### Not implemented (disclosed)
- Real payments, fulfilment, accounts, admin, working search, AI assistant, automated tests, deployment.


## v4.2 — agent-native modularization (2026-10-24)

Baseline: Stack Production Engineering OS v4.1.

### Changed
- **AGENTS.md slimmed and restructured (v4.2).** Reduced from ~355 lines to a focused constitution. Detailed operating modes and policy depth remain in the existing standards; the constitution now holds mission, tiering, source-of-truth order, context-loading, change classification, Definition of Ready/Done, non-negotiables, stop conditions, and skills pointer. This matches 2026 agent-instruction best practice (short index + progressive skills) and reduces token cost and instruction conflict risk.

### Added
- **`skills/` directory** with progressive, on-demand procedures:
  - `database-migration.md`
  - `ai-eval-gate.md`
  - `feature-flag-lifecycle.md`
  - `incident-triage.md`
  - `new-provider-integration.md`
  - `adr.md`
  - `skills/README.md` index
- **`profiles/VERCEL_AI.md`** — first-class profile for Vercel AI Cloud (AI Gateway, Sandbox, Workflow/durable agents, Fluid compute, MCP, cost and observability expectations). Prefer these primitives when the project targets Vercel; remains non-prescriptive for other stacks.
- Source-of-truth order and context-loading protocol updated to include `skills/`.
- `PROJECT_CONTEXT.md` and `README.md` updated for skills and the Vercel AI profile.

### Unchanged
All core standards (Security, Privacy, Architecture, AI_ENGINEERING, Deployment, Observability, etc.) retain their existing requirements. No lifecycle, security, accessibility, or privacy obligations were weakened.

### Rationale
Align the OS with current agentic development practice (Claude Code, Codex, Cursor, OpenCode, Vercel AI Cloud) while preserving the rigor that already made v4.1 production-capable.
=== CHANGING LOG (append) ===

## 2026-10-25 — Sprint 02 — South Africa region + Dash# catalogue seed
- DB verified pre-change: region=Europe/eur only; categories=4 (scaffold); products=4 (scaffold).
- Added South Africa region (`zar`, country `za`, name South Africa) via seed script; preserved Europe/EUR.
- Created 7 Dash# categories + 6 Dash# products (SKUs verified: SMS-GS25U-256, APP-MBP14-M4-512, SON-WH1000XM5-BLK, APP-IPAIR11-M3-128, LOG-MXM3S-GRY, DEL-XPS13P-512); prices in integer ZAR cents.
- Seed idempotency fixed (query `product_variant.sku` instead of non-existent `product.sku`); 2nd run clean ("All 6 Dash# products already exist; nothing to create").
- Tax automation disabled (owner confirmation pending); delivery rates set 0 (documented, not fabricated).
- Inventory values (15/8/25/20/50/12) retained only as demo fixtures; clearly labelled.
- Dell XPS 13 Plus image mismatch remains open; deferred to Sprint 04.
- `.env` (local only) not tracked; `.env.example` tracked (placeholders); `.env` in `.gitignore`.
- Existing storefront unchanged (123/123 tests pass; build clean); `dash-app/` untouched.
- Admin /health verified 200; seed script at apps/backend/src/scripts/seed-dash-catalogue.ts.
