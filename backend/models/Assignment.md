# Assignment

Mongoose model representing the assignment of a complaint to an officer or staff member.

## Fields

- `complaint` — `ObjectId` ref `Complaint`, required, indexed
- `complaintId` — `String`, required, indexed
- `assignedBy` — `ObjectId` ref `User`, required
- `officer` — `ObjectId` ref `User`
- `staff` — `ObjectId` ref `User`
- `department` — `String`, default `""`, indexed
- `note` — `String`, trimmed, max 1000
- `status` — `String` enum `Active | Completed | Cancelled`, default `Active`, indexed

## Indexes

- `complaint`, `complaintId`, `department`, `status`
- Compound: none explicit beyond individual indexes

## Relationships

- References `Complaint` via `complaint`
- References `User` via `assignedBy`, `officer`, `staff`
