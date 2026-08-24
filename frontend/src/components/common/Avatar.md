This file defines a reusable `Avatar` component that displays a user's profile image or their initials.

-   **Functionality**: It intelligently decides whether to show an image or a fallback with initials.
-   **Props**:
    -   `name` (string): The user's name, used to generate initials if no image is available.
    -   `src` (string): The URL of the profile image.
    -   `size` (string): The size of the avatar ('sm', 'md', 'lg'). Defaults to 'md'.
    -   `className` (string): Additional CSS classes for custom styling.
-   **Logic**:
    -   If a valid `src` is provided (and it's not a default Clerk asset), it renders an `<img>` tag.
    -   If the `src` is missing or invalid, it renders a `<div>` with a background color, displaying the user's initials.
-   **Helpers**:
    -   `safeProfileImage(url)`: Prevents the use of default Clerk placeholder images.
    -   `initialsFromName(name)`: Extracts the first letter of the first two parts of a name to create initials (e.g., "John Doe" -> "JD").