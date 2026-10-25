# PROJECT_CONTEXT.md — Project Identity and Operating Context

Version: 1.0
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
| Backend/runtime | Next.js server runtime (static + dynamic routes) | 16.4.3 | No separate API service |
| Database | None | — | Catalogue is a typed in-repo module |
| Auth | None | — | No accounts |
| Storage | Browser `localStorage` | — | Cart persistence only |
| Hosting | Not yet decided | — | Local dev only at present |
| Payments | None | — | Demo checkout, no card data |
| Analytics | None | — | No scripts loaded |
| Observability | None beyond Next.js dev/prod logs | — | Deferred |
| AI/model gateway | None | — | Assistant described as future work, not implemented |
| Queue/jobs | None | — | — |
| Search/vector store | None | — | Header search is not wired |

Do not replace an approved stack component without an accepted ADR.

## 4. Environments and delivery
- Source repository (canonical): `https://github.com/EdwardKwinane/Dash-.git` (remote `origin`, branch `main`, public)
- Local development: `npm run dev` from `/Users/user/Developer/Dash#` → `http://localhost:3000`
- Preview: none configured
- Staging: none configured
- Production: none configured
- Primary domains: none configured
- Deployment platform: undecided
- CI/CD entry point: none; manual `npm run build` verification

Never place credentials or secret values in this file.

## 5. External integrations
| Provider/System | Purpose | Source of truth? | Criticality | Owner |
|---|---|---|---|---|
| Remote image host (product images in `src/lib/data/products.ts`) | Demo product imagery | No | Low | Project owner |

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
- Working header search / faceted filtering.

## 9. Current priorities
1. Keep the storefront rendering correctly and the root dev workflow reliable.
2. Connect real catalogue data before making any availability or delivery claims.
3. Add commerce providers (payment, fulfilment) behind explicit ADRs.

## 10. Repository map
- Application source: `dash-app/src/`
  - Routes: `dash-app/src/app/` (`products`, `products/[slug]`, `categories/[slug]`, `cart`, `checkout`, `checkout/success`, info pages)
  - Components: `dash-app/src/components/` (`layout`, `product`, `home`, `ui`)
  - State: `dash-app/src/contexts/cart-context.tsx`
  - Data: `dash-app/src/lib/data/products.ts`
  - Types: `dash-app/src/types/product.ts`
- Tests: none yet
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
cd "/Users/user/Developer/Dash#/dash-app" && npx tsc --noEmit

# test
# (no test suite configured)

# build
cd "/Users/user/Developer/Dash#" && npm run build

# database/migrations
# (none)
```

## 12. Current risks and open decisions
- **Recurring pitfall:** starting `next dev` from a different working directory (or via `npm --prefix`) creates competing dev-server registrations and stale `.next` directories. Always use the root script. See `HOW_IT_WORKS.md`.
- **Repository history contains `node_modules.bak`.** Commit `1cb153e` imported the dependency backup into history (15,572 objects; largest blob 86.27 MB). It is removed from the current tree and ignored, but the blobs remain in history and were published with the initial push. GitHub warned about the large file. Purging it requires a history rewrite (`git filter-repo`) plus a coordinated force-push, or recreating the repository; this was deliberately **not** done unilaterally. See ADR-003.
- Catalogue is seeded demo data; no availability, delivery or warranty claim is real.
- No automated tests; verification is currently lint + type-check + production build + manual route/visual checks.
- Deployment platform, payment provider and fulfilment provider remain undecided.

## 13. Last verified
- Date: 2026-10-25
- Verified by: AI agent (OpenCode)
- What was checked: `npx tsc --noEmit` exit 0; `npx eslint .` exit 0; `npm run build` exit 0; all routes return expected status codes; homepage visually inspected via headless Chrome; served CSS contains brand tokens and Tailwind utilities.
