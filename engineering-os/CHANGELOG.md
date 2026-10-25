# CHANGELOG

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
