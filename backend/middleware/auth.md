JWT authentication and role-based authorization middleware for protected routes.

- Uses `jsonwebtoken` to verify tokens signed with the `smartciviconnect` issuer; secret read from `JWT_ACCESS_SECRET` or `JWT_SECRET`.
- `authenticateUser`: extracts a `Bearer` token from the `Authorization` header, verifies it, loads the user from the `User` model (selecting resume fields), and rejects inactive accounts. Attaches `req.user` and `req.auth` (`userId`, `user`, `role`).
- Returns 401 with codes `TOKEN_EXPIRED` / `TOKEN_INVALID` for bad tokens; 403 for deactivated accounts.
- `authorizeRoles(...roles)`: guard that checks `req.auth.role` (normalized via `normalizeRole`) against the allowed roles; 403 on mismatch.
- Exports: `authenticateUser`, `authorizeRoles`, and aliases `authenticate`, `requireAuth`, `requireUser`, `requireRoles`.
- Dependencies: `jsonwebtoken`, `../models/User`, `../utils/roles`.
