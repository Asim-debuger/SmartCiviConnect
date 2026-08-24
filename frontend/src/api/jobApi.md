This file contains functions for interacting with the job and job application-related API endpoints.

-   **Job Functions**:
    -   `listJobs(params)`: Fetches a list of jobs, with optional query parameters for filtering.
    -   `getJob(id)`: Retrieves a single job by its ID.
    -   `createJob(payload)`: Creates a new job posting.
    -   `updateJob(id, payload)`: Updates an existing job posting.

-   **Application Functions**:
    -   `applyToJob(id, payload)`: Submits an application for a specific job.
    -   `listJobApplications(id, params)`: Lists all applications for a given job.
    -   `myApplications()`: Fetches all job applications submitted by the current user.
    -   `getApplication(applicationId)`: Retrieves a single job application.
    -   `updateApplication(applicationId, status, extra)`: Updates the status of a job application.
    -   `updateApplicationMaterials(applicationId, payload)`: Updates the materials (like resume or cover letter) for an application.

-   **File Access**:
    -   `getApplicationResume(applicationId, download)`: Fetches the resume associated with an application, using the `fetchProtectedFile` helper.
    -   `getApplicationDocument(applicationId, index, download)`: Fetches a specific document from an application.