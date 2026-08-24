This file defines a highly reusable and themeable `Button` component.

-   **Functionality**: It provides a consistent button element that can be styled with different variants and sizes.
-   **Props**:
    -   `children`: The content inside the button.
    -   `type`: The button's HTML type (e.g., 'button', 'submit'). Defaults to 'button'.
    -   `variant`: The visual style ('primary', 'secondary', 'outline', 'danger', 'success'). Defaults to 'primary'.
    -   `size`: The button's size ('sm', 'md', 'lg'). Defaults to 'md'.
    -   `className`: Additional CSS classes for custom styling.
    -   `disabled`: A boolean to disable the button.
    -   `onClick`: The function to call when the button is clicked.
-   **Styling**: It combines base styles with specific styles for each variant and size, making it easy to maintain a consistent design system.