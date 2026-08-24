The staff summary workspace showing task counts and a quick list of assigned tasks.

**Page purpose**
- Landing dashboard for field staff with stat cards and a list of assigned tasks, plus quick links to earnings/jobs/network/inbox/profile.

**Data fetched**
- `getAssignedComplaints()` loads the staff's assigned tasks.

**State**
- `tasks`, `error`.

**Derived metrics**
- `completed` = count of tasks with `status === "Completed"`.
- Stat cards: Assigned tasks (total), In progress (`status === "In Progress"`), Completed.

**Navigation**
- Quick links to `/staff/earnings`, `/staff/jobs`, `/staff/network`, `/staff/inbox`, `/staff/profile/me`.
- Manual Refresh button reloads data; each task row shows title, complaint id, address, and status.

**Child components**
- `Link` (react-router); icons CheckCircle2, CircleDot, ClipboardList, RefreshCw.
