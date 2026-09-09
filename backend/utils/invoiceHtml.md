Generates styled HTML payment receipts/invoices.

- `invoiceHtml(invoice)` - Returns an HTML document string for a payment invoice, rendering fields such as `invoiceNo`, `transactionId`, `razorpayPaymentId`, `amount`, `status`, `payee`, and timestamps.
- `money(amount, currency)` - Formats a numeric amount as localized INR (default) or other currency string.
- `formatDate(value)` - Formats a date value as a medium-date, short-time string in `en-IN`, or `—` if missing.
- `escapeHtml(value)` - Escapes `&`, `<`, `>`, `"`, `'` for safe HTML rendering.
