# Skill: Feature Flag Lifecycle

Use when: creating, shipping behind, or cleaning up a feature flag.

## Every flag must have

- Clear name following a consistent convention (e.g. `ff_<area>_<feature>`)
- An owner
- Stated purpose: release gating, kill switch, experiment, or permanent configuration
- Expected lifetime (release-gating and experiment flags need a target removal date; kill switches and permanent config are explicitly exempt and labeled as such)
- Defined default state (on/off) for each environment

## Rules

- Feature flags are a liability from the moment they are created.
- Review flags regularly (sprint/release boundary or monthly for small teams).
- Remove stale release-gating and experiment flags whose feature has fully shipped or been abandoned.
- Do not let a flag outlive its purpose silently.
- Dead flags accumulate complexity and hide bugs.

## Done criteria for a new flag

- Purpose and lifetime recorded (in code comment, flag registry, or `DECISIONS.md` as appropriate).
- Default states set per environment.
- Cleanup ticket or reminder exists if the flag is temporary.
