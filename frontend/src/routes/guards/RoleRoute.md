# guards/RoleRoute.jsx

Route guard component that restricts access to users whose role matches an allowed list.

- **Props**
  - `children` — nested route elements.
  - `allowedRoles` — array of role strings (default `[]`).
- **Behavior**
  - While auth `loading` is true, renders `PageSkeleton`.
  - If no user is present, redirects to `/login`.
  - Normalizes the current user role and each allowed role via `normalizeRole`; if none match, renders an "Access Denied" panel showing the current role.
  - Otherwise renders `children`.
- **Dependencies**
  - Consumes `useAuthContext()` and `normalizeRole` from `../../utils/roles`.
