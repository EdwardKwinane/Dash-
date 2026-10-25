# CHANGELOG

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

### Not done
- No rewrite of the working repository, no force-push, no remote branch deletion, no repository recreation. `origin/main` remains `2716c04…`. Publication requires separate explicit approval (ADR-004).
- The rehearsal figures above were measured from the published tip `2716c04…`; this changelog entry is a later commit, so the publication run must be repeated from the final `main` tip and will produce a different SHA mapping.

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
