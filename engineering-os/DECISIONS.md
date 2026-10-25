# DECISIONS.md — Architecture Decision Record Log

Version: 2.0

## 1. Purpose
Record important decisions and, most importantly, why they were made.

Create ADRs for decisions that are expensive to reverse, cross-cutting, security-sensitive, data-model-related, provider-related, or infrastructure-related.

## 2. Status values
PROPOSED / ACCEPTED / SUPERSEDED / DEPRECATED / REJECTED

## 3. ADR index
| ID | Decision | Status | Date | Supersedes |
|---|---|---|---|---|
| ADR-001 | Use Tailwind CSS v3 instead of v4 for this repository | ACCEPTED | 2026-10-25 | — |
| ADR-002 | Start the single dev server from the repo root script | ACCEPTED | 2026-10-25 | — |
| ADR-003 | Publish to GitHub as `origin/main` without rewriting existing history | ACCEPTED | 2026-10-25 | — |
| ADR-004 | Purge `dash-app/node_modules.bak` from history and republish `main` | ACCEPTED | 2026-10-25 | — |
| ADR-005 | Adopt Vitest + React Testing Library + Playwright as the test stack | ACCEPTED | 2026-10-25 | — |
| ADR-006 | Use URL query parameters as the source of truth for catalogue queries | ACCEPTED | 2026-10-25 | — |
| ADR-007 | Persist the cart from the dispatch and derive hydration from `useSyncExternalStore` | ACCEPTED | 2026-10-25 | — |
| ADR-008 | Do not use a root `loading.tsx` with this Next.js version | ACCEPTED | 2026-10-25 | — |
| ADR-009 | Allow `127.0.0.1` as a development origin | ACCEPTED | 2026-10-25 | — |
| ADR-010 | Run local Vitest through a shadow-copy launcher for the `#` path | ACCEPTED | 2026-10-25 | — |
| ADR-011 | Gate changes on a GitHub Actions quality + E2E pipeline | ACCEPTED | 2026-10-25 | — |
| ADR-012 | Replace the two-tier header with a disclosure mega-menu navbar | ACCEPTED | 2026-10-25 | — |
| ADR-013 | Host verified product imagery locally in `public/products` with recorded provenance | ACCEPTED | 2026-10-25 | — |

## 4. ADR template
### ADR-XXX: Decision title
Date:  
Status:  
Decision owner:

#### Context
What problem or constraint requires a decision?

#### Decision drivers
List the criteria that matter: security, scale, latency, cost, developer experience, lock-in, compliance, operations.

#### Options considered
For each option document advantages, disadvantages, risks, and estimated operational burden.

#### Decision
State the chosen option precisely.

#### Rationale
Explain why it best satisfies the decision drivers.

#### Consequences
Positive consequences:  
Negative consequences:  
New obligations introduced:

#### Security/privacy impact
Describe trust-boundary or data-handling changes.

#### Cost impact
Describe expected infrastructure/provider cost implications.

#### Migration and rollback
How can we migrate to/from this decision later?

#### Validation
What evidence will confirm the decision remains correct?

#### References
PRDs, benchmarks, provider docs, pull requests, incidents, diagrams.

### ADR-001: Use Tailwind CSS v3 instead of v4 for this repository
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
The project lives in a directory whose name ends in `#` (`/Users/user/Developer/Dash#`). The folder cannot be renamed or moved (project constraint). Tailwind CSS v4 (via `@tailwindcss/postcss` and `@tailwindcss/turbopack`) parses stylesheet references as URL-like paths and fails on `#`:

```
TypeError [ERR_INVALID_ARG_VALUE]: The argument 'path' must be a string, Uint8Array, or URL without null bytes.
Received '/Users/user/Developer/Dash\x00#/dash-app/node_modules/tailwindcss/index.css'
```

Because the stylesheet never loaded, no utilities were emitted: the production CSS bundle was ~390 bytes and the storefront rendered unstyled.

#### Decision drivers
- Correct rendering (highest priority).
- Keep the required folder path and existing app structure.
- Minimal dependency churn; no new build tooling.
- Preserve the token-based design system.

#### Options considered
1. **Rename the folder** — rejected: explicitly forbidden by the project owner.
2. **Tailwind v4 with a path workaround** (symlink, custom loader) — rejected: fragile, undocumented, and would recur on every clean install.
3. **Tailwind v3 with PostCSS + Autoprefixer** — accepted: v3 resolves content globs through PostCSS without URL path parsing, so `#` is harmless.

#### Decision
Pin `tailwindcss@^3.4.19`, `postcss@^8`, `autoprefixer@^10`; use `postcss.config.mjs` with `tailwindcss` and `autoprefixer`; define tokens in `dash-app/tailwind.config.ts`; use `@tailwind base/components/utilities` in `globals.css`.

