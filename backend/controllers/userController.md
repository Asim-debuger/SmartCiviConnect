Manages the authenticated user's profile, resume access, role/account administration, and encrypted payment (payout) profiles.

- `getMyPaymentProfile` — Returns the caller's own decrypted payout profile (workforce roles only).
- `updateMyPaymentProfile` — Validates and saves the caller's own encrypted payout profile (workforce roles only); writes an audit entry.
- `getUserPaymentProfile` — Admin/Super Admin views another user's decrypted payout profile (workforce only).
- `updateUserPaymentProfile` — Admin/Super Admin updates or verifies another user's payout profile (encrypted); writes an audit entry.
- `getCurrentUser` — Returns the caller's safe profile.
- `updateMe` — Updates the caller's own editable profile fields (name/phone/skills/location/availability/bio/etc.); validates resume ownership/type; notifies admins when a staff member becomes unavailable; sanitizes profile image.
- `getMyResume` — Returns the caller's resume metadata or file buffer (downloadable) from Cloudinary.
- `listUsers` — Lists users filtered by role/search/skill/availability; officers see only Staff, head officers see their department's Officers/Staff.
- `updateUserRole` — Admin/Super Admin updates a user's role/department/phone/skills/active status with guard rails (admins can't grant Admin/Super Admin; Super Admin only modifiable by Super Admin), notifies and emails the user, and writes an audit entry.
