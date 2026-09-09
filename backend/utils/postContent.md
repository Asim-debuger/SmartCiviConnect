Normalizes post kinds and sanitizes community post media arrays.

- `KIND_ALIASES` - Maps shorthand and variant post kinds to canonical display names.
- `ALLOWED_KINDS` - Set of allowed post kind strings.
- `normalizeKind(kind)` - Maps a raw kind string to a canonical allowed kind; defaults to `Community Update`.
- `sanitizePostMedia(media)` - Maps an array of media objects to safe objects with `url`, `resourceType` (`image`, `video`, `raw`), and `name`; filters out invalid or URL-less entries.
