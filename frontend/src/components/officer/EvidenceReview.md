This file defines a component for an officer to review evidence submitted by a staff member for a completed task.

-   **Functionality**: It serves as a "verification desk" for a specific complaint, displaying all submitted evidence and allowing an officer to approve or reject the work.
-   **Props**:
    -   `complaint`: The complaint object, which includes the `workEvidence` array.
    -   `onApprove`: A callback function to approve the work.
    -   `onReject`: A callback function to reject the evidence.
    -   `busy`: A boolean to disable the action buttons during an API call.
-   **Data Display**:
    -   It shows a summary of the complaint (ID, category, priority) and a link to its location on a map.
    -   It iterates through the `evidence` array, rendering each item as an image or a video.
    -   For each piece of evidence, it displays metadata such as the phase ("before" or "after"), source, capture time, and GPS coordinates. It provides a map link for the evidence's GPS location and highlights if GPS data is missing.
-   **Actions**: It provides "Approve work" and "Reject evidence" buttons that trigger the respective callback functions.