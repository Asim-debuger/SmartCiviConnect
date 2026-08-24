The staff notifications page, rendering the shared notification inbox with an emerald accent.

**Page purpose**
- Wraps the reusable `NotificationInbox` component scoped to staff notifications.

**Implementation**
- Renders `<NotificationInbox accent="emerald" />`; contains no page-specific state or data fetching of its own.

**Child components**
- `NotificationInbox` (common) — handles loading, listing, and marking notifications read.
