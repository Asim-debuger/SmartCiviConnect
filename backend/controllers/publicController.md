Exposes unauthenticated public endpoints for the marketing site: contact form, public jobs/professionals/posts, platform stats, and featured content.

- `submitContact` / `contactLimiter` — Rate-limited (8 per 15 min) public contact form handler that validates name/email/message and emails the support inbox with HTML-escaped content.
- `listPublicJobs` — Paginated list of open jobs with filters (location/department/type/skill/experience/workplace/search) and applicant counts; excludes `createdBy`.
- `listPublicProfessionals` — Lists active professionals (Staff/Officer/Head Officer/Citizen) filtered by role/department/skill/location/search using safe public profiles.
- `getPublicProfessional` — Returns a single public professional profile (by id or username) with follower/connection/completed-work stats.
- `getPublicJob` — Returns a single open job with applicant count and recruiter, stripping `createdBy`; 404 if not open.
- `platformStats` — Returns aggregate counts: total/completed/pending/in-progress complaints, active people, and open jobs.
- `featured` — Returns up to 4 latest open jobs and 6 professionals with headlines for the homepage.
- `listPublicPosts` / `getPublicPost` — Lists or returns individual public posts (non-connections-only) with author and shared-from population.
