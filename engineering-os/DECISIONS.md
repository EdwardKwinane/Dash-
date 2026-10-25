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

## 5. ADR lifecycle
- Proposed before implementation for significant decisions.
- Accepted when approved and implementation begins.
- Superseded when a newer ADR replaces it.
- Never delete old ADRs; they preserve history.
