This file defines a component that renders a table of all citizen users.

-   **Functionality**: It displays a list of users and allows administrators to manage them.
-   **Props**: It receives an array of `users` and two callback functions: `onView` and `onToggleStatus`.
-   **Components**: The main structure is an HTML `<table>`.
-   **Columns**: The table shows the user's name/ID, email, phone number, total number of complaints filed, and account status.
-   **Actions**: Each row includes two action buttons:
    -   A "View" button (eye icon) to open a details modal via the `onView` callback.
    -   A "Toggle Status" button (lock/unlock icon) to block or activate the user's account via the `onToggleStatus` callback. The icon changes based on the user's current status.