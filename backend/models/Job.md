# Job

Mongoose models for job postings and job applications.

## Models

### Job

- `title` — `String`, required, trimmed, max 160
- `department` — `String`, required, indexed
- `description` — `String`, required, max 8000
- `location` — `String`
- `skillsRequired` — `[String]`, default `[]`
- `salaryMin`, `salaryMax` — `Number`
- `experience` — `String`
- `education` — `String`, default `""`
- `certifications` — `String`, default `""`
- `deadline` — `Date`
- `organization` — `String`, default `""`
- `workplace` — `String` enum `On-site | Remote | Hybrid`, default `On-site`
- `type` — `String` enum job types, default `Full time`, indexed
- `requiredDocuments` — `[String]`, default `[]`
- `status` — `String` enum `Open | Closed | Expired | Draft`, default `Open`, indexed
- `createdBy` — `String`

### Application

- `jobId` — `ObjectId` ref `Job`, required, indexed
- `applicantId` — `String`, required, indexed
- `name`, `email` — `String`
- `resumeUrl`, `resumePublicId` — `String`, select disabled
- `resumeFileName`, `resumeFileType` — `String`
- `resumeUploadedAt` — `Date`
- `coverLetter` — `String`, max 4000
- `skills` — `[String]`, default `[]`
- `experience`, `education`, `certifications`, `snapshot` — `Mixed`
- `experienceYears` — `Number`
- `documents` — array of `{ name, fileName, fileType, publicId, uploadedAt }`
- `completedWorks` — `Number`, default 0
- `interviewAt` — `Date`
- `recruiterNote` — `String`, max 2000
- `lockedAt`, `reviewedAt` — `Date`
- `reviewedBy` — `String`
- `status` — `String` enum application statuses, default `Applied`, indexed

## Indexes

- `Job`: text `{ title, description }`, compound `{ department, status, createdAt }`, compound `{ workplace, status }`
- `Application`: `jobId`, `applicantId`, compound unique `{ jobId, applicantId }`

## Relationships

- `Application` references `Job` via `jobId`.
