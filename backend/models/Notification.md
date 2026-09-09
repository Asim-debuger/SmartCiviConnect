# Notification

Mongoose model for user notifications with typed categories and read state.

## Fields

- `userId` — `String`, required, indexed
- `type` — `String` enum notification types, default `system`, indexed
- `category` — `String` enum categories, default `system`, indexed
- `title` — `String`, required
- `message` — `String`, required
- `link` — `String`
- `complaintId` — `String`, indexed
- `read` — `Boolean`, default `false`, indexed

## Indexes

- Compound: `{ userId: 1, createdAt: -1 }`, `{ userId: 1, read: 1 }`

## Relationships

- No explicit model references.
