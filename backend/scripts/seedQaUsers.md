Database seed script that creates or updates the four standard QA test accounts in MongoDB.

- Connects to MongoDB using `MONGODB_URI` from the environment.
- Upserts each of the four QA users (Citizen, Admin, Officer, Staff) with a known shared password (`QaScc2026!`), their role, department, city, headline, and an auto-generated unique username.
- On insert the user is created fresh; on update the existing record's fields are refreshed and the password is reset.
- Prints a JSON summary of created/updated users and exits. Fails fast if `MONGODB_URI` is missing.
