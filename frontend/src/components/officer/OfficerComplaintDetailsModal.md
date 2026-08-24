This file defines a modal component for an officer to view the detailed information of a complaint.

-   **Functionality**: It provides a comprehensive, read-only view of a complaint and serves as the entry point for assigning staff.
-   **Props**:
    -   `complaint`: The complaint object to display.
    -   `onClose`: A function to close the modal.
    -   `onAssignStaff`: A callback function that is triggered when the "Assign Staff" button is clicked.
-   **Data Display**:
    -   It shows the complaint's ID, title, category, priority, location, and the currently assigned staff member using reusable `InfoCard` components.
    -   It displays the full description of the complaint and its current status.
-   **Actions**: It contains a primary action button that reads "Assign Staff" or "Reassign Staff" depending on whether a staff member is already assigned. Clicking this button triggers the `onAssignStaff` callback.