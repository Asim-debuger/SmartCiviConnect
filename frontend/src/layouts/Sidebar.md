This file defines a generic sidebar navigation component used by multiple roles.

- **Functionality**: Renders a left sidebar with a brand header, navigation links, and a logout button at the bottom.
- **Context**: Reads the authenticated user from `AuthContext` to show the user's name and role label.
- **Menu items**: Dashboard (`/citizen/dashboard`), Create Complaint (`/citizen/create`), My Complaints (`/citizen/complaints`), Notifications (`/citizen/notifications`), Profile (`/profile`).
- **Routing**: Each item is a `NavLink` with conditional `isActive` styling (active = blue background/white text).
- **Layout**: Fixed-width sidebar (`w-64`) with brand header, scrollable nav, and an absolutely positioned bottom section showing the user name and logout action.
