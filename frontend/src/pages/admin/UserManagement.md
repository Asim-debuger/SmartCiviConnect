Enables admins to search users, assign roles and departments, and activate or deactivate accounts.

- **Data fetched**: Calls `listUsers` (with search and role filters) and `listDepartments` on mount or when filters change.
- **State**: Tracks `users`, `departments`, `search`, `role`, `error`, and `saving` state per user.
- **Filtering**: Supports filtering users by search text (name/email) and role (Citizen, Staff, Officer, Head Officer, Admin, Super Admin).
- **Actions**: Allows changing user roles, assigning departments, and toggling active/inactive status via `updateUser`.
- **Counts**: Displays active user count and total loaded users.
- **API calls**: `listUsers`, `updateUser`, `listDepartments`.
