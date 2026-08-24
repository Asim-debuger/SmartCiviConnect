This file provides simple, reusable skeleton loading components.

-   **`Skeleton` Component**:
    -   **Functionality**: Renders a basic gray, pulsing placeholder box.
    -   **Props**: `className` for custom sizing and styling.
-   **`PageSkeleton` Component**:
    -   **Functionality**: Provides a pre-composed layout of several `Skeleton` components to represent a typical page structure (title, stat cards, main content block) while data is loading.
-   **`EmptyState` Component**:
    -   **Functionality**: Renders a message for when a list or content area is empty.
    -   **Props**: `title`, `body`, and an `action` (which can be a button or other JSX) to prompt the user.