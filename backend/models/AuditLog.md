# AuditLog

Mongoose model for recording actor action logs with optional target metadata.

## Fields

- `actorId` — `String`, required, indexed
- `action` — `String`, required, indexed
- `targetType` — `String`
- `targetId` — `String`
- `metadata` — `Mixed`

## Indexes

- `actorId`, `action`

## Relationships

- No explicit model references.