#### Rationale
It fixes the actual failure at its source, keeps the mandated directory name, and requires no bespoke build hacks.

#### Consequences
Positive: CSS compiles (23 KB of utilities in dev), brand tokens resolve, build is stable.
Negative: the project does not use Tailwind v4 features until the path constraint changes.
New obligations: any future Tailwind upgrade must first prove v4 handles a `#` in the project path, otherwise update this ADR.

#### Security/privacy impact
None.

#### Cost impact
None.

#### Migration and rollback
If the project is later moved to a path without `#`, re-evaluate Tailwind v4 and supersede this ADR. Rollback to v4 is a dependency + PostCSS config change, not a code rewrite.

#### Validation
`npm run build` compiles CSS successfully; served CSS contains `.grid`, `.rounded-card`, `.bg-brand`, `.text-ink`, `a855f7` and `1440px`.

#### References
Incident record in `CHANGELOG.md` (2026-10-25); `PROJECT_CONTEXT.md` §8.

---

### ADR-002: Start the single dev server from the repo root script
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
The app lives in `dash-app/` while the mandated entry point is the repo root. Running `next dev` from different working directories (root, `dash-app/`, `npm --prefix dash-app`) produced competing dev-server registrations, a stale root `.next`, and confusing "another dev server is already running" behaviour.

#### Decision drivers
- One predictable dev command.
- No duplicate processes or stale build artefacts.
- Keep the app's own `package.json` and lockfile intact.

#### Options considered
1. **`npm --prefix dash-app run dev`** — rejected: resolves paths relative to the invoking root and contributed to cross-root `.next` artefacts.
2. **`cd dash-app && npx next dev` in the root script** — accepted: guarantees the Next.js working directory is the app directory.
3. **Instruct developers to `cd dash-app` manually** — rejected: violates the required root workflow.

#### Decision
Root `package.json` scripts run `cd dash-app && npx next …` for `dev`, `build`, `start` and `lint`. Only one dev server runs at a time. Stale root `.next` directories are removed rather than reused.

#### Consequences
Positive: `npm run dev` from the root reliably serves `http://localhost:3000`.
Negative: scripts depend on POSIX `cd` (acceptable for the documented macOS/Linux workflow).
New obligations: if a server fails to start, check for an existing process on port 3000 before starting another.

#### Security/privacy impact
None.

#### Cost impact
None.

#### Validation
Only one listener on port 3000 after `npm run dev`; homepage returns HTTP 200; no duplicate `next-server` processes.

#### References
`HOW_IT_WORKS.md`; `CHANGELOG.md` (2026-10-25).

---

### ADR-003: Publish to GitHub as `origin/main` without rewriting existing history
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
The verified project needed a canonical public remote. `https://github.com/EdwardKwinane/Dash-.git` existed but was empty. Local history contained an earlier import commit (`1cb153e`) that had committed `dash-app/node_modules.bak` before it was removed in `4738005`; the blobs (15,572 objects, largest 86.27 MB) remain reachable in history. GitHub warns on the large file during push.

#### Decision drivers
- Publish the verified project without losing or rewriting history.
- Keep one canonical remote and branch.
- Avoid destructive operations on a shared/public repository.
- Preserve the mandated local root `Dash#`.

#### Options considered
1. **Rewrite history with `git filter-repo` and force-push** — rejected for now: destructive, overwrites published commits, and requires explicit owner coordination.
2. **Recreate the empty GitHub repository and push cleaned history** — viable later, but also destructive to the existing remote and out of scope for this task.
3. **Publish as-is with `origin/main` and document the historical bloat** — accepted: non-destructive and preserves all history.

#### Decision
Configure `origin` → `https://github.com/EdwardKwinane/Dash-.git`; use `main` with upstream tracking (trunk-based, per `GIT_WORKFLOW.md`). Push normally (no force). Do **not** rewrite history in this task. Treat the `node_modules.bak` blobs as a known repository-hygiene debt.

#### Rationale
It publishes the verified state immediately while respecting the prohibition on force-pushing or discarding history.

#### Consequences
Positive: canonical remote and branch established; full history preserved; push verified.
Negative: repository history and clone size are inflated by the old `node_modules.bak` blobs.
New obligations: plan a history purge (or repository recreation) with owner approval; add a pre-push large-file check to the release routine.

#### Security/privacy impact
No secrets were published. The only sensitive-looking strings in history are `dotenv` README placeholders.

#### Cost impact
Larger clone/storage footprint on GitHub; no direct monetary cost at current size.

