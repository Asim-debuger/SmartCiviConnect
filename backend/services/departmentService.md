Department bootstrap and lookup service that seeds default departments and resolves the correct department for a complaint category.

- `ensureDefaultDepartments()` — Upserts all entries from `DEFAULT_DEPARTMENTS` into the `Department` collection on server startup so the department catalogue is always populated.
- `resolveDepartment(category)` — Returns the active `Department` document matching the given complaint category (via `departmentForCategory`). Falls back to a stub object with an empty `officerIds` array when no matching department is found.
