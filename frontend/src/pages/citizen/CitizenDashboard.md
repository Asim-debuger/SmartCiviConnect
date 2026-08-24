This file renders the citizen-facing dashboard with an overview of complaints, stats, and quick actions.

-   **Hero Section**: Greets the user by first name and provides quick links to report an issue, track progress, network, jobs, and messages.
-   **Stats Cards**: Displays computed counts for total, pending, active, and completed complaints using `useMemo`.
-   **Recent Reports**: Lists the three most recent complaints with status badges and links to full details.
-   **Activity Feed**: Shows the latest notifications fetched alongside complaints.
-   **Data Loading**: Loads complaints and notifications in parallel via `getMyComplaints` and `listNotifications`, with an offline/retry state.
-   **Navigation**: Includes links to the full complaints list and individual complaint records.
