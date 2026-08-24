The professional feed page where users publish, browse, interact with, and manage community posts and trending content.

**Page purpose**
- Displays a public/personal professional feed of posts plus a Trending sidebar.
- Lets the current user compose a new post (text, optional category, link, and media) with a two-step review-and-confirm publish flow.

**Data fetched**
- `listFeed({ limit, before })` loads the feed, supporting infinite scroll via a cursor (`nextCursor`/`hasMore`).
- `listTrending()` loads the trending posts sidebar.
- `uploadComplaintMedia` uploads attached images/videos/files before publishing.

**State**
- `posts`, `trending`, `cursor`, `hasMore`, `loading`, `loadingMore` for the feed.
- `body`, `kind`, `link`, `files`, `previews`, `confirming`, `publishing`, `progress` for the composer.
- `comment`/`reply` maps keyed by post/comment id for inline commenting and replies.

**API calls (communityApi)**
- `createPost`, `likePost`, `commentPost`, `likeComment`, `sharePost`, `savePost`, `deletePost`.

**Child components**
- `ShareMenu`, `PostMedia`, `QuotedPost`, `Avatar` (common).

**Role-specific behavior**
- Authors can delete their own posts; posts can be liked, commented on, replied to, reposted, and saved inline.
- Infinite scroll triggers `load(false)` near the bottom of the page to append more posts.
