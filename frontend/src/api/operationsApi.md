This file defines API functions for operational tasks, primarily used by admins, officers, and staff to manage complaints and workers.

-   **Admin/Officer Functions**:
    -   `getAdminStats()`: Fetches administrative statistics.
    -   `getAdminComplaints(filters)`: Retrieves a list of complaints for administrative review.
    -   `assignComplaint(id, assignment)`: Assigns a complaint to an officer or department.
    -   `getAssignedComplaints()`: Fetches complaints assigned to the current officer.
    -   `acceptOfficerComplaint(id)`: Allows an officer to accept a complaint assignment.
    -   `rejectComplaint(id, note)`: Allows an officer to reject a complaint assignment.
    -   `assignStaffToComplaint(id, staffId)`: Assigns a staff member to a complaint.
    -   `changeComplaintStatus(id, statusData)`: Changes the core status of a complaint.

-   **Task & Evidence Management**:
    -   `updateTask(id, data)`: Updates the details of a task associated with a complaint.
    -   `verifyTask(id)`: Marks a task as verified.
    -   `rejectEvidence(id, note)`: Rejects the evidence submitted for a task.

-   **Communication**:
    -   `sendComplaintMessage(id, data)`: Sends a message related to a specific complaint.
    -   `getComplaintMessages(id)`: Retrieves the message history for a complaint.

-   **Location & Worker Tracking**:
    -   `updateStaffLocation(payload)`: Updates the geographical location of a staff member.
    -   `getLiveLocations(params)`: Fetches the live locations of on-duty staff.
    -   `listWorkers(params)`: Lists available workers/staff members.