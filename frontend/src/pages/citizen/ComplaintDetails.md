This file renders a detailed view of a single complaint, including timeline, evidence, and feedback capabilities.

-   **Complaint Loading**: Fetches a complaint by ID via `getComplaintById` and listens for real-time updates through a WebSocket (`useSocket`), reacting to `complaint:update`, `complaint:updated`, `location:update`, and `location:updated` events.
-   **Information Sections**: Displays category, priority, submission date, description, reported location with map link, submitted media (images/videos), assigned officer/staff details, and latest update timestamp.
-   **Live Staff Location**: Shows assigned staff GPS coordinates and a Google Maps link when location sharing is enabled.
-   **Progress Timeline**: Renders a 5-step timeline based on `COMPLAINT_TIMELINE_STEPS` and lists historical status changes.
-   **Verification States**: Hides completion proof until the status is `Completed` with `verifiedAt`, then shows verified evidence with capture timestamps and coordinates.
-   **Feedback Form**: After verification, allows the citizen to rate work quality, resolution satisfaction, and staff behavior (1-5 stars), plus submit a text feedback via `updateComplaint`.
