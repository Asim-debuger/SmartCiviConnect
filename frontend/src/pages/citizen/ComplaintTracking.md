This file renders a live tracking view for a single complaint, combining status info with a map.

-   **Complaint Loading**: Fetches complaint data by ID via `getComplaintById` and subscribes to real-time WebSocket events (`complaint:update`, `location:update`, etc.) to refresh data and staff location.
-   **Info Cards**: Displays complaint location, assigned staff, current status, and last GPS update timestamp.
-   **Map Integration**: Renders a `ComplaintTrackingMap` with the complaint location and, when available, the assigned staff's live location.
-   **Navigation**: Provides a link to the full complaint record page.
