This file defines a component for managing a user's primary resume on their profile.

-   **Functionality**: It allows a user to upload a new resume or view/download their existing one.
-   **State Management**: It uses `useState` to manage `busy`, `error`, and `pending` (the file to be uploaded) states. It also uses the `useAuthContext` to get the current user's resume status and update it.
-   **API Interaction**:
    -   It calls `uploadResume` from `uploadApi` to upload a new file.
    -   It calls `updateCurrentUser` from `userApi` to associate the new resume with the user's profile.
    -   It uses the `useSignedFile` hook to securely call `getMyResume` for viewing or downloading the existing resume.
-   **UI**:
    -   If a resume exists, it displays the file name, upload date, and provides "View" and "Download" buttons.
    -   It provides a file input to select a new resume. When a file is pending, it shows options to "Confirm upload" or "Remove".