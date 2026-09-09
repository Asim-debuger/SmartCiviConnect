Reads and manages the authenticated user's in-app notifications.

- `listMine` — Returns the caller's notifications (latest 150) with a total unread count; citizens are hidden "payment" category notifications; supports `category` and `unread` filters.
- `markRead` — Marks a single notification as read (only if owned by the caller).
- `markAllRead` — Marks all of the caller's unread notifications as read.
- `remove` — Deletes a single notification owned by the caller.
