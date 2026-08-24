The officer's workforce directory for browsing available field staff by skill and availability.

**Page purpose**
- Lists workers the officer can assign to complaints, filterable by skill and availability.

**Data fetched**
- `listWorkers({ skill, availability })` reloads whenever filters change.

**State**
- `workers`, `skill`, `availability` (All/Available/Busy/Off Duty), `error`.

**Display**
- Each worker card shows name, availability badge, email, skills, and internal id (`_id`).

**Role-specific behavior**
- Helper page for the assignment flow in `AssignedComplaints`; no assignment action here (selection happens there).
