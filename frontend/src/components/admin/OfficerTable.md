This file defines a component that renders a table of all officers.

-   **Functionality**: It displays a list of officers, their key metrics, and allows for management actions.
-   **Props**: It receives an array of `officers` and three callback functions: `onView`, `onToggleStatus`, and `onAdd`.
-   **Components**:
    -   The main structure is an HTML `<table>`.
    -   The header includes a title and an "Add Officer" button that triggers the `onAdd` callback.
-   **Columns**: The table shows the officer's name/email, department, number of assigned complaints, performance percentage, and account status.
-   **Actions**: Each row includes two action buttons:
    -   A "View" button (eye icon) to open a details modal via the `onView` callback.
    -   A "Toggle Status" button (power icon) to activate or deactivate the officer's account via the `onToggleStatus` callback.