CLI utility that sets a user's role in MongoDB by email address.

- Usage: `node scripts/setUserRole.js <email> "<role>"` — accepts one of: Citizen, Staff, Officer, Head Officer, Admin, Super Admin.
- Connects to the database via `config/db`, then `findOneAndUpdate`s the user document matching the normalized email.
- Prints the updated email and role on success; errors with "User not found" if no matching profile exists (the user must have registered/logged in at least once).
- Exits non-zero on missing/invalid arguments or when the user is not found.
