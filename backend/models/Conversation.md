# Conversation

Mongoose models for conversations and chat messages between participants.

## Models

### Conversation

- `participants` — `[String]`, required, indexed
- `lastMessage` — `String`
- `lastAt` — `Date`

### ChatMessage

- `conversation` — `ObjectId` ref `Conversation`, required, indexed
- `senderId` — `String`, required, indexed
- `body` — `String`, trimmed, max 4000
- `attachments` — `[{ url: String, resourceType: String }]`
- `readBy` — `[String]`, default `[]`

## Indexes

- `Conversation`: `participants`
- `ChatMessage`: `conversation`, `senderId`

## Relationships

- `ChatMessage` references `Conversation` via `conversation`.
