This file defines the citizen sidebar navigation component.

- **Functionality**: Renders a vertical navigation menu tailored for citizen users with icon links, active-state highlighting, a user profile card, and a logout button.
- **State / Context**: Reads the authenticated user from `AuthContext` to display the first name and username/role.
- **Menu items**: Overview, Report an issue, My complaints, Live tracking, Notifications, Network, Feed, Saved, Jobs, Messages, Profile.
- **Routing**: Each item is a `NavLink` with conditional `isActive` styling (active = emerald background/white text with shadow).
- **Layout**: Fixed-width sidebar (`w-72`) with branded header, section label ("Workspace"), scrollable nav, and a bottom profile card showing an `Avatar`, display name, username, and logout action.
