This file defines a React Context, `AppUserContext`, which provides application-specific user details derived from the more general `AuthContext`.

-   **Functionality**: It simplifies access to role-based information by computing it once and providing it to any component that needs it.
-   **`AppUserProvider`**:
    -   This provider component wraps parts of the application that need access to detailed user information.
    -   It consumes the `AuthContext` to get the basic `user` object and `loading` state.
    -   It uses the `useMemo` hook to calculate derived user properties only when the user data changes.
-   **Provided Values**:
    -   `profile`: The raw user object.
    -   `role`: The user's role (e.g., "Citizen", "officer").
    -   `dashboard`: The correct URL path to the user's specific dashboard (e.g., `/staff/dashboard`).
    -   `portal`: A user-friendly name for the user's portal (e.g., "Staff Portal").
    -   `displayRole`: A formatted, display-friendly version of the user's role (e.g., "Head Officer").
-   **`useAppUser` Hook**: A custom hook that provides an easy way for components to consume this context.