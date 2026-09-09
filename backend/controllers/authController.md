Implements JWT-based registration, login, token refresh, logout, and password management, issuing httpOnly refresh cookies and signed access tokens.

- `register` — Validates name/email/password, rejects duplicates, creates a `Citizen` user with a unique username, issues a refresh cookie, sends a welcome email, and returns a 201 with an access token and safe user profile.
- `login` — Verifies email/password, rejects deactivated accounts, ensures a username exists, issues a refresh cookie, and returns an access token and user profile.
- `refresh` — Verifies the refresh cookie, rotates it (invalidating the old token hash), re-issues a new refresh cookie and access token; clears the cookie on invalid/expired tokens.
- `logout` — Removes the refresh token hash from the user and clears the refresh cookie.
- `getCurrentUser` — Ensures the username exists and returns the authenticated user's safe profile.
- `forgotPassword` — For a registered active email, generates a reset token, stores its hash, and emails a reset link; always returns a generic success message (no user enumeration).
- `resetPassword` — Validates the reset token/hash, updates the password, clears reset data and all refresh tokens; returns 400 for invalid/expired tokens.
- `changePassword` — Verifies the current password, updates the password, clears all refresh tokens, re-issues a refresh cookie, and returns a new access token.
