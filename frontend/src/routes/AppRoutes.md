# AppRoutes.jsx

Declares the full client-side route tree for the SmartciviConnect application using React Router v6 with lazy loading and layout nesting.

- **Lazy loading**
  - All page components are loaded via `React.lazy` and wrapped in a single top-level `Suspense` with a `RouteFallback` loading placeholder.
- **Route structure**
  - Public routes under `PublicLayout` — home, about, services, contact, how-it-works, faq, public jobs/professionals/feed, legal pages, and a catch-all `NotFound`.
  - Auth routes — login, register, forgot-password, reset-password, profile, and auth redirect (protected).
  - Citizen portal — guarded by `ProtectedRoute` + `RoleRoute allowedRoles={["CITIZEN"]}` with `CitizenLayout`; includes dashboard, complaint CRUD, tracking, notifications, network, feed, jobs, inbox, and professional profile.
  - Admin portal — guarded for `ADMIN` / `SUPER_ADMIN` with `AdminLayout`; includes dashboard, complaint/user/role/department/officer/staff/payment/job management, analytics, network, feed, inbox, and notifications.
  - Super-admin portal — guarded for `SUPER_ADMIN` only; dashboard route.
  - Officer / Head Officer portal — guarded for `OFFICER` / `HEAD_OFFICER` with `OfficerLayout`; dashboard, assigned complaints, staff, tracking, notifications, network, feed, jobs, inbox, and head-officer-specific routes.
  - Staff portal — guarded for `STAFF` with `StaffLayout`; dashboard, tasks, live tracking, notifications, earnings, network, feed, jobs, inbox, and profile.
- **Guards**
  - Uses `ProtectedRoute` for authentication and `RoleRoute` for role-based access control on every protected segment.
