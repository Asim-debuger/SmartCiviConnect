Generates and ensures unique usernames for users.

- `slugifyName(name)` - Converts a name to an 18-character lowercase alphanumeric slug, defaulting to `member`.
- `uniqueUsername(name)` - Attempts up to 12 random suffix variants of the slug to find a unique username; falls back to a timestamp suffix if needed.
- `ensureUsername(user)` - Assigns a unique username to a user if missing, saves the user, and returns the updated user.
