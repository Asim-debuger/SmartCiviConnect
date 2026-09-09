Documents payment profile security: AES-GCM encryption of sensitive fields and validation of bank payout details.

- `encryptField`/`decryptField` round-trip an account secret via AES-GCM and never store it as plaintext.
- `validatePaymentProfileInput` accepts valid account holder, 11-digit account number, well-formed IFSC, bank name, and phone.
- Validation rejects spoofed/invalid payout details (too-short account number, bad IFSC, bad phone) by returning an error.
