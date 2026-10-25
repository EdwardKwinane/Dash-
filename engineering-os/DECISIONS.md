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

## 5. ADR lifecycle
- Proposed before implementation for significant decisions.
- Accepted when approved and implementation begins.
- Superseded when a newer ADR replaces it.
- Never delete old ADRs; they preserve history.
