In-app notification service that persists notifications to MongoDB, pushes them over Socket.IO, and optionally sends email copies.

- `createNotification({ userId, type, title, message, link, category, complaintId, email }, io)` — Creates a `Notification` document, emits a `notification:new` event to the user's Socket.IO room (`user:<id>`), and sends an email copy if `email` is true and the user has an email on file. Auto-infers `category` from `type` when not supplied.
- `notifyRoles(roles, payload, io)` — Delivers the same notification payload to every active user in the given roles.
- `notifyMany(userIds, payload, io)` — Delivers the same notification payload to a de-duplicated list of user IDs.
- `inferCategory(type)` — Maps notification types (assignment, task, payment, etc.) to high-level categories for filtering/grouping.
