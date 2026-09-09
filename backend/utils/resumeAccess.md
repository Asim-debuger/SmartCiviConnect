Resume document storage, access, and download utilities backed by Cloudinary.

- `RESUME_TTL_SECONDS` - Signed URL expiry in seconds (90).
- `RESUME_TYPES` - Set of allowed resume extensions: `pdf`, `doc`, `docx`.
- `resumeFolder(userId)` - Returns the Cloudinary folder path for a user's resumes.
- `resumeTypeFromFile(fileName, mimeType)` - Determines the resume type (`pdf`, `doc`, `docx`) from filename/MIME.
- `isAllowedResumeType(fileType)` - Checks whether a file type is an allowed resume format.
- `ownsResumePublicId(publicId, userId)` - Returns true if the public ID belongs to the user's resume folder.
- `mimeForResume(fileName, fileType)` - Maps a resume file type to its MIME string.
- `safeFileName(fileName)` - Sanitizes a filename, replacing unsafe characters with underscores.
- `publicIdWithoutFormat(publicId, format)` - Strips a trailing format extension from a public ID.
- `cloudinaryMessage(error)` - Translates Cloudinary errors into user-facing messages.
- `stripResumeSecrets(payload)` - Removes `resumeUrl`/`resumePublicId` from an application payload while preserving safe resume metadata and snapshot fields.
- `inspectResumeAsset(publicId)` - Probes Cloudinary with multiple resource/type options to locate a stored resume asset.
- `downloadViaApi(publicId, format, resourceType, type)` - Builds a signed Cloudinary download URL and fetches the file as a Buffer.
- `fetchResumeBuffer({ publicId, fileName, fileType })` - Orchestrates resume retrieval; falls back from direct download to asset inspection, returning buffer, content type, filename, and a `needsReupload` flag.
- `sendResumeBuffer(res, file, { download })` - Streams a resume Buffer to an Express response with appropriate headers.
- `resumeMeta(fileName, fileType, extra)` - Builds a metadata response object for resume uploads.
- `canReviewJobApplications(user, job)` - Delegates to `applicationAccess.canReviewJobApplications` to authorize resume access.
