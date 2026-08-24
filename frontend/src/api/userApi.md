This file centralizes all API interactions related to user management, authentication, and profiles.

-   **Authentication**:
    -   `login(credentials)`: Authenticates a user.
    -   `register(payload)`: Registers a new user.
    -   `logout()`: Logs out the current user.

-   **Current User Management**:
    -   `getCurrentUser()`: Fetches the profile of the currently logged-in user.
    -   `updateCurrentUser(profileData)`: Updates the current user's profile information.
    -   `getMyResume(download)`: Fetches the current user's resume file.
    -   `getMyPaymentProfile()`: Retrieves the payment profile for the current user.
    -   `updateMyPaymentProfile(payload)`: Updates the current user's payment profile.

-   **General User Management (Admin)**:
    -   `listUsers(filters)`: Fetches a list of users, with optional filters.
    -   `updateUser(userId, updateData)`: Updates a specific user's role.
    -   `getUserPaymentProfile(userId)`: Retrieves the payment profile for a specific user.
    -   `updateUserPaymentProfile(userId, payload)`: Updates a specific user's payment profile.