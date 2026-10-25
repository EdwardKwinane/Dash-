# GIT_WORKFLOW.md — Version Control and Collaboration Standard

Version: 1.0

## 1. Principle
Git history is a durable record of decisions, not just a backup mechanism. It should let anyone — human or agent — reconstruct what changed, why, and when, without reading chat logs.

## 2. Branching model
Default to a lightweight trunk-based model, appropriate for small teams and solo-owner/agent-built projects:
- `main` is always deployable.
- Work happens on short-lived feature branches (`feature/<short-description>`, `fix/<short-description>`, `chore/<short-description>`).
- Merge back to `main` promptly — avoid long-lived branches that drift and become painful to merge.
- For Tier 3+ projects with multiple contributors or stricter release control, add a `staging`/`release` branch between feature branches and `main` if the deployment model (see `DEPLOYMENT.md`) requires a pre-production gate.

## 3. Commit conventions
Use Conventional Commits or an equivalent structured format so history is machine- and human-readable:

```
<type>(<scope>): <short summary>

[optional body: why this change, not just what]

[optional footer: breaking changes, issue references]
```

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `perf`, `style`, `build`, `ci`.

- Write commit messages for a future reader who has no other context — explain intent, not just the diff.
- One logical change per commit where practical; avoid bundling unrelated changes.
- Never commit secrets, `.env` files with real values, or generated artifacts that belong in `.gitignore`.

## 4. Pull requests / change review
Even for a solo-owner project where the AI agent is the primary implementer, every non-trivial change should produce a reviewable unit (a PR, or at minimum a clearly scoped commit) that states:
- what changed and why
- which tier/change classification it falls under (see `AGENTS.md` §6)
- what was tested
- any cost, security, or accessibility implications
- rollback plan if applicable

Medium/Large changes (per `AGENTS.md` §6) require explicit human approval before merge to `main`, per the escalation rules in `AGENTS.md` §13. Small changes may be agent-approved and merged directly, but must still be visible in history with a clear message.

## 5. Merge strategy
- Prefer squash-merge for feature branches into `main` to keep history readable, unless preserving granular commit history is specifically valuable (e.g. a large collaborative refactor).
- Never force-push to `main` or any shared branch.
- Resolve conflicts by understanding both changes' intent, not by mechanically picking one side.

## 6. Tagging and releases
- Tag meaningful production releases (e.g. `v1.2.0`) so any deployed state can be traced back to an exact commit.
- Maintain a lightweight changelog (can be generated from commit history) for client-facing projects so "what changed and when" is answerable without spelunking.

## 7. Repository hygiene
- Keep `.gitignore` current for the stack in use (dependencies, build output, env files, editor config).
- Remove dead branches after merge.
- Large binary assets (images, videos) belong in appropriate storage/CDN, not committed directly to the repo, unless the project is small enough that this is genuinely simpler and cheaper.

## 8. Definition of a clean change
A change is cleanly delivered when it's on its own branch or clearly scoped commit, has a conventional, intent-explaining message, passes CI (see `TESTING_STRATEGY.md` §11), and required approval (if Medium/Large) was obtained before merging to `main`.
