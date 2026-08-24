This file serves as the shared login and registration form, switching behavior based on the `mode` prop.

-   **Dual-Mode Form**: Renders either a login form or a registration form depending on whether `mode` is `"login"` or `"register"`.
    -   Registration mode adds a required `name` field and uses the `/auth/register` endpoint.
    -   Login mode omits the name field and uses the `/auth/login` endpoint.
    -   Both modes include email and password inputs with password minlength validation (8+ chars).

-   **Already Logged In Guard**: If the user is already authenticated, an `AlreadyLoggedIn` panel is shown instead of the form, displaying the user's name, email, role, and current portal, with options to navigate to their dashboard or logout.

-   **API Interaction**: Submits form data via `api.post`, stores the returned data using `loginSuccess`, and redirects to a role-based dashboard or an optional `redirect` query parameter.

-   **Error and Loading State**: Manages submission errors and a `submitting` flag to disable the submit button and show a "Please wait..." state.

-   **Navigation Links**: Provides links between login and registration, preserving the `redirect` query parameter when switching modes, and includes a "Forgot password?" link on the login form.
