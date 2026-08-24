Public professionals directory page listing searchable civic professionals.

**Filtering**
- Filters by search, role, department, skill, and location.
- Role options: All, Citizen, Staff, Officer, Head Officer.
- Re-fetches professionals via `listPublicProfessionals` when filters change.

**Professional cards**
- Each card links to `/professional/:id` and shows avatar, name, headline/role, department, city, and top 3 skills.
- Hover lift effect on cards.

**Empty and loading states**
- Displays loading text and dashed empty state when no results match.

**Components used**
- `Avatar`.
- React Router `Link`.
