The officer's summary workspace showing assignment counts and a quick list of assigned complaints.

**Page purpose**
- Landing dashboard for officers with stat cards and a list of assigned complaints, plus quick links to inbox/network/jobs.

**Data fetched**
- `getAssignedComplaints()` loads the officer's assigned complaints.

**State**
- `complaints`, `error`.

**Derived metrics**
- `active` = count of complaints with `status === "In Progress"`.
- Stat cards: Assigned complaints (total), In progress (active), Location ready (complaints with `location.latitude`).

**Navigation**
- Quick links to `/officer/inbox`, `/officer/network`, `/officer/jobs`.
- Each complaint row links to `/officer/complaints`; manual Refresh button reloads data.

**Child components**
- `Link` (react-router); icons Activity, ClipboardList, MapPinned, RefreshCw.
