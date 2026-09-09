# operationsRoutes

Administrative and operational workflows for complaint assignment, task tracking, staff management, and live location updates.

## Admin

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /admin/complaints | listComplaints | authenticateUser + Admin, Super Admin, Head Officer |
| GET | /admin/stats | dashboardStats | authenticateUser + Admin, Super Admin, Head Officer |
| PATCH | /admin/complaints/:id/assign | assignComplaint | authenticateUser + Admin, Super Admin, Head Officer |

## Officer

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /assigned | listAssigned | authenticateUser + Officer, Head Officer, Staff |
| GET | /workers | listWorkers | authenticateUser + Officer, Head Officer, Admin, Super Admin |
| GET | /department/overview | departmentOverview | authenticateUser + Head Officer, Admin, Super Admin |
| POST | /officer/complaints/:id/accept | acceptComplaint | authenticateUser + Officer, Head Officer |
| PATCH | /officer/complaints/:id/staff | assignStaff | authenticateUser + Officer, Head Officer, Admin, Super Admin |
| POST | /officer/complaints/:id/reject | rejectComplaint | authenticateUser + Officer, Head Officer, Admin, Super Admin |

## Tasks

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| PATCH | /tasks/:id | updateTask | authenticateUser + Officer, Head Officer, Staff, Admin, Super Admin |
| POST | /tasks/:id/verify | verifyTask | authenticateUser + Admin, Super Admin, Head Officer, Officer |
| POST | /tasks/:id/reject-evidence | rejectEvidence | authenticateUser + Admin, Super Admin, Head Officer, Officer |

## Messages

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /complaints/:id/messages | listMessages | authenticateUser |
| POST | /complaints/:id/messages | sendMessage | authenticateUser |

## Location

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| POST | /location | updateLocation | authenticateUser + Staff |
| GET | /locations | listLiveLocations | authenticateUser |
