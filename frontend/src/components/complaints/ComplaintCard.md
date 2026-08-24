This file defines a card component to display a summary of a single complaint.

-   **Functionality**: It presents the key details of a complaint in a visually organized card format, typically for use in a list.
-   **Data Display**:
    -   Shows the complaint's `title` and `description`.
    -   Displays the current `status` as a colored badge.
    -   Shows the `location` and creation `date` with icons.
-   **Navigation**: It includes a "View Details" link that uses `react-router-dom`'s `Link` component to navigate to the detailed page for that specific complaint.