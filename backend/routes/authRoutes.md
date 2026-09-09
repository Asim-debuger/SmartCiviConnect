# authRoutes

Authentication routes handling registration, login, session management, and password recovery.

## Endpoints

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| POST | /register | register | rateLimiter |
| POST | /login | login | rateLimiter |
| POST | /refresh | refresh | — |
| POST | /logout | logout | — |
| POST | /forgot-password | forgotPassword | rateLimiter |
| POST | /reset-password | resetPassword | rateLimiter |
| POST | /change-password | changePassword | authenticateUser |
| GET | /me | getCurrentUser | authenticateUser |
