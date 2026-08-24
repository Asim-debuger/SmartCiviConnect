This file defines a component that renders a table of all staff members.

-   **Functionality**: It displays a list of field staff, their key metrics, and allows for management actions.
-   **Props**: It receives an array of `staffMembers` and three callback functions: `onView`, `onToggleStatus`, and `onAdd`.
-   **Components**:
    -   The header includes a title and an "Add Staff" button that triggers the `onAdd` callback.
    -   The main structure is an HTML `<table>`.
-   **Columns**: The table shows the staff member's name/email, department, number of assigned tasks, availability, performance percentage, and account status.
-   **Actions**: Each row includes two action buttons:
    -   A "View" button (eye icon) to open a details modal via the `onView` callback.
    -   A "Toggle Status" button (power icon) to activate or deactivate the staff member's account via the `onToggleStatus` callback.