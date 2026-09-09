Complaint lifecycle event handlers that emit in-app notifications (and realtime pushes) at each stage of a complaint's journey.

- `onComplaintCreated(complaint, io)` — Notifies the submitting citizen of successful submission and routes a workload/status notification to Admins and Super Admins (urgent/high priority triggers a "workload" alert).
- `onDepartmentAssigned(complaint, io)` — Notifies the citizen that a department has been assigned to their complaint.
- `onOfficerAssigned(complaint, officer, io)` — Notifies the citizen and the assigned officer of the officer assignment.
- `onStaffAssigned(complaint, staff, actorRole, io)` — Notifies the citizen, the assigned field worker (staff), and the supervising officer when field staff are dispatched.
- `onStatusForCitizen(complaint, status, io)` — Maps complaint statuses (Verified, Rejected, Assigned, In Progress, Under Verification, Completed) to citizen-facing notifications; on completion, also alerts Admins/Super Admins that a workforce payment requires approval.
- `notifyMany` — Re-exported from `notificationService` for bulk notification delivery to arbitrary user ID lists.
