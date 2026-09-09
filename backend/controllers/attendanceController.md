Handles attendance check-in/check-out records for the authenticated user using the `Attendance` model.

- `listMine` — Returns the current user's last 60 attendance records (sorted by date descending).
- `checkIn` — Upserts today's attendance record for the user with a check-in timestamp and optional location; safe to call repeatedly (only sets on insert).
- `checkOut` — Marks today's attendance record with a check-out timestamp and optional location; returns 409 if the user has not checked in first.
