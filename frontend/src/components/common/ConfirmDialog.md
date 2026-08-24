This file provides a custom hook, `useConfirm`, for showing a programmatic confirmation dialog.

-   **Functionality**: It allows any component to trigger a confirmation modal and wait for the user's response (true for confirm, false for cancel) using a `Promise`.
-   **`useConfirm()` Hook**:
    -   **Returns**: An object containing:
        -   `confirm(options)`: A function that, when called, displays the dialog and returns a promise. It accepts `title`, `message`, and `confirmLabel`.
        -   `dialog`: The JSX for the modal, which should be rendered at the top level of the application.
    -   **State**: It manages the dialog's visibility and content internally.
-   **Usage**:
    1.  Call `const { confirm, dialog } = useConfirm()` in your component.
    2.  Render `{dialog}` in your component's return statement.
    3.  Use `if (await confirm({ ... })) { ... }` inside an async event handler to await user confirmation.