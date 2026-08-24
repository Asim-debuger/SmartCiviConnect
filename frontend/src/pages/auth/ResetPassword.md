This file provides the password reset form that consumes a token from the URL to set a new password.

-   **Token Consumption**: Reads the `token` route parameter via `useParams`.
-   **Form Submission**: Submits the new password (minlength 8) and token to the `/auth/reset-password` endpoint.
-   **Feedback UI**: Displays success or error messages returned by the server, and manages a `submitting` state.
-   **Navigation**: Includes a link to the login page after submission.
