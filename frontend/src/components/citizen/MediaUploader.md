This file defines a component for uploading various types of media files as evidence for a complaint.

-   **Functionality**: It allows a user to select and preview images, videos, and documents from their device.
-   **File Handling**:
    -   It manages separate state arrays for `images`, `videos`, and `documents`.
    -   It provides distinct upload areas for each media type (images, video, documents).
-   **Validation**: It performs client-side validation on file sizes, enforcing maximum limits (8MB for images, 40MB for videos, 10MB for documents) and displays an error message if a file is too large.
-   **User Interface**:
    -   It displays thumbnail previews for selected images and a video player for the selected video.
    -   It lists the names of selected documents.
    -   Users can remove any selected file.
-   **Data Flow**: Whenever the file selection changes, it calls the `onMediaChange` prop, passing an object containing the arrays of selected images, videos, and documents.