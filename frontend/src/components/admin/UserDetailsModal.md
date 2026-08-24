This file defines a modal to display detailed information about a specific citizen user.

-   **Functionality**: Provides a read-only view of a citizen's profile and their complaint history.
-   **Props**: It takes a `user` object containing their details and an `onClose` function to close the modal.
-   **Data Display**:
    -   It shows the user's name, email, and phone number.
    -   It displays the total number of complaints the user has filed.
    -   It indicates the user's account status ("Active" or "Inactive").
    -   It lists the user's recent complaints, showing the title, category, and status of each.