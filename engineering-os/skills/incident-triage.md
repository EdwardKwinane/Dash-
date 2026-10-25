# Skill: Incident Triage

Use when: a production incident is declared or a critical failure is under investigation.

## Immediate actions

1. Follow `INCIDENT_RESPONSE.md` in full. Do not improvise around it.
2. Reproduce or confirm the failure with evidence (logs, metrics, traces, user reports).
3. Identify the failing layer (edge, app, data, provider, AI subsystem, etc.).
4. Isolate the root cause; prefer the smallest correct fix.
5. Implement the fix, add regression coverage, verify adjacent behavior.
6. Record architectural lessons in `DECISIONS.md` or the relevant standard when needed.

## Rules

- Do not rewrite stable subsystems to fix isolated defects.
- Protect production access; use least-privilege credentials.
- Communicate status clearly; do not bury open questions.
- After resolution, update `RUNBOOK.md` and any relevant observability or deployment docs if new failure modes were discovered.

## AI-specific incidents

- Treat model output, tool calls, and retrieved context as untrusted evidence.
- Confirm whether the failure is model quality, prompt/config drift, tool authorization, rate limiting, or upstream provider.
- If the agent path is involved, consider using the kill switch while investigating.
