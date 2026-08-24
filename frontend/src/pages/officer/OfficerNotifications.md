The officer notifications page, rendering the shared notification inbox with a blue accent.

**Page purpose**
- Wraps the reusable `NotificationInbox` component scoped to officer notifications.

**Implementation**
- Renders `<NotificationInbox accent="blue" />`; contains no page-specific state or data fetching of its own.

**Child components**
- `NotificationInbox` (common) — handles loading, listing, and marking notifications read.
