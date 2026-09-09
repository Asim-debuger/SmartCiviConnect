# Complaint

Mongoose model for civic complaints with media, status history, task progress, ratings, and verification workflow.

## Subdocuments

- `mediaSchema` — media item with `url`, `publicId`, `resourceType` enum `image | video | raw`, `phase` enum `before | after | general`, `name`, `capturedAt`, `uploadedAt`, `latitude`, `longitude`, `duration`, `staffId`, `complaintId`, `source` enum `camera | upload`
- `historySchema` — status history entry with `status` enum, `note`, `changedBy`, timestamps
- `taskHistorySchema` — task status entry with `status` enum `ASSIGNED | ACCEPTED | IN_PROGRESS | COMPLETED | VERIFIED`, `changedBy`, `note`, timestamps

## Fields

- `complaintId` — `String`, unique, indexed
- `citizenId` — `String`, required, indexed
- `citizen` — `ObjectId` ref `User`
- `title` — `String`, required, trimmed, max 160
- `description` — `String`, required, trimmed, max 5000
- `category` — `String` enum civic categories, required
- `priority` — `String` enum `Low | Medium | High | Urgent`, default `Medium`
- `status` — `String` enum `Pending | Verified | Assigned | In Progress | Under Verification | Completed | Rejected`, default `Pending`, indexed
- `location` — nested `{ address, formattedAddress, latitude, longitude, mapsUrl }`
- `media` — `[mediaSchema]`, default `[]`
- `assignedOfficerId` — `String`, indexed
- `assignedStaffId` — `String`, indexed
- `assignedOfficer` — `ObjectId` ref `User`
- `assignedStaff` — `ObjectId` ref `User`
- `department` — `String`, indexed
- `departmentRef` — `ObjectId` ref `Department`
- `operationalStatus` — `String` enum `ASSIGNED | ACCEPTED | IN_PROGRESS | COMPLETED | VERIFIED`, default `ASSIGNED`, indexed
- `progress` — `Number` 0-100, default 0
- `workEvidence` — `[mediaSchema]`, default `[]`
- `evidenceStatus` — `String` enum `none | pending | approved | rejected`, default `none`
- `verifiedBy` — `String`
- `verificationNote` — `String`, trimmed, max 2000
- `workSession` — nested `{ active, startedAt, endedAt }`
- `taskHistory` — `[taskHistorySchema]`, default `[]`
- `acceptedAt`, `startedAt`, `completedAt`, `verifiedAt` — `Date`
- `history` — `[historySchema]`, default `[]`
- `rating` — `Number` 1-5
- `ratingQuality`, `ratingSatisfaction`, `ratingBehaviour` — `Number` 1-5
- `feedback` — `String`, trimmed, max 2000

## Hooks

- `pre validate` — sets `complaintId` to `SCC-PENDING-${_id || Date.now()}` if missing

## Indexes

- `complaintId`, `citizenId`, `status`, `assignedOfficerId`, `assignedStaffId`, `department`, `operationalStatus`
- Compound: `{ citizenId: 1, createdAt: -1 }`, `{ assignedOfficerId: 1, status: 1 }`, `{ assignedStaffId: 1, status: 1 }`, `{ "location.latitude": 1, "location.longitude": 1 }`

## Relationships

- References `User` via `citizen`, `assignedOfficer`, `assignedStaff`
- References `Department` via `departmentRef`
