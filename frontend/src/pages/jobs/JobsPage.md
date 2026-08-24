The job marketplace listing open civic roles with filters, one-click apply, and the user's applications.

**Page purpose**
- Browse/search civic jobs and apply (citizen/staff), plus view and manage "My applications".

**Data fetched**
- `listJobs(params)` with debounced filters; `myApplications()` for the user's applications.
- `applyToJob(id, { coverLetter, documents })` submits an application.

**State**
- `jobs`, `applications`, `filters` (search, department, location, skill, experience, salaryMin, type, workplace), `debounced`, `cover`, `pendingDocs`, `error`, `appError`, `loading`.
- `role` normalized via `normalizeRole(user?.role)`.

**Filtering**
- Filters are debounced (350ms) before triggering a refetch; `type`/`workplace` of "All" are omitted from the request.

**Role-specific behavior**
- For citizen/staff roles, shows `ResumeUpload` and `DocumentUpload` that attach to the next application, plus a shared cover note.
- Apply button disabled until `user.hasResume`; pending docs are cleared after applying.
- `applicationDocumentsSafe` derives documents from snapshot or top-level field for the applications list.

**Child components**
- `ResumeUpload`, `DocumentUpload`, `Link` to job detail and application detail.
