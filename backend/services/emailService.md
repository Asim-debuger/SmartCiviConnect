Transactional email service built on Nodemailer with Brevo SMTP, sending templated civic-operation emails.

- `sendEmail({ to, subject, html, replyTo })` — Core send function; throws if SMTP is unconfigured or recipient is missing. Uses Brevo SMTP credentials from env vars.
- `sendPasswordResetEmail(user, link)` — Sends a time-limited password-reset link to the user.
- `sendWelcomeEmail(user)` — Sends a welcome/onboarding email after account creation (failure is logged, not thrown).
- `sendRoleUpdatedEmail(user)` — Notifies the user that their account role has changed.
- `sendAssignmentEmail(user, complaint, roleLabel, assignedBy)` — Sends a detailed HTML assignment brief (complaint details, GPS, media, action items) to an assigned officer or field worker.
- `sendStatusEmail(user, complaint, status)` — Notifies a user that their complaint reached a new status.
- `sendPaymentEmail(user, payment)` — Sends a payment confirmation or status update with amount, complaint reference, and transaction ID.
- `supportInbox()` — Returns the support email address from env or the default sender.
- `layout(title, body)` — Shared HTML wrapper used by all templated emails.
- Helpers: `escapeHtml`, `mapsUrlFor`, `mediaSummary`, `assignmentTemplate` — Format-safe builders for email content.
