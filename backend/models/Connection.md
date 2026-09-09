# Connection

Mongoose model representing a social connection request between two users.

## Fields

- `requester` — `ObjectId` ref `User`, required, indexed
- `recipient` — `ObjectId` ref `User`, required, indexed
- `status` — `String` enum `Pending | Accepted | Rejected`, default `Pending`, indexed

## Indexes

- Compound unique: `{ requester: 1, recipient: 1 }`

## Relationships

- References `User` via `requester` and `recipient`.
