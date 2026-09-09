# Follow

Mongoose model representing a user following another user.

## Fields

- `follower` — `ObjectId` ref `User`, required, indexed
- `following` — `ObjectId` ref `User`, required, indexed

## Indexes

- Compound unique: `{ follower: 1, following: 1 }`

## Relationships

- References `User` via `follower` and `following`.
