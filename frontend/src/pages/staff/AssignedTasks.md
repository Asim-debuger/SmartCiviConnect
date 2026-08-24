The staff task workbench for accepting field tasks, starting live work, capturing evidence, and submitting for verification.

**Page purpose**
- Lists tasks assigned to the staff member with an auditable workflow: accept → start live work → capture evidence → submit for verification.

**Data fetched**
- `getAssignedComplaints()` loads assigned tasks on mount.
- `updateTask(id, payload)` transitions status/progress and appends work evidence.
- `updateStaffLocation` shares GPS when starting live work.

**State**
- `tasks`, `error`, `uploading` (per task id while evidence uploads).

**Workflow actions**
- Accept (`ASSIGNED` → `ACCEPTED`), Start live work (`ACCEPTED` → `IN_PROGRESS`, captures geolocation and begins sharing).
- `FieldEvidenceCapture` (staff) appends camera/GPS-tagged evidence during `IN_PROGRESS`.
- Submit for verification (`IN_PROGRESS` → `COMPLETED`, progress 100).

**Display**
- Progress bar reflects `task.progress`; evidence thumbnails (images/videos) render from `task.workEvidence`.
- Status notes for "Under Verification" (awaiting officer) and rejected evidence (`verificationNote`).

**Child components**
- `FieldEvidenceCapture` (staff), `LocationBlock` util, lucide icons Check/Play.
