Normalizes and summarizes payment/bank profile data for staff users.

- `validatePaymentProfileInput(body)` - Validates and normalizes bank input fields (`accountNumber`, `accountHolderName`, `ifsc`, `bankName`, `phone`); returns an error string or sanitized values.
- `normalizeIfsc(value)` - Strips spaces and uppercases an IFSC code.
- `normalizeAccount(value)` - Strips spaces from an account number.
- `normalizePhone(value)` - Strips non-digits and strips Indian `91`/`0` prefixes to produce a 10-digit mobile number.
- `maskName(name)` - Masks a holder name showing only initials and dots (e.g., `J•ohn• Doe`).
- `toSummary(profile)` - Returns a safe summary object with `hasProfile`, `verified`, `last4`, `bankName`, `ifscPrefix`, `holderMasked`, and `verifiedAt`.
