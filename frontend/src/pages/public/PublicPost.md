Public post detail page showing a single community post with media and sharing options.

**Post loading**
- Fetches post by `id` via `getPublicPost`.
- Shows loading and error states.

**Post content**
- Author avatar, name, headline/role, and time ago.
- Body text.
- Media (`PostMedia`) or quoted post (`QuotedPost`) if it is a repost.

**Sharing**
- `ShareMenu` component for copy link, share actions, and repost with note.
- Repost calls `sharePost` API when authenticated; otherwise redirects to login.

**Navigation**
- "Back to feed" link to `/feed`.

**Components used**
- `Avatar`, `PostMedia`, `QuotedPost`, `ShareMenu`.
- `timeAgo` utility.
- React Router `Link`, `useNavigate`, `useParams`.
