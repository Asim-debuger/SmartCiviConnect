This file defines a component that renders a table of complaints for an administrative view.

-   **Functionality**: Displays a list of complaints with key details and provides actions for each.
-   **Props**: It receives an array of `complaints` to display, along with `onView` and `onAssign` callback functions for handling actions.
-   **Components**:
    -   A standard HTML `<table>` to structure the data.
    -   It uses a custom `ComplaintStatus` component to render a visually distinct status badge for each complaint.
-   **Columns**: The table displays the Complaint ID, Title, Description (truncated), Category, Priority, and Status.
-   **Actions**: Each row has two action buttons:
    -   A "View" button (eye icon) that triggers the `onView` callback.
    -   An "Assign Officer" button (user-plus icon) that triggers the `onAssign` callback.