The people-discovery page for finding, connecting with, following, and messaging other professionals in the network.

**Page purpose**
- Lets users search and filter the professional directory, view recommendations, manage invitations/connections, and see followers/following.

**Data fetched**
- `listPeople(filters)` for the discover directory (search, role, department, skill, location).
- `listConnections()` for pending invitations and accepted connections.
- `listRecommendations()` for recommended people.
- `listFollows()` for followers and following lists.
- `openConversation(userId)` to start messaging a connection.

**State**
- `people`, `pending`, `connections`, `recommended`, `followers`, `following`, `filters`, `loading`, `error`.

**API calls (communityApi)**
- `requestConnection`, `respondConnection` (Accept/Ignore), `toggleFollow`, `removeConnection`.

**Child components**
- `Avatar` (common); links to `${base}/profile/<id>` and `${base}/inbox?c=<id>`.

**Role-specific behavior**
- Connection buttons adapt to relation state (connected → Message, requested → Pending, otherwise → Connect).
- Follow/Unfollow toggles per person; recommendations shown when available.
