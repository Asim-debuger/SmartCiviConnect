Provides platform-level administration: departments, analytics, and audit logs.

- `listDepartments` — Ensures default departments exist and returns all departments sorted by name.
- `createDepartment` — Admin/Super Admin creates a department (name required); writes an audit entry; 400 if name missing.
- `updateDepartment` — Admin/Super Admin updates name/description/categories/active/head officer/officers; promoting a head officer also updates that user's role and department.
- `assignOfficer` — Assigns an Officer/Head Officer to a department (admin/head officer), setting their department and adding them to the department's officer list.
- `analytics` — Returns complaint analytics (by status/category/department/month, worker performance, completion rate) and workforce counts, scoped to a Head Officer's department.
- `listAuditLogs` — Admin/Super Admin only: returns the latest 200 audit log entries.
