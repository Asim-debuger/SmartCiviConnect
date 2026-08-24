This file defines a modal to display detailed information about a specific staff member.

-   **Functionality**: Provides a comprehensive, read-only view of a field staff member's profile and activity.
-   **Props**: It takes a `staff` object with their details and an `onClose` function.
-   **Components**:
    -   It uses a reusable `InfoCard` component to display information like email, phone, department, assigned tasks, performance, and availability.
-   **Data Display**: It shows the staff member's contact info, department, task count, performance, availability status, and a list of their recently assigned tasks with their corresponding IDs and statuses.