This file defines a `NotificationBell` component, which is a dropdown menu for showing recent notifications.

-   **Functionality**: It displays a bell icon with an unread count badge. Clicking the bell opens a dropdown list of recent notifications.
-   **State Management**:
    -   Manages the dropdown's open/closed state.
    -   Fetches and stores a list of notifications and the total unread count.
-   **Real-time Updates**: It uses a `useSocket` hook to listen for `notification:new` events and updates the list and unread count in real-time.
-   **Actions**:
    -   Users can click a notification to navigate to its associated link (e.g., a complaint or post). This also marks the notification as read.
    -   Users can delete a notification.
    -   A "Mark all as read" button is available.
    -   A link to the full notification center page is provided at the bottom.
-   **Positioning**: It uses `useLayoutEffect` and `createPortal` to intelligently position the dropdown below the bell icon, ensuring it stays within the viewport.