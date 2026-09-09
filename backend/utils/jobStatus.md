Job and application lifecycle helpers, constants, and migration utilities.

- `JOB_STATUSES` - Array of valid job statuses: `Open`, `Closed`, `Expired`, `Draft`.
- `OPEN_JOB_STATUS` - Constant string `Open`.
- `APPLICATION_STATUSES` - Array of valid application statuses.
- `normalizeJobStatus(status)` - Normalizes aliased/case-varied job statuses to canonical forms.
- `normalizeApplicationStatus(status)` - Normalizes aliased/case-varied application statuses to canonical forms.
- `isOpenJob(job)` - Returns true if the job is `Open` and its deadline is in the future.
- `expireOverdueJobs(Job)` - Marks open jobs whose deadline has passed as `Expired`.
- `jobTypeFilter(type)` - Maps a job type filter to a MongoDB `$in` query or `undefined` for `All`.
- `migrateJobEnums(Job, Application)` - Runs overdue-job expiration, normalizes legacy enum values, and backfills missing fields in Jobs and Applications.
- `copyIfMissing(collection, from, to)` - Copies values from one field to another on documents where the target is missing/null/empty.
