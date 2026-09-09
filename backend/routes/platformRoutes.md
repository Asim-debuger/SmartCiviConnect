# platformRoutes

Platform-level administration for departments, notifications, payments, analytics, and audit logs.

## Departments

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /departments | listDepartments | authenticateUser |
| POST | /departments | createDepartment | authenticateUser + Admin, Super Admin |
| PATCH | /departments/:id | updateDepartment | authenticateUser + Admin, Super Admin |
| POST | /departments/:id/officers | assignOfficer | authenticateUser + Admin, Super Admin, Head Officer |

## Notifications

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /notifications | listMine | authenticateUser |
| PATCH | /notifications/:id/read | markRead | authenticateUser |
| DELETE | /notifications/:id | remove | authenticateUser |
| POST | /notifications/read-all | markAllRead | authenticateUser |

## Payments

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /payments | listPayments | authenticateUser + Staff, Admin, Super Admin |
| GET | /payments/summary | summary | authenticateUser + Admin, Super Admin |
| POST | /payments/verify | verifyPayment | authenticateUser + Admin, Super Admin |
| POST | /payments | createPayment | authenticateUser + Admin, Super Admin |
| GET | /payments/:id/invoice | invoice | authenticateUser + Staff, Admin, Super Admin |
| GET | /payments/:id | getPayment | authenticateUser + Staff, Admin, Super Admin |
| POST | /payments/:id/approve | approvePayment | authenticateUser + Admin, Super Admin |
| POST | /payments/:id/order | createOrder | authenticateUser + Admin, Super Admin |
| POST | /payments/:id/initiate | initiatePayment | authenticateUser + Admin, Super Admin |
| POST | /payments/:id/cancel | cancelPayment | authenticateUser + Admin, Super Admin |
| POST | /payments/:id/fail | failPayment | authenticateUser + Admin, Super Admin |
| POST | /payments/:id/refund | refundPayment | authenticateUser + Admin, Super Admin |

## Analytics & Audit

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /analytics | analytics | authenticateUser + Admin, Super Admin, Head Officer |
| GET | /audit-logs | listAuditLogs | authenticateUser + Admin, Super Admin |
