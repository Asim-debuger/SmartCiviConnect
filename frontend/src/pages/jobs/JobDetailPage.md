The job detail page showing a single civic opening and an apply form for eligible users.

**Page purpose**
- Displays one job (`/jobs/<id>`) with full description, requirements, recruiter, and an application form.

**Data fetched**
- `getJob(id)` loads the job; `applyToJob(id, payload)` submits an application and reloads the job.

**State**
- `job`, `cover`, `skills`, `experience`, `education`, `certifications`, `error`, `message`.

**Apply form**
- Visible only when `user` exists and `job.status === "Open"`.
- Requires `user.hasResume`; `ResumeUpload` prompts the user to upload a resume first.
- On submit, sends cover letter/skills/experience/education/certifications and shows "Application submitted."

**Child components**
- `Avatar` (recruiter card), `ResumeUpload`, `Link` back to `${base}/jobs`.

**Role-specific behavior**
- Apply button is disabled ("Upload resume to apply") until the user has a resume on file.
