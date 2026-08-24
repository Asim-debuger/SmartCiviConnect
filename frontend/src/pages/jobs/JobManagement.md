The recruiter desk for creating jobs and managing applicants through a hiring pipeline (officer/recruiter view).

**Page purpose**
- Lets recruiters create civic jobs, list them with publish/close/reopen controls, and review/manage applicants and their dossiers.

**Data fetched**
- `listJobs()`, `listDepartments()` (platformApi) for the job list and department dropdown.
- `listJobApplications(jobId, { q, status, sort })`, `getApplication(id)` for candidates/dossiers.
- `getApplicationResume`, `getApplicationDocument` (via `useSignedFile`) for document preview/download.

**State**
- `jobs`, `departments`, `form` (empty job template), `selected`, `applications`, `active`, `filters` ({ q, status, sort }), `loading`, `error`.

**API calls (jobApi)**
- `createJob`, `updateJob` (status transitions), `updateApplication` (status, recruiterNote, interviewAt).

**Pipeline**
- Status options: Applied, Viewed, Shortlisted, Interview Scheduled, Selected, Joined, Rejected.
- Candidate rows allow quick status changes, add a recruiter note, and schedule an interview (`interviewAt`).
- Opening an applicant dossier (`active`) locks the submitted snapshot so the applicant can no longer edit it.

**Child components**
- `Avatar`, `ResumePreview` (signed file modal), `Link` to profiles.
