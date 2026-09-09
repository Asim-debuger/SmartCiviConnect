Audit logging service that records user actions to the `AuditLog` collection.

- `writeAudit({ actorId, action, targetType, targetId, metadata })` — Persists a single audit entry to MongoDB via the `AuditLog` model. Silently catches and logs errors to stdout so audit failures never break the calling request flow. Called from controllers after significant state changes (complaint creation, assignments, status transitions, etc.).
