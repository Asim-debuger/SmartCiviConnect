This file defines a utility component that automatically scrolls the window to the top whenever the user navigates to a new page.

-   **Functionality**: It ensures a consistent user experience by preventing the scroll position from being maintained when changing routes.
-   **Hooks**:
    -   It uses the `useLocation` hook from `react-router-dom` to get the current `pathname`.
    -   It uses the `useEffect` hook to trigger an action whenever the `pathname` changes.
-   **Logic**: When the `useEffect` hook is triggered by a route change, it calls `window.scrollTo({ top: 0, behavior: "smooth" })`, which smoothly scrolls the viewport to the top of the page.
-   **Rendering**: The component returns `null`, as it has no visual output and only exists to perform a side effect.