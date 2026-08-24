Public community feed page listing browsable professional posts with interaction actions.

**Feed loading and errors**
- Fetches posts via `listPublicPosts` on mount.
- Displays loading state and error messages.

**Post rendering**
- Each post shows author avatar, name, headline/role, and time ago.
- Body text, media (`PostMedia`), or quoted post (`QuotedPost`).
- Optional link preview with image, title, and description.

**Interaction actions**
- Like, comment, share, and save buttons.
- All interactions redirect unauthenticated users to `/login?redirect=/feed`.
- `ShareMenu` component handles share and repost actions.

**Authentication prompts**
- Sign-in prompt below the feed for unauthenticated users.
- Login and Register links when not authenticated.

**Components used**
- `Avatar`, `PostMedia`, `QuotedPost`, `ShareMenu`.
- `timeAgo` utility for relative timestamps.
- React Router `Link` and `useNavigate`.
