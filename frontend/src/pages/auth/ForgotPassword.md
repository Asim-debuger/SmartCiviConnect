This file provides the forgot-password form that initiates a password reset flow via email.

-   **Form Inputs**: Collects the user's email address and submits it to the `/auth/forgot-password` endpoint.
-   **API Interaction**: On success, displays a confirmation message returned by the server; on failure, shows an error message.
-   **Submission State**: Manages a `submitting` flag to disable the button and show a "Sending..." indicator.
-   **Navigation**: Includes a link back to the login page.
