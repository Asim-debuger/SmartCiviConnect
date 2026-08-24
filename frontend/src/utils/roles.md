# roles.js

Utilities for normalizing, displaying, and routing based on user roles.

- **normalizeRole(role)**
  - Lowercases, trims, replaces `_`/`-` with spaces, and collapses whitespace.
- **displayRole(role)**
  - Maps normalized role to a human-readable label (`"Citizen"`, `"Staff"`, `"Officer"`, `"Head Officer"`, `"Admin"`, `"Super Admin"`); defaults to `"Citizen"`.
- **portalLabel(role)**
  - Returns the portal name string (`"Citizen Portal"`, etc.) based on role.
- **dashboardPath(role)**
  - Returns the root dashboard route for a role (e.g., `/admin/dashboard`, `/officer/dashboard`, `/staff/dashboard`, `/citizen/dashboard`).
- **reportIssuePath(role)**
  - Returns `/citizen/create` for citizens, otherwise the role's `dashboardPath`.
