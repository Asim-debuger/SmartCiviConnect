End-to-end QA lifecycle script that exercises the full citizen-to-completion complaint flow plus jobs, feed, and networking features against a local API.

- Logs in as citizen, admin, officer, and staff QA accounts; registers a new citizen; tests forgot-password and public contact endpoints.
- Creates a GPS complaint, assigns an officer, assigns field staff, walks the task through acceptance → in-progress → camera+GPS proof upload → rejection → resubmission → officer verification → completion.
- Validates citizen-facing restrictions (hidden unapproved evidence, blocked early rating, blocked payment APIs) and staff earnings/invoice access.
- Tests job creation, public job viewing, Cloudinary resume upload, job application, resume proxy streaming, and the admin application pipeline (Viewed → Rejected).
- Tests feed features: post creation, liking, commenting, replying, saving, and sharing/reposting.
- Tests networking: public professionals, profile privacy (hidden email/resume IDs), follow, and connection requests.
- Prints a PASS/FAIL report per assertion and exits non-zero on any failure.
