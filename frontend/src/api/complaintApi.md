This file provides a set of functions for interacting with the `/complaints` API endpoint, managing all complaint-related data.

-   **`createComplaint(complaintData)`**: Creates a new complaint by sending a `POST` request to `/complaints`.
-   **`getMyComplaints()`**: Fetches all complaints filed by the currently authenticated user with a `GET` request to `/complaints/my`.
-   **`getComplaintById(id)`**: Retrieves a single complaint by its unique ID via a `GET` request to `/complaints/:id`.
-   **`updateComplaint(id, updateData)`**: Updates an existing complaint (e.g., to add a rating) using a `PUT` request to `/complaints/:id`.
-   **`suggestComplaint(text)`**: Fetches complaint suggestions based on input text by making a `GET` request to `/complaints/suggest`.
-   **`changeComplaintStatus(id, statusData)`**: Allows an admin or officer to change the status of a complaint through a `PATCH` request to `/complaints/:id/status`.