This file defines a modal to display detailed information about a specific officer.

-   **Functionality**: Provides a comprehensive, read-only view of an officer's profile and activity.
-   **Props**: It takes an `officer` object containing all the details to display and an `onClose` function to close the modal.
-   **Components**:
    -   It uses a reusable `InfoCard` component to display individual pieces of information like email, phone, department, workload, and performance, each with an associated icon.
    -   The officer's name and initial are displayed prominently in the header.
-   **Data Display**: It shows the officer's contact details, department, active workload, performance percentage, account status, and a list of recently assigned complaints.