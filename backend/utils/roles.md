Role constants and helpers for the SmartciviConnect permission system.

- `ROLES` - Ordered list of valid roles: `Citizen`, `Staff`, `Officer`, `Head Officer`, `Admin`, `Super Admin`.
- `normalizeRole(role)` - Normalizes a role string to lowercase words for comparison.
- `isRole(role, ...allowed)` - Returns true if the normalized role matches any of the allowed roles.
- `dashboardPath(role)` - Returns the root dashboard path for a role (e.g., `/admin/dashboard`, `/citizen/dashboard`).
- `COMPLAINT_STATUSES` - Array of valid complaint statuses.
- `STATUS_TRANSITIONS` - Object defining allowed next statuses for each complaint status.
- `CITIZEN_TIMELINE` - Array of complaint status labels shown to citizens on the timeline.
