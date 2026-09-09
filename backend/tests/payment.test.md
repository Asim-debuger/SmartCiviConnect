Documents the payment lifecycle helpers: status normalization, server-side workforce amounts, and Razorpay signature verification.

- Payment status aliases map to canonical lifecycle values ("Processing" -> "OrderCreated", "Success" -> "Paid", "Initiated" stays "Initiated").
- `isPaidStatus` reports paid vs unpaid (e.g. "Success" true, "Pending" false).
- Workforce amounts are resolved server-side by priority tier (Urgent/High/Medium) and `toPaise` converts rupees to paise.
- Razorpay checkout signature is HMAC-SHA256 over `orderId|paymentId`, producing a 64-char hex and differing from a forged secret.
- Razorpay webhook signature is HMAC-SHA256 over the raw JSON body and differs from signatures of other bodies.
