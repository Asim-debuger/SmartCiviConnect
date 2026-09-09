# LocationHistory

Mongoose model for recording location history tied to a user and optionally a complaint.

## Fields

- `user` — `ObjectId` ref `User`, required, indexed
- `complaint` — `ObjectId` ref `Complaint`
- `complaintId` — `String`, indexed
- `latitude` — `Number`, required, min -90 max 90
- `longitude` — `Number`, required, min -180 max 180

## Indexes

- Compound: `{ user: 1, createdAt: -1 }`

## Relationships

- References `User` via `user`.
- References `Complaint` via `complaint`.
