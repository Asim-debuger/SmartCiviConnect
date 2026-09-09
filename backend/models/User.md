# User

Mongoose model for platform users with roles, profiles, resumes, payment profiles, location sharing, and password hashing.

## Fields

- `name` — `String`, required, trimmed
- `email` — `String`, required, unique, lowercase, trimmed
- `username` — `String`, unique sparse, lowercase, trimmed, indexed
- `password` — `String`, select disabled
- `passwordReset` — nested `{ tokenHash, expiresAt }`
- `role` — `String` enum `Citizen | Staff | Officer | Head Officer | Admin | Super Admin`, default `Citizen`, indexed
- `profileImage` — `String`
- `phone` — `String`
- `department` — `String`, default `""`, indexed
- `skills` — `[String]`, default `[]`
- `headline` — `String`, trimmed, max 160, default `""`
- `bio` — `String`, trimmed, max 2000, default `""`
- `city` — `String`, trimmed, default `""`
- `experienceYears` — `Number` 0-60, default 0
- `experience` — array of `{ title, organization, years, summary }`
- `education` — array of `{ school, degree, year }`
- `certifications` — array of `{ name, issuer, year }`
- `achievements` — `[String]`, default `[]`
- `organization` — `String`, trimmed, default `""`
- `projects` — array of `{ title, summary, year }`
- `availability` — `String` enum `Available | Busy | Off Duty`, default `Available`, indexed
- `resumeUrl`, `resumePublicId` — `String`, default `""`, select disabled
- `resumeFileName`, `resumeFileType` — `String`, default `""`
- `resumeUploadedAt` — `Date`
- `savedPosts` — `[ObjectId]` ref `Post`, default `[]`
- `paymentProfile` — nested encrypted banking fields (`accountNumberEnc`, `accountHolderEnc`, `ifscEnc`, `bankNameEnc`, `phoneEnc`, `last4`, `ifscPrefix`, `bankNameDisplay`, `holderMasked`, `verified`, `verifiedBy`, `verifiedAt`, `updatedAt`), select disabled
- `locationSharing` — `Boolean`, default `false`
- `lastLocation` — nested `{ latitude, longitude, updatedAt }`
- `active` — `Boolean`, default `true`
- `refreshTokens` — array of `{ tokenHash, expiresAt }`, select disabled

## Indexes

- `role`, `username`, `department`, `city`, `skills`, `availability`
- Compound: `{ department: 1, city: 1 }`

## Hooks

- `pre save` — hashes `password` with bcrypt (rounds 12) if modified and present

## Methods

- `comparePassword(candidate)` — returns `Promise<Boolean>` comparing candidate against stored hash

## Relationships

- References `Post` via `savedPosts`.
