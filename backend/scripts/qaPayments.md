QA script that validates the workforce payment lifecycle including Razorpay order creation, signature verification, and payout-profile security.

- Verifies role-based access: citizens are blocked from payments; staff see only their own records; admin can list all and view summaries.
- Tests duplicate-payment protection and client-side amount spoofing rejection.
- Walks a payment through approve → Razorpay order creation → initiate → invalid-signature failure → retry → cancel → fail.
- Validates webhook signature rejection and staff invoice HTML rendering.
- Optionally creates a live Razorpay test payment (when API keys are set), verifies the signature, confirms idempotent duplicate verification, and checks that paid fields persist in the database.
- Prints a PASS/FAIL summary and exits non-zero on any failure.
