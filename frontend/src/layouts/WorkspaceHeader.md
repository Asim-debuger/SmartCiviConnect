This file defines a reusable workspace header component.

- **Functionality**: Renders a sticky top header bar displaying a workspace label, an online status indicator, and a `NotificationBell`.
- **Props**: `label` (string) – workspace label shown on the left; `tone` (string, default `"emerald"`) – controls the accent color of the status indicator and "Online" text (`"blue"` or `"emerald"`).
- **Layout**: Left section shows the label (hidden on small screens), a colored dot, and an "Online" status; right section contains the notification bell.
