# Message

Mongoose model for direct messages linked to a complaint between two users.

## Fields

- `complaintId` — `ObjectId` ref `Complaint`, required, indexed
- `senderId` — `String`, required
- `recipientId` — `String`, required
- `body` — `String`, required, trimmed, max 2000

## Indexes

- `complaintId`

## Relationships

- References `Complaint` via `complaintId`.
