QA script that validates feed repost/share behavior, nested reposts, and repost deletion semantics.

- Creates an original post with mixed media (image, video, raw PDF), then reposts it via another user.
- Verifies a repost stores a `sharedFrom` reference to the original rather than copying media, preserves the original author and media on the reference, and is flagged as a repost.
- Tests liking, commenting on, and saving a repost; verifies a nested share-of-repost still points at the original.
- Confirms the public view of a repost surfaces the original's media.
- Validates deletion rules: the repost author can delete the repost (original survives); another user cannot delete the original.
- Re-confirms citizens remain blocked from payment and bank-profile APIs.
- Prints a pass/fail summary and exits non-zero on any failure.
