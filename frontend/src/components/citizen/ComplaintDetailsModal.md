This file defines a modal component to display the full details of a single complaint.

-   **Functionality**: It provides a comprehensive view of a complaint's information, progress, and allows for user feedback upon completion.
-   **Data Display**:
    -   Shows primary details like Complaint ID, title, category, priority, location, and creation date using a reusable `InfoCard` component.
    -   Displays the full description and the name of the assigned officer.
    -   Renders any submitted media (images/evidence).
-   **Components**: It embeds a `ComplaintTimeline` component to visually track the complaint's status from submission to completion.
-   **Feedback System**:
    -   When a complaint's status is "Completed", it reveals a feedback section.
    -   This section includes a 5-star rating system and a textarea for written comments.
    -   Submitting the feedback calls the `onSubmitFeedback` prop with the complaint ID, rating, and feedback text.