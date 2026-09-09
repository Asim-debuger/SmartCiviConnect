Coordinates operational workflow for complaints: listing, assignment, task lifecycle, verification, messaging, live location tracking, and department/officer oversight.

- `listComplaints` — Lists complaints (scoped to a Head Officer's department) with status/category/priority/department/date/search filters.
- `dashboardStats` — Returns counts of total/pending/completed/active/under-verification complaints and active users (department-scoped for Head Officers).
- `assignComplaint` — Assigns an officer and/or staff to a complaint (validates roles), records an Assignment, sets status to Assigned, emits `assignment:new`, notifies and emails assignees, and writes an audit entry.
- `listAssigned` — Lists complaints assigned to the caller (officer/staff/head officer) filtered by status bucket.
- `acceptComplaint` — Lets the assigned officer accept a complaint (sets ACCEPTED) and notifies the citizen.
- `assignStaff` — Lets an assigned officer or admin assign staff to a complaint, recording the assignment and notifying/emailing the staff member.
- `updateTask` — Updates a task's operational status/progress/work evidence (staff submits evidence, officer progresses), enforces allowed transitions, notifies officer/citizen, sends status email, and emits updates.
- `verifyTask` — Lets an admin/head officer or assigned officer verify completed work, marks it Completed/VERIFIED, ensures payment, notifies staff/officer/citizen, and sends email.
- `rejectEvidence` — Rejects submitted evidence (admin/head officer/officer) with a required reason, reverting task to In Progress and notifying staff.
- `rejectComplaint` — Lets officers/admins reject a complaint (sets Rejected) and notifies the citizen.
- `sendMessage` / `listMessages` — Sends/lists complaint-scoped messages among involved parties (and admins), emitting `message_received` in real time.
- `updateLocation` — Staff-only live location sharing; stores last location + history and emits location updates to relevant complaints/officers.
- `listLiveLocations` — Returns currently sharing staff locations, scoped by role (officer sees own staff, citizen sees their complaint's staff, head officer by department).
- `listWorkers` — Lists active staff (officer/head officer/admin) filtered by skill/availability/department.
- `departmentOverview` — Head officer/admin summary of a department's complaints, workers, officers, and pending/completed counts.
