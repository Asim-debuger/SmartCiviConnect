This file displays the authenticated citizen's list of submitted complaints with search, filtering, and quick actions.

-   **Data Loading**: Fetches complaints via `getMyComplaints` and exposes a manual refresh button.
-   **Search and Filter**: Supports text search across complaint ID, title, and category, plus status filtering (All, Pending, Verified, Assigned, In Progress, Completed, Rejected).
-   **Complaint Cards**: Each card shows the complaint ID, title, category, status, and priority, with action buttons to view the full record, open a quick-view modal, or navigate to live tracking.
-   **Quick View Modal**: Opens `ComplaintDetailsModal` for a selected complaint without leaving the page.
-   **Empty State**: Renders a "No Complaints Found" message when filters return no results.
