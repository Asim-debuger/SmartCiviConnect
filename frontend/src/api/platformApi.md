This file contains API functions for high-level platform and administrative management, such as departments, analytics, and payments.

-   **Department Management**:
    -   `listDepartments()`: Fetches all departments.
    -   `createDepartment(payload)`: Creates a new department.
    -   `updateDepartment(id, payload)`: Updates an existing department.
    -   `assignDepartmentOfficer(id, officerId)`: Assigns an officer to a department.
    -   `getDepartmentOverview()`: Gets an overview of a department's operations.

-   **Analytics and Auditing**:
    -   `getAnalytics()`: Fetches platform-wide analytics data.
    -   `getAuditLogs()`: Retrieves audit logs for tracking administrative actions.

-   **Payment Management**:
    -   `listPayments(params)`: Lists payment records.
    -   `getPayment(id)`: Retrieves a single payment record.
    -   `createPayment(payload)`: Creates a new payment entry.
    -   `approvePayment(id)`: Approves a payment.
    -   `createPaymentOrder(id)`: Creates a payment order with a payment gateway.
    -   `initiatePayment(id)`: Initiates the payment process.
    -   `cancelPayment(id, reason)`: Cancels a payment.
    -   `failPayment(id, reason)`: Marks a payment as failed.
    -   `refundPayment(id)`: Initiates a refund for a payment.
    -   `verifyPayment(payload)`: Verifies a payment with the payment gateway.
    -   `getPaymentSummary()`: Fetches a summary of payments.
    -   `getPaymentInvoice(id)`: Retrieves the invoice for a payment.
    -   `printInvoiceHtml(html)`: A client-side helper to open a print dialog for an HTML invoice.