This file defines the admin sidebar navigation component.

- **Functionality**: Renders a vertical navigation menu for admin and super-admin users with icon links, active-state highlighting, and a logout button.
- **State / Context**: Reads the authenticated user from `AuthContext` and checks `normalizeRole(user?.role)` to determine whether the user is a super admin.
- **Menu items**: Dashboard, Complaints, Users & roles, Departments, Officers, Staff, Payments, Jobs, Network, Feed, Saved, Messages, Notifications, Profile, Analytics, Reports; super admins also see a "System control" entry injected at index 1.
- **Routing**: Each item is a `NavLink` with conditional `isActive` styling (active = blue background/white text).
- **Layout**: Fixed-width sidebar (`w-72`) with scrollable nav and a bottom logout action.
