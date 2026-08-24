The detailed view of a single job application showing the submitted snapshot, resume/documents, and update controls.

**Page purpose**
- Displays one application (`/jobs/applications/<id>`) with the job details, the locked profile snapshot, and resume/document access.

**Data fetched**
- `getApplication(id)` loads the application.
- `getApplicationResume`, `getApplicationDocument`, `updateApplicationMaterials` (when updatable).
- `uploadResume` uploads a replacement resume; `useSignedFile` previews/signed-downloads documents.

**State**
- `item` (application), `error`, `busy`, plus `useSignedFile` modal/file error.
- `docs` via `applicationDocuments(item)` util.

**Displayed content**
- Job header (title, org, salary, description, skills), status badge, applied date, interview/recruiter note, cover letter.
- Submitted snapshot: skills, experience, education, certifications, projects, resume name with Preview/Download.
- Uploaded documents list with Preview/Download buttons.

**Role-specific behavior**
- When `item.canUpdate` (not locked/closed), shows a resume uploader and `DocumentUpload` to replace materials until reviewed.
