This file handles file uploads to a third-party service, Cloudinary.

-   **`uploadComplaintMedia(...)`**: Manages the upload of media files (images, videos, documents) for complaints.
    -   It first fetches a signature from the backend (`/uploads/signature`) for authenticating with Cloudinary.
    -   It iterates through the provided files, constructs a `FormData` object for each, and sends it to the Cloudinary upload endpoint.
    -   It determines the `resourceType` (image, video, or raw for documents) based on the file's MIME type.
    -   It includes a retry mechanism for failed uploads.
    -   It calls an `onProgress` callback after each successful upload.
    -   It returns an array of objects containing the `secure_url`, `public_id`, and other details of the uploaded files.

-   **`uploadResume(file)`**: Manages the upload of a user's resume.
    -   It performs client-side validation for file type (PDF, DOC, DOCX) and size (max 5MB).
    -   It fetches a specific signature for resume uploads from `/uploads/resume-signature`.
    -   It uploads the file to Cloudinary's raw upload endpoint.
    -   It returns an object with the resume's `public_id`, filename, and other metadata.