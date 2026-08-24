# constants.js

Centralized application constants for user roles, complaint statuses, categories, and priority levels.

- **USER_ROLES** — enum-like object: `CITIZEN`, `STAFF`, `OFFICER`, `HEAD_OFFICER`, `ADMIN`, `SUPER_ADMIN`.
- **COMPLAINT_STATUS** — enum-like object: `PENDING`, `VERIFIED`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `REJECTED`.
- **COMPLAINT_CATEGORIES** — array of complaint category strings (e.g., `Road Damage`, `Potholes`, `Garbage`, `Drainage Problems`, etc.).
- **PRIORITY_LEVELS** — array: `Low`, `Medium`, `High`, `Critical`.
