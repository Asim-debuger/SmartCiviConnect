Normalizes payment statuses and computes workforce pay amounts.

- `PAYMENT_STATUSES` - Array of canonical payment statuses.
- `ALIASES` - Object mapping legacy/UI status strings to canonical statuses.
- `normalizePaymentStatus(status)` - Normalizes a raw status string to a canonical payment status; defaults to `Pending`.
- `publicStatus(status)` - Alias for `normalizePaymentStatus`.
- `isPaidStatus(status)` - Returns true if the normalized status is `Paid`.
- `workforceAmount(priority)` - Returns a fixed workforce payment amount for `Urgent` (2500), `High` (1800), or default (1200).
- `toPaise(amount)` - Converts an amount to paise by rounding to the nearest integer.
