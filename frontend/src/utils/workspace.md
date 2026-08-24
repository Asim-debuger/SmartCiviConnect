# workspace.js

Utilities for determining the current user workspace base path, resolving internal links, and formatting relative timestamps.

- **workspaceBase(pathname)**
  - Inspects the current pathname and returns the workspace root prefix: `/staff`, `/head-officer`, `/officer`, `/admin`, or `/citizen`.
- **resolveAppLink(link, pathname)**
  - Converts a generic internal link (e.g., `/network`, `/inbox`, `/jobs`, `/feed`) into a workspace-scoped URL based on the current pathname; absolute paths starting with a known workspace prefix are returned unchanged.
- **timeAgo(value)**
  - Converts a date string into a relative time label (`"just now"`, `"5m"`, `"3h"`, `"2d"`, or locale date string).
