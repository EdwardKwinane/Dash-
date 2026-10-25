# INCIDENT_RESPONSE.md — Production Incident Standard

Version: 1.0

## 1. Principle
Things will break. What separates a production-grade project from a fragile one is having a known, rehearsed response — not the absence of failure.

## 2. Severity levels
- **SEV-1 (Critical):** Site/app down, data loss risk, security breach, payment processing broken. Immediate response required.
- **SEV-2 (High):** Major feature broken, significant user impact, no safe workaround. Same-day response.
- **SEV-3 (Medium):** Partial degradation, workaround exists, limited user impact. Next-business-day response.
- **SEV-4 (Low):** Cosmetic or edge-case issue, no meaningful user impact. Scheduled into normal work.

Tier (`AGENTS.md` §2) affects response speed expectations and on-call formality, not whether severity is assessed — every project, even Tier 1, should classify incidents this way so response is proportionate and not panicked or ignored.

## 3. Detection
Rely on `OBSERVABILITY.md`'s golden signals (latency, traffic, errors, saturation) and alerts to detect issues before or as close to when a client/user reports them as possible. For Tier 1 projects without formal monitoring budget, at minimum configure uptime checks and error-rate alerts on the primary domain/API — this is inexpensive and non-negotiable.

## 4. Response sequence
1. **Acknowledge** — confirm the incident is real and assign an owner (for a solo-agent setup, this is the agent, escalating to the human owner per severity).
2. **Assess severity** — classify per §2.
3. **Contain** — stop active harm first: disable a broken feature via flag (see `DEPLOYMENT.md` §4a), roll back a bad deploy, revoke a compromised credential — before pursuing a full root-cause fix.
4. **Communicate** — for SEV-1/SEV-2, notify the human owner immediately with: what's broken, who's affected, current containment status, and next update time. For client-facing incidents, prepare a plain-language status update the human owner can send if needed.
5. **Resolve** — apply `AGENTS.md` §4 RECOVER: reproduce, collect evidence, identify the failing layer, isolate root cause, implement the smallest correct fix, add regression coverage, verify adjacent behavior.
6. **Verify recovery** — confirm the fix works in production, not just locally; monitor for recurrence.
7. **Learn** — for SEV-1/SEV-2, write a short postmortem (see §6). SEV-3/4 incidents can be logged more lightly.

## 5. Escalation
- SEV-1: escalate to the human owner immediately, regardless of time. Do not wait for a scheduled check-in.
- SEV-2: escalate same-day.
- SEV-3/4: include in the next regular status report; no need for out-of-band escalation.

This mirrors and extends the general escalation rule in `AGENTS.md` §13 for the specific case of an active production incident.

## 6. Postmortem (SEV-1/SEV-2)
Keep it short and blame-free. Capture:
- **Timeline** — when it started, when detected, when resolved
- **Impact** — who/what was affected, for how long
- **Root cause** — the actual underlying cause, not just the symptom
- **Contributing factors** — anything that made detection or resolution slower than it should have been
- **Remediation** — what was fixed
- **Prevention** — what will stop this class of issue recurring (monitoring gap closed, test added, safeguard added)

File postmortems in the project's `DECISIONS.md` or a dedicated incident log if a project accumulates several — they are durable knowledge per `AGENTS.md`'s REMEMBER mode.

## 7. Incident readiness checklist
Every project, regardless of tier, should have documented (in `HOW_IT_WORKS.md` or equivalent):
- who can rotate credentials
- how to disable a compromised integration
- how to revoke sessions (if the project has auth)
- how to roll back the most recent deployment
- where logs/error tracking live and how to access them

## 8. Definition of resolved
An incident is resolved when the harmful behavior has stopped in production, the root cause is understood (not just the symptom suppressed), regression coverage exists to catch recurrence, and — for SEV-1/SEV-2 — a postmortem has been recorded.
