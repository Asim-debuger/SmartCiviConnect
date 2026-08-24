This file defines a modal component for adding a new officer to the system.

-   **Functionality**: It provides a form for administrators to create a new officer profile.
-   **Components**:
    -   A form with input fields for the officer's full name, email, and phone number.
    -   A dropdown menu to assign the officer to a specific department from a predefined list.
    -   A dropdown to set the initial account status (`Active` or `Inactive`).
-   **State Management**: It uses the `useState` hook to manage form data and validation errors.
-   **Validation**: Includes a `validateForm` function that checks for required fields (name, email, phone, department) before submission.
-   **Actions**: On successful submission, it calls the `onAddOfficer` prop with the form data. It also has a "Cancel" button and an "X" icon to close the modal via the `onClose` prop.