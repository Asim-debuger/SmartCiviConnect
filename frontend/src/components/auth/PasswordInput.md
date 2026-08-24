This file defines a reusable password input component with a visibility toggle.

-   **Functionality**: It renders an `<input>` field specifically for passwords and provides a button to show or hide the password text.
-   **State Management**: It uses the `useState` hook to manage its internal state (`showPassword`) for toggling visibility.
-   **Components**:
    -   An `input` element that switches its `type` between "password" and "text".
    -   A `button` positioned inside the input field that displays an `Eye` or `EyeOff` icon from `lucide-react` to indicate the current visibility state.
-   **Props**: It accepts `value`, `onChange`, and an optional `placeholder` to function as a controlled component.