#### Migration and rollback
Remediation requires `git filter-repo --path dash-app/node_modules.bak --invert-paths` followed by a coordinated force-push, or deleting and recreating the remote. Both need owner approval and a fresh clone for collaborators.

#### Validation
`git ls-remote --heads origin` returns `refs/heads/main` at the local HEAD SHA; `gh api repos/EdwardKwinane/Dash-/commits/main` matches.

#### References
`CHANGELOG.md` (2026-10-25 repository publication); `PROJECT_CONTEXT.md` §4 and §12.

---

### ADR-004: Purge `dash-app/node_modules.bak` from history and republish `main`
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner
Owner approval: 2026-10-25 — explicit written approval to publish the rehearsed rewrite, as a one-time scoped exception to `GIT_WORKFLOW.md` §5 (no force-push to `main`).

#### Context
Published `main` (`2716c04…`) is only 91 files / 1.08 MB, but its history still carries `dash-app/node_modules.bak`, which was committed in `1cb153e` and deleted in `4738005`. Measured on the published history:

| Metric | Value |
|---|---|
| `.git` | 66 MB |
| Pack | 65.11 MiB |
| Objects reachable from `main` | 15,743 (13,852 blobs, 1,886 trees, 5 commits) |
| `node_modules.bak` blobs | 13,735, 220.17 MB uncompressed, **63.78 MiB compressed (97.96% of the pack)** |
| Largest blob | `next-swc.darwin-arm64.node`, 86.27 MiB (90,462,712 B), 29.88 MiB compressed |
| Non-`node_modules.bak` blobs | 117 blobs, 1.07 MB |

GitHub flagged the 86.27 MB file (`GH001`) on the initial push. ADR-003 deliberately published without rewriting history and recorded this as known hygiene debt with an obligation to plan a purge. This ADR records the decision to perform that purge. No genuine secrets are involved; the only sensitive-looking strings are `dotenv` README placeholders.

#### Decision drivers
- Remove the dominant historical bloat without altering current content.
- Keep the existing repository identity and URL (`https://github.com/EdwardKwinane/Dash-.git`).
- Preserve all commit messages, authors, dates and the exact current tree.
- Avoid an irreversible or unvalidated destructive operation.
- Keep recovery of the published SHA possible after the rewrite.

#### Options considered
1. **Leave history unchanged** — zero risk, zero effort, but `.git` stays ~66 MB, every clone downloads 220 MB of dependency blobs, and GitHub keeps flagging the file. Rejected as the permanent state; still the default until publication is approved.
2. **Rewrite with `git filter-repo` and force-push** — removes the path from every commit; all 5 SHAs change; `main` and `origin/main` must be force-updated; existing clones must be re-cloned or hard-reset. `git-filter-repo` is **not installed**, and the install-free built-in `git filter-branch` achieves the same result for this 5-commit history.
3. **Recreate the repository / publish a clean new history** — guarantees a fresh object store, but destroys repository identity and settings. With 0 forks, 0 PRs, 0 issues, 0 stars, 0 tags and 0 releases the loss is small, yet it is more destructive than option 2 for no functional gain. Rejected unless immediate purging from GitHub's object store is mandatory.

#### Decision
Rewrite history in an **isolated mirror** to remove only `dash-app/node_modules.bak` from every commit, validate the result, and publish it with a single explicit-lease force-push of `refs/heads/main` **only after separate explicit owner approval**. Use the built-in `git filter-branch` fallback because `git-filter-repo` is not installed and installing tools was not approved. Owner approval was granted on 2026-10-25 for exactly one publication of `refs/heads/main`; no other branch, tag or ref may be force-pushed.

#### Rationale
It removes 97.96% of the pack while preserving the repository, all history metadata and the exact current tree. Rehearsing in a mirror and validating before publishing keeps the destructive step reversible and evidence-based.

#### Consequences
Positive: repository size drops from ~66 MB to ~0.6 MB; clones become fast; the GitHub large-file warning is resolved; no unrelated path or commit is removed.
Negative: every commit SHA changes; published history is replaced; existing clones and any SHA-pinned links break; GitHub may keep the old objects reachable by SHA until it garbage-collects them.
New obligations: announce the rewrite, provide the recovery bundle, verify the remote after the force-push, and re-run lint/type-check/build/route checks against the cleaned history.

#### Security/privacy impact
None. No secrets are removed or exposed. The removed content is third-party dependency code and binaries.

#### Cost impact
Reduces clone, storage and bandwidth footprint on GitHub and for every collaborator. No monetary cost at current size.

