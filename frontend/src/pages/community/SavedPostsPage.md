The saved-posts library page listing bookmarked community posts for later review.

**Page purpose**
- Shows all posts the current user has bookmarked from the feed in a read-only list.

**Data fetched**
- `listSavedPosts()` loads saved posts.
- `savePost(id)` removes a post from the saved list; `sharePost(id, note)` reposts.

**State**
- `posts`, `loading`, `error`.

**Loading/empty states**
- `PageSkeleton` while loading; `EmptyState` ("No saved posts") when empty.

**Child components**
- `Avatar` (common), `PostMedia`, `QuotedPost`, `ShareMenu`, `Link` to `/post/<id>`.

**Role-specific behavior**
- Each saved post can be opened, reposted via `ShareMenu`, or removed from saves inline (reloads the list).
