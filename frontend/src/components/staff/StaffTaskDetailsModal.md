This file defines a modal for a staff member to view and manage an assigned task.

-   **Functionality**: It provides a detailed view of a task and allows the staff member to accept it, update its progress, add notes, capture evidence, and mark it as complete.
-   **Props**: It takes a `task` object and several callback functions (`onClose`, `onAcceptTask`, `onUpdateProgress`, `onCompleteTask`).
-   **Workflow by Status**:
    -   **Assigned**: Displays an "Accept Task" button to change the status to "In Progress".
    -   **In Progress**: Shows a comprehensive work section where the user can:
        -   Update a completion percentage with a slider.
        -   Add written `workNotes` in a textarea.
        -   Use the `FieldEvidenceCapture` component to submit "before" and "after" evidence with GPS and timestamps.
        -   Save progress or mark the task as complete. A validation check ensures camera evidence is captured before completion.
    -   **Completed**: Shows a confirmation message.
-   **Data Display**: It uses reusable `InfoCard` components to show key task details like category, priority, location, and who assigned it.