# Skill: Architecture Decision Record (ADR)

Use when: a Medium or Large change requires an explicit decision, or when a stop condition forces a design choice that should be durable.

## When an ADR is required

- Hard-to-reverse decisions (database, auth provider, hosting platform, major AI capability).
- All Medium+ changes on Tier 3–4 projects (and on Tier 2 when the decision is structural).
- Any decision that introduces material new recurring cost.
- Any decision that would be expensive or risky to reverse later.

## Minimum content

- Title and date
- Status (Proposed / Accepted / Superseded / Deprecated)
- Context (what forces the decision)
- Decision
- Alternatives considered
- Consequences (positive, negative, follow-up work)
- Links to related standards, PRs, or tickets

## Rules

- Record the decision in `DECISIONS.md` (or a linked ADR file if the project prefers).
- Do not leave Proposed ADRs open indefinitely; resolve or escalate.
- When a later decision supersedes an earlier one, mark the old ADR and link the new one.
