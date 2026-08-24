Public Legal page that renders either Privacy Policy or Terms of Service based on a `type` prop.

**Privacy Policy content**
- Information we collect: JWT-managed identity, complaint details, evidence, role data.
- How information is used: authentication, routing, notifications, analytics.
- Access and retention: role-based access and operational record retention.

**Terms of Service content**
- Acceptable use: genuine civic reports only, no false or unlawful content.
- Accounts and roles: public registration creates citizen accounts only; staff roles granted by admins.
- Service availability: not a substitute for emergency services.

**Contact section**
- Shared contact email `hello@smartciviconnect.com` for both documents.

**Components used**
- `PageHero` for the page header.
- `Container` for layout.

**Routing**
- Prop `type` determines which document is shown (`privacy` vs `terms`).
