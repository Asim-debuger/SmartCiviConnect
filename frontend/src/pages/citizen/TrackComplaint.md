This file provides a simple entry point for tracking complaints, listing all user complaints with links to their live tracking pages.

-   **Complaint Listing**: Fetches the user's complaints and renders each as a card showing the title, complaint ID, and status.
-   **Tracking Links**: Each card links to `/citizen/tracking/:id` for the live tracking view.
-   **Error and Loading States**: Displays loading and error messages during data fetch.
