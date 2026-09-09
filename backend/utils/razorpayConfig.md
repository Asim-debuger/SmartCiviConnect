Reads Razorpay configuration from environment variables.

- `razorpayKeyId()` - Returns the trimmed `RAZORPAY_KEY_ID` environment variable.
- `razorpayKeySecret()` - Returns the trimmed `RAZORPAY_KEY_SECRET` or fallback `RAZORPAY_SECRET`.
- `razorpayWebhookSecret()` - Returns the trimmed `RAZORPAY_WEBHOOK_SECRET` or falls back to `razorpayKeySecret()`.
- `isRazorpayConfigured()` - Returns true if both key ID and key secret are present.
