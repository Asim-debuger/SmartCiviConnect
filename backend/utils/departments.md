Maps civic complaint categories to departments and provides default department seed data.

- `CATEGORY_DEPARTMENT` - Object mapping complaint categories (e.g., `Road Damage`, `Garbage`) to department names.
- `DEFAULT_DEPARTMENTS` - Array of default department objects with `name`, `description`, and `categories`.
- `departmentForCategory(category)` - Returns the department name for a given complaint category; defaults to `Public Safety`.
