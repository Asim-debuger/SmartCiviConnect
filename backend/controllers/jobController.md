Manages job postings, applications, recruiter reviews, status updates, and resume/document access for civic job listings.

- `listJobs` — Lists jobs with filters (location/skill/department/type/search/experience/workplace/salary); admins see all, head officers see their own, others see only open jobs; includes applicant counts.
- `getJob` — Returns a single job with applicant count and its recruiter profile; 404 if missing.
- `createJob` — Creates a job (Admin/Super Admin/Head Officer only) with parsed skills/required documents; writes an audit entry; 400 if title/description/department missing.
- `updateJob` — Updates allowed job fields for admins/head officers; normalizes status; 404 if missing.
- `apply` — Lets a logged-in user apply once per job (must be open and not past deadline) using their stored resume and profile snapshot; notifies applicant and recruiter; 400 if no resume uploaded.
- `listApplications` — Lists applications for a job the caller may review (own job), with applicant profiles and search/sort/filter support.
- `myApplications` — Lists the caller's own applications with job details.
- `getApplication` — Returns a single application; owner or recruiter only, and auto-locks the application as "Viewed" when a recruiter opens it.
- `updateApplicationMaterials` — Lets the applicant update resume/cover letter/skills/etc. while the application is still editable (not locked).
- `updateApplication` — Lets a recruiter (admin/head officer/owner) change application status (e.g. Shortlisted, Joined, Rejected), locking it and notifying the applicant by in-app notification and email.
- `accessApplicationResume` — Returns resume metadata or the file buffer for an authorized viewer (recruiter/owner), locking the application as viewed.
- `accessApplicationDocument` — Returns a specific attached document's metadata or file buffer for an authorized viewer.
