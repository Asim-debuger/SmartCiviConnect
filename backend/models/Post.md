# Post

Mongoose model for social posts with comments, replies, likes, shares, and saves.

## Subdocuments

- `replySchema` — reply to a comment with `author` ref `User`, `body`, `likes`
- `commentSchema` — comment with `author` ref `User`, `body`, `likes`, `replies: [replySchema]`

## Fields

- `author` — `ObjectId` ref `User`, required, indexed
- `body` — `String`, default `""`, trimmed, max 5000
- `kind` — `String` enum post kinds, default `Community Update`, indexed
- `link` — `String`, default `""`
- `linkPreview` — nested `{ url, title, description, image }`
- `media` — `[{ url, resourceType, name }]`
- `visibility` — `String` enum `public | connections`, default `public`, indexed
- `likes` — `[String]`, default `[]`
- `comments` — `[commentSchema]`, default `[]`
- `shares` — `Number`, default 0
- `saves` — `[String]`, default `[]`
- `sharedFrom` — `ObjectId` ref `Post`, default `null`
- `isRepost` — `Boolean`, default `false`, indexed

## Indexes

- `kind`, `visibility`, `isRepost`, `createdAt`
- Compound: `{ author: 1, createdAt: -1 }`, `{ likes: 1, createdAt: -1 }`

## Relationships

- References `User` via `author`.
- References `Post` via `sharedFrom`.
