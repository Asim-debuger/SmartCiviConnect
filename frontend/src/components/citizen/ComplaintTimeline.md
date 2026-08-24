This file defines a component that renders a vertical timeline to visualize the progress of a complaint.

-   **Functionality**: It shows the different stages a complaint goes through, from "Pending" to "Completed".
-   **State Visualization**:
    -   It uses the `currentIndex` prop to determine the current stage of the complaint.
    -   Completed steps are styled in green, the current step is styled in blue, and future steps are neutral.
    -   It uses icons from `lucide-react` to represent each stage.
-   **Special Cases**: It handles a `rejected` state separately, displaying a distinct "Complaint rejected" message instead of the standard timeline.
-   **Logic**: The mapping from a complaint's status string (e.g., "In Progress") to its numerical index on the timeline is handled by the `complaintTimelineIndex` utility function.