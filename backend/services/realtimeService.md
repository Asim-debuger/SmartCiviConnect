Socket.IO realtime emit helpers that broadcast complaint, assignment, and location events to role-based and resource-specific rooms.

- `emitToRoles(io, roles, event, payload)` — Emits an event to every Socket.IO room named `role:<role>` in the supplied list.
- `emitComplaint(io, complaint, extraEvents)` — Broadcasts `complaint:update` (and `complaint:updated`) to the complaint's rooms (`complaint:<complaintId>` and `complaint:<mongoId>`), plus any `extraEvents`; also pushes to Admin/Super Admin/Head Officer/Officer role rooms.
- `emitAssignment(io, payload)` — Emits `assignment:new` to the assignee's user room and to Admin/Super Admin/Head Officer role rooms.
- `emitLocation(io, payload)` — Emits `location:update` (and `location:updated`) to complaint rooms and to Officer/Head Officer/Admin/Super Admin role rooms.
