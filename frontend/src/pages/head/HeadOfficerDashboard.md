Displays department overview for head officers including officer lists, performance charts, and complaints awaiting approval.

- **Data fetched**: Calls `getDepartmentOverview`, `getAssignedComplaints`, and `getAnalytics` in parallel on mount.
- **State**: Tracks `overview`, `complaints`, `analytics`, and `error`.
- **UI**: Renders summary cards (total complaints, open, completed, active workers), officers list, department performance bar chart, and a section for complaints awaiting approval.
- **Actions**: Allows head officers to approve or reject evidence for complaints under verification directly from the dashboard.
- **Navigation**: Provides a link to the full officer complaints queue.
- **Child components used**: `BarChart`, `EvidenceReview`.
- **API calls**: `getDepartmentOverview`, `getAssignedComplaints`, `getAnalytics`, `verifyTask`, `rejectEvidence`.
