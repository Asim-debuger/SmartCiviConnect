# userRoutes

User profile and account management including resume, payment profiles, and role administration.

## Endpoints

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /me | getCurrentUser | authenticateUser |
| GET | /me/resume | getMyResume | authenticateUser |
| GET | /me/payment-profile | getMyPaymentProfile | authenticateUser + Staff, Officer, Head Officer |
| PATCH | /me/payment-profile | updateMyPaymentProfile | authenticateUser + Staff, Officer, Head Officer |
| PATCH | /me | updateMe | authenticateUser |
| GET | / | listUsers | authenticateUser + Admin, Super Admin, Head Officer, Officer |
| GET | /:id/payment-profile | getUserPaymentProfile | authenticateUser + Admin, Super Admin |
| PATCH | /:id/payment-profile | updateUserPaymentProfile | authenticateUser + Admin, Super Admin |
| PATCH | /:id/role | updateUserRole | authenticateUser + Admin, Super Admin |
