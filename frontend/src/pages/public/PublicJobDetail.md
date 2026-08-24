Public job detail page showing a single open civic role with an application form.

**Job details**
- Fetches job by `id` via `getPublicJob`.
- Displays title, organization, department, location, workplace type, salary range, description, required skills, experience, education, certifications, required documents, deadline, and applicant count.
- Shows recruiter avatar, name, and headline if available.

**Application form**
- Authenticated users can submit a cover note and upload a resume via `ResumeUpload`.
- Submits application via `applyToJob`.
- Validates that the user has a resume before allowing submission.

**Authentication flows**
- Unauthenticated users see Login and Register links with redirect back to the job page.

**Components used**
- `Avatar`, `ResumeUpload`.
- React Router `Link` and `useParams`.
- `useAuthContext` for auth state.