#### Migration and rollback
- **Migration:** rebuild the mirror from the final `main` tip, rewrite, verify, then perform one explicit-lease force-push of `refs/heads/main`, and `git fetch && git reset --hard origin/main` in the working repository.
- **Rollback:** the pre-rewrite full-history bundle (`.migration-backup/history-audit-20261025-090411/Dash-pre-rewrite.bundle`, 65 MB) restores the original history and SHAs; re-push the original `main` if the rewrite must be undone.
- The working repository's `main` is not rewritten during preparation, so rollback is simply "do not publish".

#### Validation
Rehearsed on 2026-10-25 in an isolated mirror cloned from `2716c04…`:
- `dash-app/node_modules.bak` objects reachable from the rewritten refs: **0**; blob `11d4a09…`: **absent**; `git fsck --full`: clean.
- Rewritten `HEAD^{tree}` = `141a451a9c1803481d4a92b67ea163a2b0122f25`, identical to the published tree; 91 tracked files; messages, authors and dates preserved.
- Size: 171 objects (117 blobs, 49 trees, 5 commits); pack **482.12 KiB**; repository **592 KiB** (from 65.11 MiB, −99.3%).
- On a fresh clone: `npm ci` 0, `npm run lint` 0, `npx tsc --noEmit` 0, `npm run build` 0; routes `/` 200, `/products` 200, `/categories/smartphones` 200, `/categories/does-not-exist` 404, `/about` 200, `/cart` 200, `/checkout` 200.

#### Outcome (published 2026-10-25)
Approval was recorded in this ADR and the approved candidate was rebuilt from the approval commit, then published with the single authorised push:

```bash
git push --force-with-lease=main:2716c047894249eab0e1973dff00277e5cc43e20 \
  github refs/heads/main:refs/heads/main
```

- Previous published SHA `2716c047894249eab0e1973dff00277e5cc43e20` → **`ac09c1f004c2b31aa913d5c0f58b90b8c9a3f4bd`** (7 commits).
- `git ls-remote origin` and the GitHub API both report `ac09c1f…`.
- Fresh fetch from GitHub: 181 objects, 0 `dash-app/node_modules.bak` objects, blob `11d4a09…` absent, `git fsck --full` clean, `HEAD^{tree}` = `c2b3040d9c9d9debe4e5f6c92f64218bfa57b349`, 91 files.
- Size: `.git` 66 MB → 604 KB (candidate mirror); pack 65.11 MiB → 487.43 KiB (498.01 KiB as fetched over the network) — ≈99.3% smaller.
- Working repository reset to `origin/main`; `npm run lint`, `npx tsc --noEmit` and `npm run build` all exit 0.
- Old objects may remain reachable on GitHub by direct SHA until GitHub garbage-collects them. No support request or repository recreation was performed.
- Recovery: `.migration-backup/history-audit-20261025-090411/Dash-pre-rewrite.bundle` (65 MB, complete history at `2716c04…`).

#### References
`CHANGELOG.md` (2026-10-25 history audit and cleanup rehearsal); ADR-003; `PROJECT_CONTEXT.md` §12; `GIT_WORKFLOW.md` §7.

---

### ADR-005: Adopt Vitest + React Testing Library + Playwright as the test stack
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
The storefront had no automated tests. Search, filtering, cart arithmetic and checkout validation are now non-trivial domain logic, and the project needs a repeatable gate that runs locally and in CI without adding a second framework or a browser download for unit tests.

#### Decision drivers
- Fast feedback for pure logic and React components.
- Compatibility with Next.js 16 / React 19 and TypeScript path aliases (`@/…`).
- One E2E tool that can drive the real critical journey.
- Minimal configuration and no vendor lock-in.

#### Options considered
1. **Jest + RTL + Playwright** — mature, but Jest needs extra ESM/Next transforms and duplicates configuration already handled by Vite.
2. **Vitest + RTL (jsdom) + Playwright** — accepted: Vitest reuses the Vite transform pipeline, understands `tsconfig` paths via `vite-tsconfig-paths`, and keeps unit tests browser-free; Playwright covers the real journey.
3. **Playwright only** — rejected: too slow and too coarse for reducer/validation edge cases.

#### Decision
Use Vitest 5 (`environment: "jsdom"`, `@vitejs/plugin-react`, `resolve.tsconfigPaths`) with React Testing Library, `@testing-library/user-event` and `jest-dom` for unit/component/integration tests under `src/**/*.test.{ts,tsx}`. Use Playwright for E2E under `dash-app/e2e/`, with installed Google Chrome locally (`channel: "chrome"`) and Playwright Chromium in CI.

#### Rationale
Vitest exercises the same module graph the app uses, so path aliases and TS work without extra transforms; Playwright verifies the behaviour that only a browser can prove (streaming, hydration, navigation, localStorage).

