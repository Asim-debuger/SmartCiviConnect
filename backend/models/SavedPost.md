# SavedPost

Mongoose model tracking which user saved which post.

## Fields

- `userId` — `String`, required, indexed
- `postId` — `ObjectId` ref `Post`, required, indexed

## Indexes

- Compound unique: `{ userId: 1, postId: 1 }`
- Compound: `{ userId: 1, createdAt: -1 }`

## Relationships

- References `Post` via `postId`.
