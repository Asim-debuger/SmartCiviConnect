Validates and sanitizes profile image URLs.

- `isClerkAsset(url)` - Returns true if the URL matches known Clerk asset domains.
- `sanitizeProfileImage(url)` - Returns an empty string if the URL is missing or is a Clerk asset; otherwise returns the URL unchanged.
