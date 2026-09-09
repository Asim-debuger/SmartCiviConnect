# Department

Mongoose model for departments with assigned head officers and categories.

## Fields

- `name` — `String`, required, unique, trimmed
- `description` — `String`, trimmed, max 1000
- `categories` — `[String]`, default `[]`
- `headOfficerId` — `String`, default `""`, indexed
- `officerIds` — `[String]`, default `[]`
- `active` — `Boolean`, default `true`

## Indexes

- `headOfficerId`

## Relationships

- No explicit model references.
