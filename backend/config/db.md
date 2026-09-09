Establishes the MongoDB connection and runs one-time data migrations on startup.

- Exports `connectDB`, an async function that connects Mongoose to `process.env.MONGODB_URI`.
- Runs `dropObsoleteClerkIndex()` to remove a legacy unique `clerkId` index from the `users` collection (handles `IndexNotFound` gracefully).
- Runs `stripClerkUserFields()` to unset `clerkId`, `clerkImageUrl`, and `clerk` fields from users, and clears `profileImage` values that point to Clerk-hosted assets (uses `isClerkAsset` util).
- After connecting, requires the `Job`/`Application` models and runs `migrateJobEnums` to normalize job status enums.
- Logs success or exits the process with code 1 on connection failure.
- Dependencies: `mongoose`, `../utils/profileImage`, `../utils/jobStatus`.
