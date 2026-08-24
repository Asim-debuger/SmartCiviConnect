This file renders the authenticated user's profile page with account details and settings forms.

-   **User Information Display**: Shows the user's name, email, username, role, and portal in a read-only section.
-   **Resume Upload**: Conditionally renders a `ResumeUpload` component for citizen, staff, officer, and head officer roles.
-   **Payment Profile**: Conditionally renders a `PaymentProfileForm` for workforce roles (staff, officer, head officer), loading and saving payment profile data via `getMyPaymentProfile` and `updateMyPaymentProfile`.
-   **Change Password Form**: Submits the current and new password to `/auth/change-password`, updates the auth context on success, and validates the new password with a minlength of 8 characters.
-   **Layout**: Wraps content with `PublicNavbar` and `PublicFooter`, and includes a link to the user's role-based dashboard.
