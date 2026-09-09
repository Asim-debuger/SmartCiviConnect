Documents stabilization/normalization utilities across jobs, complaints, posts, applications, resumes, and network profiles, ensuring safe status mapping, access control, and data redaction.

- Open jobs accept "Open" status and reject "Closed" or expired (past-deadline) listings.
- Application and job status aliases map to stored canonical values.
- Complaint lookup treats `SCC-` civic ids as plain fields and only casts valid 24-hex strings to ObjectId `$or` queries.
- `escapeRegex` escapes regex metacharacters for safe directory search.
- Feed `normalizeKind` keeps valid enum kinds, falls back to "Community Update", and trims/recognizes "achievement".
- `sanitizePostMedia` reduces media to url/type/name, drops empty urls, and defaults missing resourceType to "raw".
- Application field coercion: `toSkillList` handles comma strings and name objects; empty education and invalid experience years fall back to defaults.
- `isApplicationLocked` locks after recruiter review, explicit lock, terminal status, or job closure.
- `canApplicantUpdate` allows only the owner to edit an unlocked application.
- Resume access is limited to owner/recruiter/admin, never public; `canReviewJobApplications` enforces job ownership; `sanitizeDocuments` strips publicIds.
- `stripResumeSecrets` exposes `hasResume` from filename while stripping the publicId.
- Resume delivery metadata uses proxy delivery, never a Cloudinary URL; `mimeForResume` maps extensions to MIME types.
- `toSafeNetworkProfile` exposes id for others and never leaks email/resume/payment fields; self views keep email and computed `hasResume`.
