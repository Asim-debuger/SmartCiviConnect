Access-control helpers for job applications.

- `canReviewJobApplications(user, job)` - Returns true if the user is Admin, Super Admin, or the job creator.
- `isApplicationLocked(application, job)` - Returns true if the application is locked because it has `lockedAt`, is in a reviewed status, or its job is not open.
- `canApplicantUpdate(user, application, job)` - Returns true if the user is the applicant and the application is not locked.
- `canAccessApplicationResume(user, application, job)` - Returns true if the user owns the application or can review the job.
- `sanitizeDocuments(docs)` - Strips sensitive fields from an array of document objects, keeping only safe metadata.
- `ownedDocuments(docs, userId)` - Filters documents down to those whose `publicId` belongs to the given user and sanitizes each.
- `buildApplicationSnapshot(user, extras)` - Builds a plain-object snapshot of an applicant's profile for storage on an application.
- `toClientApplication(application, { job, user })` - Strips secrets, sanitizes documents, and attaches `locked` and `canUpdate` flags for API responses.
- `REVIEWED_STATUSES` - Constant array of application statuses that mark an application as reviewed/locked.
