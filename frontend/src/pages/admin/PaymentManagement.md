Manages workforce payments including creation, approval, Razorpay checkout, refunds, and invoice printing.

- **Data fetched**: Loads payments (filtered by status), staff users, completed complaints, and payment summary in parallel.
- **State**: Tracks `payments`, `summary`, `workers`, `complaints`, `status` filter, form data, `error`, `busy` transaction IDs, `razorpayEnabled`, and bank user/profile data.
- **Payment lifecycle**: Create pending payments, approve payments, initiate Razorpay checkout, verify payments, handle checkout failures and cancellations, and issue refunds.
- **Razorpay integration**: Dynamically loads Razorpay checkout script, creates orders, initiates payments, and handles payment verification/cancellation/failure callbacks.
- **Bank details**: Displays staff payout details including account holder, account number, IFSC, bank name, phone, and verification status; allows toggling bank profile verification.
- **Invoice support**: Generates and prints payment invoices via `getPaymentInvoice` and `printInvoiceHtml`.
- **API calls**: `listPayments`, `getPaymentSummary`, `createPayment`, `createPaymentOrder`, `initiatePayment`, `verifyPayment`, `cancelPayment`, `failPayment`, `refundPayment`, `getPaymentInvoice`, `printInvoiceHtml`, `getUserPaymentProfile`, `updateUserPaymentProfile`, `listUsers`, `getAdminComplaints`.
