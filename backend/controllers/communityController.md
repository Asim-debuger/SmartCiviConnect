Powers the social/community network: directory, connections, follows, posts, feed, comments, shares, saves, profiles, and recommendations.

- `listDirectory` — Lists active users (excluding self) filtered by role/department/skill/location/search, tagging each with the caller's relation (connected/requested/incoming/following).
- `requestConnection` — Sends a connection request to another user (validates id), re-opens a rejected request, or returns 409 if one exists; notifies the recipient.
- `respondConnection` — Accepts or rejects a pending request addressed to the caller; notifies the requester on accept.
- `listConnections` — Returns the caller's pending incoming requests and accepted connections (other participant attached).
- `listFeed` — Returns the caller's feed (network + announcements/jobs) with cursor pagination, saved flags, and recommendation markers.
- `trendingPosts` — Returns top posts from the last 14 days sorted by shares then likes.
- `createPost` — Creates a public post (text/media/link), fetching an OG link preview; returns 400 if empty.
- `likePost` — Toggles a like on a post; notifies the author when newly liked.
- `commentPost` — Adds a top-level comment or a reply to a comment; notifies the author.
- `sharePost` — Increments the original post's share count and creates a repost with optional commentary; notifies the original author.
- `deletePost` — Deletes the caller's own post (or any post for Admin/Super Admin) and decrements the original's share count if it was a repost.
- `likeComment` — Toggles a like on a specific comment.
- `savePost` / `savedPosts` — Toggle-saves a post to the caller's saved list and lists all saved posts (in saved order).
- `removeConnection` — Deletes a connection the caller is part of.
- `getPublicProfile` — Returns a user's public profile (by id or username) with stats, relation to caller, and recent posts.
- `toggleFollow` — Follows/unfollows a user; notifies the target on follow.
- `listFollows` — Lists a user's followers and following lists.
- `recommendPeople` — Scores and returns up to 8 candidate users for the caller based on department, location, shared skills, and role affinity.
