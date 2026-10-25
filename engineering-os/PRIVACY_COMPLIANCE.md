# PRIVACY_COMPLIANCE.md — Data Privacy and Regulatory Compliance Standard

Version: 1.0

## 1. Principle
Personal data belongs to the person it describes, not the business collecting it. Collect the minimum necessary, protect it properly, and give people control over it — regardless of client size. This standard operationalizes the data classification introduced in `SECURITY.md` §13.

## 2. Data minimization
- Collect only the personal data genuinely required for the feature to work.
- Avoid speculative collection ("might be useful later") — it only creates future liability and compliance surface area.
- Set explicit retention periods for every category of personal data (see §7); do not default to "keep forever."

## 3. Legal bases and applicable regimes
Identify which regimes apply based on where the client's users are located, and design for the strictest one that plausibly applies:
- **GDPR** (EU/UK users): requires a lawful basis for processing, data subject rights (§5), and breach notification.
- **CCPA/CPRA** (California users): requires disclosure of data collection/sale and opt-out rights.
- **Sector-specific rules** (health, financial, children's data) may impose stricter requirements (HIPAA, COPPA, etc.) — flag these explicitly to the human owner if the project touches them; they typically require dedicated legal review beyond this standard.

For most Tier 1-2 small-business projects, the realistic bar is: a clear privacy policy, a working cookie/consent mechanism if using non-essential tracking, and honoring deletion/access requests promptly. Don't over-engineer enterprise compliance tooling for a project that doesn't need it — but don't skip the basics either.

## 4. Cookies and tracking
- Distinguish essential cookies (session, security) from non-essential (analytics, marketing, personalization).
- Non-essential cookies/trackers require consent before being set, for users in regimes that require it (GDPR-style opt-in) — a simple, honest cookie banner is sufficient for most Tier 1-2 projects.
- Never load third-party trackers before consent is given where consent is required.

## 5. Data subject rights
Support, at minimum:
- **Access** — a person can request what data is held about them.
- **Deletion** — a person can request their data be deleted, and deletion actually cascades correctly (see `DATABASE_DESIGN.md` §7 on soft/hard delete).
- **Correction** — a person can correct inaccurate data about them.
- **Export** — a person can obtain a copy of their data in a usable format, where required.

For small projects, these can be manual processes (a documented procedure for the human owner to follow) rather than a self-service UI — but the process must exist and be documented in `HOW_IT_WORKS.md`, not improvised when a request arrives.

## 6. Third-party processors
- Maintain a list of every third party that processes personal data on the client's behalf (hosting, email, analytics, AI providers, payment processors).
- Confirm each has an appropriate data processing agreement or equivalent terms, especially for AI providers receiving user content — see `AI_ENGINEERING.md` §14 on minimizing what's sent to a model provider.
- Avoid adding a new data-processing third party without disclosing it to the human owner (this is a Medium+ change per `AGENTS.md` §6).

## 7. Retention and deletion
Define, per data category:
- how long it's kept
- why (legal requirement, product need, or default cleanup)
- how it's deleted when the period ends or a user requests it
- whether backups need separate handling

This applies to logs, session data, uploaded files, AI conversation transcripts, and analytics events — not just the primary application database.

## 8. Breach response
Fold into `INCIDENT_RESPONSE.md`'s process. Additionally, for a confirmed personal-data breach:
- assess what data and how many people were affected
- determine notification obligations under applicable regimes (may require notifying a regulator and affected individuals within a defined window under GDPR-style rules)
- advise the human owner immediately — this is always a SEV-1 incident and always requires human decision-making before any external communication is sent.

## 9. AI-specific privacy considerations
- Do not send more personal data to an AI model/provider than the task requires (see `AI_ENGINEERING.md` §14).
- Disclose to end users when they're interacting with an AI system, where that's material to their expectations (e.g. a chatbot presented as human).
- If conversation transcripts are stored, apply the same retention/deletion rules as any other personal data.

## 10. Definition of compliant
A project meets this standard when personal data collected is minimal and justified, a privacy policy accurately describes what's collected and why, consent is obtained where required, data subject requests have a documented process, third-party processors are known and appropriate, and retention/deletion rules are defined and enforced.
