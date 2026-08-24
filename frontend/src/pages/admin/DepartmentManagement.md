Manages civic departments including creation, activation status, officer assignment, and head officer designation.

- **Data fetched**: Calls `listDepartments` and `listUsers` (Officer and Head Officer roles) on mount.
- **State**: Tracks `departments`, `officers`, form data (`name`, `description`), and `error`.
- **Actions**: Create new departments via form submission, assign officers to departments via dropdown, and designate head officers per department.
- **API calls**: `createDepartment`, `listDepartments`, `updateDepartment`, `assignDepartmentOfficer`, `listUsers`.
