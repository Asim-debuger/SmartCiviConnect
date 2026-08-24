This file acts as an authentication routing guard that redirects users to the appropriate destination after the auth state is resolved.

-   **Role-Based Redirect**: Once authentication is confirmed and loading completes, the user is redirected to their role-specific dashboard using `dashboardPath`.
-   **Unauthenticated Redirect**: If the user is not authenticated, they are redirected to `/login`.
-   **Loading State**: Shows a "Preparing your workspace..." message while the auth context is still resolving.
