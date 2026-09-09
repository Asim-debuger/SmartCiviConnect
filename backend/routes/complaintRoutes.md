# complaintRoutes

Complaint lifecycle management for citizens and admin/officer staff.

## Endpoints

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| POST | / | createComplaint | authenticateUser + Citizen |
| GET | /my | getMyComplaints | authenticateUser + Citizen |
| GET | /suggest | suggest | authenticateUser |
| GET | /:id | getComplaintById | authenticateUser |
| PUT | /:id | updateComplaint | authenticateUser + Citizen |
| PATCH | /:id/status | changeStatus | authenticateUser + Admin, Super Admin, Head Officer |
