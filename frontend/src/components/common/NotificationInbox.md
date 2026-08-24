This file defines the `NotificationInbox` component, which serves as a full-page notification center.

-   **Functionality**: It displays a comprehensive list of all user notifications, with options for filtering by category.
-   **State Management**:
    -   Fetches and stores notifications from the `notificationApi`.
    -   Manages loading and error states.
    -   Keeps track of the currently selected filter tab (`all`, `complaint`, `job`, etc.).
-   **Filtering**: It renders a list of tabs that allow the user to filter notifications by category. The available tabs are dynamically adjusted based on the user's role.
-   **Real-time Updates**: It uses a `useSocket` hook to listen for `notification:new` events, prepending new notifications to the list in real-time.
-   **Actions**:
    -   Users can mark all notifications as read.
    -   Users can mark individual notifications as read.
    -   Users can delete notifications.
    -   Each notification has a link to the relevant page (e.g., a specific complaint, job application, or user profile).