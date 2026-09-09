AES-256-GCM encryption helpers for sensitive profile fields.

- `encryptionKey()` - Derives a 32-byte key from `PAYMENT_DATA_KEY`, falling back to `JWT_ACCESS_SECRET` and `JWT_SECRET`; throws if no key is available.
- `encryptField(value)` - Encrypts a string value using AES-256-GCM with a random 12-byte IV; returns `<ivHex>:<tagHex>:<cipherHex>`.
- `decryptField(payload)` - Decrypts an `<ivHex>:<tagHex>:<cipherHex>` payload back to plaintext; returns empty string on malformed input.
