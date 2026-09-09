Handles civic complaint creation, status changes, citizen feedback, and category suggestions, with audit logging, real-time emits, and email notifications.

- `createComplaint` — Creates a complaint; requires title/description/category and a live GPS location (manual entry rejected), assigns a sequential complaint ID and resolves the responsible department, emits real-time updates, fires creation/assignment events, writes an audit entry, and returns 201.
- `suggest` — Keyword-matches free text to a suggested category/priority/department (defaults to Public Safety / Other).
- `getMyComplaints` — Lists the caller's own complaints filtered by status/category/priority, with evidence redacted for the viewer.
- `getComplaintById` — Returns a single complaint if the caller is authorized (Admin/Super Admin, Head Officer of department, or involved party), with citizen/officer/staff details and evidence redaction.
- `updateComplaint` — Lets the reporting citizen submit ratings/feedback (overall or quality/satisfaction/behaviour) only after officer-verified completion; emits updates.
- `changeStatus` — Advances a complaint through allowed status transitions (role-gated for Verified/Rejected/Completed), validates completion evidence on completion, ensures a workforce payment, notifies the citizen via email, writes an audit entry, and emits real-time updates.
