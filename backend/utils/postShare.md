Resolves shared-post chains and provides populate helpers.

- `resolveOriginalPost(post)` - Follows `sharedFrom` references through the `Post` model to return the original (root) post, protecting against circular chains.
- `sharedFromPopulate()` - Returns a Mongoose populate config for the `sharedFrom` path, populating its `author` with `name`, `role`, `headline`, `profileImage`, and `username`.
- `AUTHOR_SELECT` - The author field selection string used by `sharedFromPopulate`.
