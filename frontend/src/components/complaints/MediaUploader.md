This file defines a component for uploading media files.

-   **Functionality**: It provides a user interface for selecting multiple image and video files.
-   **Props**: It is a controlled component that receives `files` (an array of selected files) and `setFiles` (a function to update the files) as props.
-   **UI**:
    -   It features a large, clickable area with an "Upload Cloud" icon to open the file selector.
    -   After files are selected, it lists each file's name with a "Remove" button (`X` icon) next to it.