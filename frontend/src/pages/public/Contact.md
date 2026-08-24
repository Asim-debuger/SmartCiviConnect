Public Contact page with a submission form and city support desk contact details.

**Contact form**
- Collects name, email, phone, and message.
- Submits via `submitContact` from `contactApi`.
- Shows success confirmation or error messaging.
- Button disables during loading state.

**Support desk aside**
- Static contact details: email routing, phone note, online operations, and reply window.
- Placeholder map section noting no public office map is published.

**Components used**
- `PageHero` for the page header.
- `Container` for layout.
- Lucide icons: `Mail`, `Phone`, `MapPin`, `Clock3`, `Send`.

**Routing and state**
- Uses `useState` for form submission state (`sent`, `error`, `loading`).
- No explicit route params; standard public page.
