This file defines a basic, reusable `Input` component with a label.

-   **Functionality**: It encapsulates a `label` and an `input` field, providing a consistent structure for form inputs.
-   **Props**:
    -   `label`: The text for the input's label.
    -   `type`: The input's HTML type (e.g., 'text', 'email'). Defaults to 'text'.
    -   `placeholder`: The placeholder text for the input.
    -   `value`: The current value of the input (for controlled components).
    -   `onChange`: The function to call when the input's value changes.
    -   `error`: An error message string to display below the input.
-   **Styling**: It includes basic styling for the input and error message.