Production-readiness QA script that verifies security boundaries, encrypted payout profiles, and public-facing endpoints.

- Confirms citizens are blocked from payment and bank-profile APIs; staff cannot read another user's bank profile.
- Tests encrypted payout-profile save (staff/officer), admin decryption of bank details, and admin verification of bank details.
- Validates that payment lists never leak full account numbers — staff see none, admin sees only masked `last4` summaries.
- Verifies public endpoints: professionals hide phone numbers, jobs and posts are publicly listable, guest job applications require login, and the contact form works.
- Confirms duplicate/spoof payment creation remains blocked.
- Prints a pass/fail summary and exits non-zero on any failure.
