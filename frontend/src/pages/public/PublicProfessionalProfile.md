Public professional profile page displaying a civic professional's public profile, stats, and projects.

**Profile data**
- Fetches profile by `id` or `username` via `getPublicProfessional`.
- Displays name, username, headline/role, location, bio, skills, experience, education, certifications, and projects.
- Shows stats: connections, followers, and completed works.

**Authentication handling**
- Redirects authenticated users to their internal workspace profile via `Navigate`.
- Shows login prompts for unauthenticated visitors.

**Components used**
- `Avatar` for profile image.
- `formatMixed` for formatting arrays like education and certifications.
- `workspaceBase` for authenticated redirect.
- React Router `Link`, `Navigate`, `useParams`.
