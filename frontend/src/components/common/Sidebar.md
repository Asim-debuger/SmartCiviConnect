This file defines the main `Sidebar` component for navigating the application's dashboard sections.

-   **Functionality**: It renders a role-based navigation menu.
-   **Role-Based Navigation**:
    -   It uses the `useAuthContext` to get the current user's role.
    -   It defines different sets of navigation links for "officer", "head officer", and "staff" roles.
    -   The correct set of links is chosen based on the user's role. Special links for "head officer" are added dynamically.
-   **Components**:
    -   It uses `NavLink` from `react-router-dom` for the links, which allows for an "active" style to be applied to the currently viewed page.
    -   Icons from `lucide-react` are used for each navigation item.
-   **Actions**: It includes a "Log out" button at the bottom that calls the `logout` function from the `AuthContext`.