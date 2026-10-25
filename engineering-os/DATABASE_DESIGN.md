# DATABASE_DESIGN.md — Data Modeling and Persistence Standard

Version: 1.0

## 1. Principle
The database is a long-lived product boundary. Model business truth deliberately.

## 2. Entity design
Every core entity should define:
- identity/primary key
- ownership
- lifecycle
- relationships
- required vs optional fields
- invariants
- sensitive fields
- retention/deletion behavior

## 3. Constraints
Prefer database-enforced constraints for critical invariants:
- NOT NULL
- UNIQUE
- FOREIGN KEY
- CHECK

Application validation complements, not replaces, data integrity.

## 4. Indexing
Create indexes from actual query patterns. Review composite index order and write amplification. Avoid indexing every column by default.

## 5. Transactions
Use transactions for multi-step operations that must succeed or fail atomically.

## 6. Multi-tenancy
Make tenant scope explicit in schema, queries, indexes, and authorization. Consider row-level security where appropriate.

## 7. Soft vs hard delete
Choose deliberately. Define restoration expectations, retention, privacy obligations, uniqueness interactions, and cascading behavior.

## 8. Audit/history
For mutable high-value state, decide whether you need:
- updated timestamps
- actor IDs
- audit log
- append-only history
- event sourcing (rare; use only when justified)

## 9. Migrations
Each migration should define:
- forward change
- data backfill if needed
- compatibility window
- expected lock/time impact
- rollback limitations

## 10. Query standards
Avoid N+1, full scans on growing tables, unbounded list queries, and selecting unnecessary fields. Use pagination and explain/analyze for important queries.

## 11. Data retention
Define retention and deletion policies for logs, sessions, uploads, analytics, AI transcripts, and user-generated data.

## 12. Backup/recovery
Critical systems require automated backups and periodic restore validation.
