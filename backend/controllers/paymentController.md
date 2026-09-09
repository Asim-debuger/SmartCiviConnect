Manages workforce payments through Razorpay: records, approvals, orders, verification, refunds, webhooks, summaries, and invoices.

- `ensureCompletionPayment` — Internal helper that auto-creates a Pending payment for a completed complaint's assigned staff (idempotent; called from complaint/operations flows).
- `listPayments` — Lists payments visible to the caller (admin: all; staff: own), with status filter, payout summaries, monthly/paid totals, and Razorpay-enabled flag.
- `getPayment` — Returns a single payment if the caller is admin or the payee.
- `createPayment` — Admin-only creation of a payment for a completed complaint's assigned staff; rejects duplicates and non-staff payees; writes an audit entry.
- `approvePayment` — Admin-only approval of a Pending payment; notifies the payee; writes an audit entry.
- `createOrder` — Admin-only creation of a Razorpay order for an approved payment; returns order details and public key; requires Razorpay configured.
- `initiatePayment` — Admin-only: marks an order/created payment as Initiated (checkout opened).
- `cancelPayment` — Admin-only: cancels an unpaid order/initiated payment with a reason.
- `failPayment` — Admin-only: records a failed checkout with a reason.
- `verifyPayment` — Admin-only verification of Razorpay checkout using order/payment id + signature (HMAC checked); marks paid, notifies payee, sends email, writes audit; handles duplicate/paid cases.
- `refundPayment` — Admin-only Razorpay refund of a completed payment; updates status to Refunded and notifies payee.
- `webhook` — Razorpay webhook handler (signature-verified) processing `payment.captured`, `payment.failed`, and `refund.processed` events to update payment state.
- `summary` — Admin-only aggregate counts/amounts per payment status plus Razorpay-enabled flag.
- `invoice` — Returns invoice data + HTML for a payment; restricted to admins and the payee (staff), rejecting other roles.
