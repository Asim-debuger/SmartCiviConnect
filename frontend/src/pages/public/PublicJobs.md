Public jobs listing page for browsing open civic roles with client-side filtering.

**Filtering**
- Filters by search query, location, skill, and job type.
- Type dropdown options: All, Full time, Part time, Contract, Emergency work.
- Re-fetches jobs via `listPublicJobs` when any filter changes.

**Job cards**
- Each card shows title, department, location, type, applicant count, description, salary range, and deadline.
- Links to job detail page and sign-in/register actions for applying.

**Loading and errors**
- Displays loading and error states from the API response.

**Components used**
- React Router `Link`.