#### Consequences
Positive: 100 deterministic unit/component tests in ~5 s; E2E covers the revenue-critical journey.
Negative: two test runners and two config files to maintain; jsdom is not a real browser, so layout/streaming behaviour still needs E2E or manual checks.
New obligations: new business rules need a unit test; new routes in the critical journey need an E2E test.

#### Security/privacy impact
None. Tests use seeded catalogue data and never contact a network service.

#### Cost impact
None locally; GitHub Actions minutes for the E2E job.

#### Migration and rollback
Removing Playwright leaves Vitest intact; replacing Vitest with Jest is a config change plus import updates. No production code depends on either runner.

#### Validation
`npm test` → 12 files / 100 tests passed; `npx playwright test` → 6 passed; both are wired into CI.

#### References
`TESTING_STRATEGY.md`; `CHANGELOG.md` (2026-10-25 quality sprint); ADR-011.

---

### ADR-006: Use URL query parameters as the source of truth for catalogue queries
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
Search, filters and sorting must survive reloads, be shareable, work with the back button and remain usable without client JavaScript. The catalogue is a small, build-time module, so filtering on the server is cheap.

#### Decision drivers
- Shareable, bookmarkable results.
- No duplicated client/server filter logic.
- No full page reloads when changing a control.
- Predictable behaviour for hand-edited or stale URLs.

#### Options considered
1. **Client-only state (`useState`) and filtering in the browser** — rejected: state is lost on reload/share, and the initial HTML would not reflect the query.
2. **Server components reading `searchParams`, controls navigating with `router.push`** — accepted: one implementation, correct first paint, no reload.
3. **Hybrid (URL + client cache)** — rejected as unnecessary complexity for six products.

#### Decision
`src/lib/catalog.ts` parses and validates raw `searchParams` into a `CatalogQuery`; `/search` and `/products` are server components that evaluate it over the in-repo catalogue. Controls are links/forms that navigate to a new URL (`router.push` for the text input, checkbox/select changes build a query string). Unknown `sort`, `price`, `category` or `brand` values are ignored rather than throwing.

#### Rationale
The URL is already the browser's state container, so there is one representation to test and no hydration-dependent filtering.

#### Consequences
Positive: results are correct on first paint, shareable and testable; empty states and counts are derived from the same query.
Negative: each filter change is a server round-trip (acceptable at this catalogue size); very large catalogues would need pagination and possibly a search index.
New obligations: any new filter must be added to `parseCatalogQuery`, the URL builder and the tests together.

#### Security/privacy impact
Search terms appear in the URL and therefore in server/browser history. No personal data should be put in catalogue query parameters.

#### Cost impact
None at current scale.

#### Migration and rollback
Filters can later move behind an API or search provider without changing the URL contract.

#### Validation
Unit tests cover parsing, normalisation, filtering, sorting and URL building; E2E asserts `?category=laptops-computers` changes the result count.

#### References
`src/lib/catalog.ts`; `CHANGELOG.md` (2026-10-25 search and discovery).

---

### ADR-007: Persist the cart from the dispatch and derive hydration from `useSyncExternalStore`
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
The cart is restored from `localStorage` after mount. A persistence effect that runs on the first render sees the empty server-rendered cart and can overwrite the returning shopper's saved cart (and runs twice under StrictMode). A `setState`-in-effect hydration flag also triggers cascading renders and is rejected by the project's React lint rules.

#### Decision drivers
- Never lose a saved cart.
- No hydration mismatch between server HTML and the first client render.
- No `setState` synchronously inside an effect.
- Correct behaviour under rapid clicks.

#### Options considered
1. **`useEffect` persistence + `setState` hydration flag** — rejected: overwrite race, double write under StrictMode, lint failure.
2. **Lazy `useReducer` initialiser reading `localStorage`** — rejected: runs during render, so server and client would disagree (hydration mismatch).
3. **Restore once in an effect; persist inside the `dispatch` wrapper; hydration flag via `useSyncExternalStore`** — accepted.

#### Decision
`CartProvider` restores once (`hasRestored` ref), applies mutations through a wrapper that computes the next state synchronously, dispatches it and writes the serialised cart to `localStorage` in the same call. Rejected actions are never persisted. `isHydrated` uses `useSyncExternalStore` with a server snapshot of `false` and a client snapshot of `true`.

#### Rationale
Persistence is a side effect of an accepted mutation, not of rendering, which removes the race and the extra effect entirely. `useSyncExternalStore` is the React-blessed way to express "client-only value" without an effect.

#### Consequences
Positive: saved carts survive reloads; no write on first paint; no cascading render; tests assert storage is untouched on mount.
Negative: `localStorage` writes happen in the event handler, so a thrown quota error must be swallowed (it is); the cart is per-browser, not per-account.
New obligations: any new cart mutation must go through the wrapper.

