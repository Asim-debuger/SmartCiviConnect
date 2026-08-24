This file defines the shared application shell layout used by role-based workspaces.

- **Functionality**: Provides a responsive two-pane shell with a collapsible sidebar, a top header, and an `Outlet` for nested routes.
- **Props**: `sidebar` (ReactNode) – rendered inside the sidebar pane; `label` (string) – workspace label shown in the header; `tone` (string, default `"emerald"`) – controls accent colors (`"blue"`, `"violet"`, `"emerald"`).
- **State**: `open` (boolean) controls mobile sidebar visibility with a backdrop overlay on small screens.
- **Header**: Contains a mobile hamburger/menu button, the `label`, a colored status dot, an "Online" status text, and the `NotificationBell` component.
- **Layout behavior**: Sidebar is fixed/off-canvas on mobile and static on `lg` breakpoint; main content is centered in a `max-w-[1440px]` container with padded overflow scrolling.
