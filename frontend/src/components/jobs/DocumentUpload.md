This file defines a component for uploading a single supporting document.

-   **Functionality**: It provides a UI for a user to select a document (PDF, DOC, DOCX), upload it, and attach it to a parent form or entity.
-   **State Management**: It uses `useState` to manage its internal state, including `busy` (while uploading), `error` (for upload failures), and `pending` (the file selected by the user).
-   **API Interaction**:
    -   It calls the `uploadResume` function from `uploadApi` to handle the file upload process.
    -   On successful upload, it triggers the `onUploaded` callback prop, passing along the public ID, file name, and other metadata of the uploaded document.
-   **UI**: It displays a file input. Once a file is selected, it shows the file name and provides "Attach file" and "Remove" buttons. It also displays loading and error messages to the user.