#### Security/privacy impact
Cart contents stay in the shopper's browser. `parseStoredCart` treats storage as untrusted input and drops unknown products, malformed JSON and non-positive quantities.

#### Cost impact
None.

#### Migration and rollback
Replacing browser storage with server-side carts requires an auth model and an API; the reducer and validation can be reused.

#### Validation
`src/contexts/cart-context.test.tsx` verifies restore-without-overwrite and that rejected over-orders are not persisted; E2E completes a full cart journey.

#### References
`src/lib/cart.ts`; `src/contexts/cart-context.tsx`; ADR-005.

---

### ADR-008: Do not use a root `loading.tsx` with this Next.js version
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
With Next.js 16.4.3, the root `src/app/loading.tsx` caused a streamed fallback to remain in the DOM as `<div hidden id="S:0">` in roughly 40% of production page loads. The hidden node contained a second copy of the page, duplicating text and element ids (for example the empty-state paragraph matched twice). Because it is `hidden`, it is invisible to users but breaks strict locators, id uniqueness and assistive-technology expectations.

#### Decision drivers
- One DOM node per element id.
- Predictable Playwright locators.
- No flash of duplicated content.

#### Options considered
1. **Keep `loading.tsx` and make tests tolerant** — rejected: hides a real DOM defect and leaves duplicate ids in production.
2. **Remove the root `loading.tsx`** — accepted: routes render without a streamed fallback shell; navigation remains fast at this catalogue size.
3. **Move the boundary to a narrower segment** — possible later, but would need the same duplicate-node test before adoption.

#### Decision
There is no root `loading.tsx`. Loading states are rendered inside the components that actually wait (cart/checkout use `isHydrated` and a `role="status"` message).

#### Rationale
The fallback bought little perceived speed at this size and produced invalid DOM. Removing it made 10/10 loads clean.

#### Consequences
Positive: no duplicate ids or duplicated text; E2E locators are unambiguous.
Negative: no route-level streaming skeleton; a slower future route may want a scoped `loading.tsx`.
New obligations: re-test duplicate ids and strict locators before adding any `loading.tsx` back.

#### Validation
After removal, a 10-run Playwright check found one empty-state paragraph per load (previously 2 in 4/10 runs), and full-suite E2E passed three consecutive times.

#### References
`CHANGELOG.md` (2026-10-25); `src/app/` (no `loading.tsx`).

---

### ADR-009: Allow `127.0.0.1` as a development origin
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
Next.js 16 blocks cross-origin requests to dev-only resources by default and trusts only the hostname the dev server started on. The dev server starts as `localhost`, but Playwright and `curl` use `127.0.0.1`; their requests for dev assets were blocked, so React never hydrated and interactive checks silently failed.

#### Decision drivers
- Deterministic local and E2E behaviour.
- No weakening of production behaviour.
- Minimal configuration.

#### Options considered
1. **Always use `localhost` in tooling** — rejected: fragile (some environments resolve differently) and does not fix `curl`/third-party tools.
2. **`allowedDevOrigins: ["127.0.0.1"]`** — accepted: scoped to development, explicit host.
3. **Disable the cross-origin check** — not available and unsafe.

#### Decision
`dash-app/next.config.ts` sets `allowedDevOrigins: ["127.0.0.1"]`. The production build ignores it.

#### Consequences
Positive: dev assets load from both hostnames; hydration works under Playwright and `curl`.
Negative: one more dev-only setting to remember when the hostname changes.
New obligations: add any new dev hostname (for example a tunnel) explicitly.

#### Security/privacy impact
Development only; no production origin is trusted by this setting.

#### Validation
Before: `GET /checkout` from `127.0.0.1` stayed on "Loading your cart…" and logged blocked HMR requests. After: the page hydrates, the mobile menu and search work, and E2E passes.

#### References
`dash-app/next.config.ts`; `CHANGELOG.md` (2026-10-25).

---

### ADR-010: Run local Vitest through a shadow-copy launcher for the `#` path
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
The mandated project path `/Users/user/Developer/Dash#` contains `#`. Vite treats that character as a URL fragment, so module ids are truncated and Vitest fails before running any test. The same class of problem already forced Tailwind v3 (ADR-001).

#### Decision drivers
- Keep the mandated path.
- Keep `npm test` working locally without per-developer instructions.
- Do not change test semantics between local and CI.

#### Options considered
1. **Rename the folder** — forbidden.
2. **Encode or symlink the path** — fragile and affects every tool, not just Vitest.
3. **Copy the project to a temporary directory and hard-link `node_modules`** — accepted: cheap, isolated, and only used when the path contains `#`.

