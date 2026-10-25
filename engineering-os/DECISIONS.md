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

## 5. ADR lifecycle
- Proposed before implementation for significant decisions.
- Accepted when approved and implementation begins.
- Superseded when a newer ADR replaces it.
- Never delete old ADRs; they preserve history.
