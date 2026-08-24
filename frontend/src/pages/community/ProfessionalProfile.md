The public/personal professional profile page showing a user's bio, experience, skills, posts, and follow/connection controls, with inline editing for the owner.

**Page purpose**
- Renders a single professional profile (`/profile/<id>`, `/profile/me`, or the current user) and lets the owner edit their profile.

**Data fetched**
- `getPublicProfile(id)` returns profile, stats, posts, and relation (connected/following/pending).
- `listFollows({ userId })` returns followers/following for the profile.
- `updateCurrentUser` saves edits; `openConversation` starts a chat (non-owner).

**State**
- `profile`, `stats`, `relation`, `posts`, `follows`, `form` (headline, bio, city, organization, skills, experienceYears, achievements), `saving`, `error`.

**Owner behavior**
- When `mine` is true, shows an "Edit professional profile" form and `ResumeUpload`; `restoreSession()` refreshes auth context after saving.

**Child components**
- `Avatar`, `ResumeUpload`, `QuotedPost`, `PostMedia`, `Link` to `/post/<id>` and profiles.

**Role-specific behavior**
- Non-owners see Connect/Message/Follow/Share buttons driven by `relation`; owners see the editor instead.