#### Decision
`dash-app/scripts/run-vitest.mjs` is the `npm test` entry point. If the project path contains `#`, it copies the project (excluding build/test artefacts) to `$TMPDIR/dash-sharp-vitest`, hard-links `node_modules` with `cp -al`, and runs Vitest there. Otherwise it runs Vitest in place. CI checks out to a plain path, so it takes the direct branch.

#### Consequences
Positive: one command works everywhere; no test-only code changes.
Negative: local runs copy the tree (a few hundred ms) and the temporary directory is rebuilt each run.
New obligations: if the project moves to a path without `#`, the launcher becomes a no-op automatically.

#### Validation
`npm test` → 12 files / 100 tests passed from the `#` path; CI uses the same script and the direct branch.

#### References
`dash-app/scripts/run-vitest.mjs`; ADR-001.

---

### ADR-011: Gate changes on a GitHub Actions quality + E2E pipeline
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
Verification was manual (lint, type-check, build, route checks). The new domain logic and browser behaviour need a repeatable gate that runs on every push and pull request.

#### Decision drivers
- Catch regressions before merge.
- Match the versions used locally (Node 24, Next 16).
- Keep runtime and cost modest.
- Avoid flaky blocking checks.

#### Options considered
1. **No CI** — rejected: verification depends on whoever remembers to run it.
2. **Quality job only** — cheap, but would not catch hydration/streaming/navigation regressions.
3. **Quality job + Chromium E2E job** — accepted: unit/build gate first, then a single-browser E2E job that reuses the production build.

#### Decision
`.github/workflows/ci.yml` runs on pushes and pull requests to `main`:
- `quality`: Node 24, `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` (working directory `dash-app`).
- `e2e`: depends on `quality`; installs Playwright Chromium, runs `npx playwright test` with `CI=true` (the config builds and starts the production server, one worker, one retry), and uploads the HTML report on failure.

#### Rationale
The quality job is fast and deterministic; the E2E job proves the browser-only behaviour without multiplying browsers or shards.

#### Consequences
Positive: every change is checked the same way; failures leave a downloadable report.
Negative: E2E adds several minutes and depends on GitHub-hosted runner capacity; Chromium is the only browser covered.
New obligations: keep `package-lock.json` committed and in sync; update the workflow when the Node or Playwright version changes.

#### Security/privacy impact
`permissions: contents: read` only. No secrets are used; the workflow does not deploy.

#### Cost impact
GitHub Actions minutes on the repository's plan.

#### Migration and rollback
The workflow is a single file and can be disabled or replaced without touching application code.

#### Validation
Workflow YAML parses with two jobs; every command it runs has been executed locally with the same results (see `CHANGELOG.md`). The workflow itself has not yet run on GitHub because the branch has not been pushed.

#### References
`CHANGELOG.md` (2026-10-25); `TESTING_STRATEGY.md`; ADR-005.

---

### ADR-012: Replace the two-tier header with a disclosure mega-menu navbar
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
The storefront header was a two-tier row (logo/search/cart on top, category links below). Product discovery needs a richer Shop surface, and a navigation rebuild (`navbar2`) was requested as a focused, premium-nav work item.

#### Decision drivers
- One header rendered everywhere; no duplicated navigation.
- Real routes and real catalogue data only — no invented destinations.
- Keyboard/touch support; never hover-only menus.
- No layout shift; restrained motion; existing design tokens.
- No new dependencies unless unavoidable.

#### Options considered
1. **Adapt a hover/focus mega-menu from a UI kit** — rejected: hover-only menus fail touch users and need a11y scaffolding beyond this project's scale.
2. **Click/tap disclosure mega-menu with CSS keyframes** — accepted: predictable, testable, keyboard-operable; keyframes run in CSS so no animation library is required (existing `lucide-react` icons and Tailwind cover everything).
3. **Keep both nav patterns (old header + navbar2)** — rejected: two headers violates the integration requirement and confuses landmarks.

#### Decision
`src/components/ui/navbar2.tsx` is the single navigation component, rendered by the root layout. Menus are disclosure widgets (`aria-expanded`, `aria-controls`) toggled by click; panels animate open with a Tailwind keyframe token (`menu-reveal`, 200 ms) and are removed from the accessibility tree with `hidden` when closed. Menu state snapshots the pathname so navigation closes menus without writing state in an effect. The old `header.tsx` and its test were deleted; coverage moved to `navbar2.test.tsx` and `e2e/navbar.spec.ts`.

#### Consequences
Positive: premium, touch- and keyboard-safe navigation with zero new dependencies; no dead links (enforced by a unit test).
Negative: the mega-menu panel is part of the header component, so it grows when categories grow; no hover-open shortcut for desktop users.
New obligations: if "Deals" or an account experience is ever added, it must be added here with a real route/data source; any new dependency for animation needs an ADR.

