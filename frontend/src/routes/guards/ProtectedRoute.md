# guards/ProtectedRoute.jsx

Route guard component that restricts access to authenticated users only.

- **Behavior**
  - While auth `loading` is true, renders `PageSkeleton`.
  - If the user is not authenticated, redirects to `/login` via `Navigate`.
  - Otherwise renders `children`.
- **Dependencies**
  - Consumes `useAuthContext()` for `isAuthenticated` and `loading`.
