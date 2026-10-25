# Skill: Database Migration

Use when: any schema change, migration, backfill, or expand/contract work.

## Pre-flight

1. Confirm ownership of the data and the migration in `DATABASE_DESIGN.md` / `PROJECT_CONTEXT.md`.
2. Classify the change (Small / Medium / Large). Large or destructive changes require an ADR.
3. Prefer expand → migrate → contract for risky changes. Never assume code rollback reverses data.
4. Estimate table size, lock risk, and expected duration on production-like data volumes.

## Required design answers

- What is the new/changed ownership and cardinality?
- Constraints, nullability, uniqueness, indexes?
- Expected query patterns after the change?
- Authorization model still correct?
- Backfill strategy (if needed) and how it will be verified?
- Rollback limitations? Is a forward-fix path required?

## Implementation rules

- Migrations must be reviewed and tested on realistic data volumes before production.
- Prefer non-blocking migrations when feasible.
- Separate expand, data migration, and contract phases for risky changes.
- Never place irreversible destructive steps in the same migration as the expand step without an explicit, tested recovery plan.
- Update `PROJECT_CONTEXT.md` and any relevant architecture docs after the change.

## Done criteria

- Migration is forward-compatible where possible.
- Rollback or recovery path is documented.
- Tests cover the new schema and any backfill.
- Observability and alerts updated if the change introduces new failure modes.