#### Security/privacy impact
No data crosses a boundary. All navigation targets are first-party routes.

#### Cost impact
None.

#### Migration and rollback
The old header was deleted in the same commit; restoring it is a file restore plus a one-line layout change. `git revert` is sufficient.

#### Validation
`npm test` → 107 tests including the navbar2 suite; `npx playwright test` → 11 passed including mega-menu, support menu, search, cart-badge and mobile navigation; visual inspection at 1440/768/390 with no overflow, no duplicate ids and a clean console.

#### References
`CHANGELOG.md` (2026-10-25 navigation rebuild); `src/components/ui/navbar2.tsx`; `src/components/search/search-bar.tsx`.

### ADR-013: Host verified product imagery locally in `public/products` with recorded provenance
Date: 2026-10-25
Status: ACCEPTED
Decision owner: Project owner

#### Context
The seeded catalogue used Unsplash-hosted demo imagery for all products. A Sprint 04 audit confirmed three demonstrable image/product mismatches (a Galaxy S21 5G photo on the S25 Ultra record, an Apple MacBook photo on the Dell XPS 13 Plus record, and a compact travel-mouse photo on the MX Master 3S record). A replacement attempt failed for all three on Unsplash (auth-walled, unattributable per-photo provenance), while Wikimedia Commons supplied two exact-model, clearly licensed photos (CC BY 4.0) for the Samsung and Logitech records.

#### Decision drivers
- The storefront's core trust claim is "honest seeded data"; showing an S21 box under an S25 Ultra name directly undermines it.
- Any replacement must verify *exact-model identity* and a *documented license*; no third condition was acceptable.
- Unsplash per-photo authorship could not be established (host blocks API/scraping), so Unsplash cannot host *corrected* imagery even though its license permits use.
- A public-repository portfolio must be able to legally redistribute the asset it ships.

#### Options considered
1. Keep the mismatched Unsplash images — rejected for the two confirmed mismatches where a verified replacement exists; kept for the rest (no verified candidates anywhere).
2. Manufacturer/retailer press images (Samsung/Dell/Logitech pages) — rejected: display on a product page is not a redistribution license; downloading for repo distribution would be unlicensed copying.
3. Local, license-verified Commons assets + `CREDITS.md` provenance record — accepted, for both corrected products.
4. New remote image host for corrected assets — rejected: it would add `remotePatterns` surface for no benefit over local files that are already optimised by `next/image`.

#### Decision
Corrected images are stored in the repository at `dash-app/public/products/` (downscaled ≤1600 px, metadata-stripped), referenced from `products.ts` by local path, and accompanied by `public/products/CREDITS.md` recording source page, author, license (+ obligations and attribution lines), modifications, and residual uncertainty. Guardrail tests assert every local catalogue image exists in that folder and that its filename includes the product slug. Unsplash remains approved for uncorrected demo imagery pending owner-provided assets. `images.remotePatterns` is unchanged (local paths need no allowlist).

#### Consequences
Positive: legally redistributable, exactly-verified imagery for the two worst mismatches; provenance becomes auditable; repo ships what it renders.
Negative: the repo carries image bytes (~370 KB); corrected photos are user-taken (in-store / desk shots) rather than studio press renders.
New obligations: (1) CC BY 4.0 attribution lines apply if the site is published publicly while these images are used — recorded in `CREDITS.md`; (2) any future image added to `public/products/` must get a CREDITS row and pass the guardrail tests; (3) the Dell XPS 13 Plus mismatch remains open pending an owner-provided, verifiably licensed asset.

#### Security/privacy impact
EXIF/XMP/IPTC metadata (including capture hardware and shooting parameters) was stripped from committed assets; no personal data or GPS coordinates ship in the repo.

#### Cost impact
None (no new services; Next.js local image optimisation unchanged).

#### Migration and rollback
`git revert` of the data commit restores the previous Unsplash URLs; the assets and CREDITS record are additive and harmless if unused.

#### Validation
`npm test` (123 tests, including the extended image-source guardrails); `npx playwright test` (15 passed); visual inspection of the homepage (hero + category cards), product detail, cart and checkout surfaces showing the replaced products at 1440/768/390 px with no layout or console regressions.

#### References
`public/products/CREDITS.md`; `CHANGELOG.md` (2026-10-25 image-resolution sprint); `src/lib/data/products.ts`; `dash-app/next.config.ts`.

---

## 5. ADR lifecycle
- Proposed before implementation for significant decisions.
- Accepted when approved and implementation begins.
- Superseded when a newer ADR replaces it.
- Never delete old ADRs; they preserve history.
