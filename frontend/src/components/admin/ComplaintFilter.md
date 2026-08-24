This file defines a UI component that provides filtering options for a list of complaints.

-   **Functionality**: It allows an admin to filter complaints by a search term, status, or category.
-   **Components**:
    -   An `input` field for text-based search by complaint ID or title.
    -   A `select` dropdown to filter complaints by their status (e.g., "Pending", "Verified", "In Progress").
    -   A `select` dropdown to filter complaints by their category (e.g., "Road Damage", "Garbage").
-   **State Management**: This is a controlled component. It receives the current filter values (`search`, `status`, `category`) and their corresponding setter functions (`setSearch`, `setStatus`, `setCategory`) as props from its parent component.