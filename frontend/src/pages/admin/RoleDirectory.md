Displays a reusable directory of users by role with activation and deactivation controls.

- **Props**: Accepts `role`, `title`, and `subtitle` for dynamic rendering.
- **Data fetched**: Calls `listUsers` filtered by the provided role on mount.
- **State**: Tracks `users` and `error`.
- **Actions**: Allows activating or deactivating user accounts via `updateUser`.
- **Empty state**: Shows a message prompting admins to promote users from User & role management when no accounts exist.
