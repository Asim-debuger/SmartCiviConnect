Produces a sanitized, access-controlled profile object for network-facing responses.

- `toSafeNetworkProfile(user, { isSelf })` - Returns a copy of the user object with secrets removed (`password`, `paymentProfile`, `refreshTokens`, `bank*`, `resumeUrl`, `resumePublicId`); strips contact fields when `isSelf` is false; sanitizes the profile image via `sanitizeProfileImage`.
