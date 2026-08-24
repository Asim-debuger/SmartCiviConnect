This file provides a modal for previewing documents and a custom hook (`useSignedFile`) to manage the process of fetching and displaying protected files.

-   **`ResumePreview` Component**:
    -   **Functionality**: Renders a modal to display a document. It intelligently handles different file types.
    -   **Logic**: If the file is a PDF, it's displayed in an `<iframe>`. For other types (like Word documents), it shows a message explaining that a preview is not available and provides a download link. This enhances security by not exposing the file to third-party viewers.
-   **`useSignedFile` Custom Hook**:
    -   **Functionality**: Encapsulates the entire logic for securely accessing and displaying a file.
    -   **Returns**: An `openSigned` function and the `modal` JSX.
    -   **`openSigned(loader, options) `**: This function takes a loader function (an API call that fetches the file) and options (e.g., `{ download: true }`). It handles fetching the file, creating a temporary blob URL, and then either showing the preview modal or triggering a direct download.
    -   **Memory Management**: It correctly uses `revokeFileUrl` to clean up blob URLs after they are used, preventing memory leaks.