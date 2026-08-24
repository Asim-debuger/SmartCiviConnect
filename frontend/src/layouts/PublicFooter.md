This file defines the public-facing footer component.

- **Functionality**: Renders a dark-themed multi-column footer with brand information, platform links, company links, and civic support contact details.
- **Structure**: Four-column grid on medium+ screens (`max-w-7xl`) containing: brand description, Platform links (Services, How It Works, FAQ), Company links (About, Contact, Privacy Policy, Terms), and Civic Support contact hints.
- **Icons**: Uses `Mail`, `Phone`, and `MapPin` from `lucide-react` for contact entries.
- **Routing**: All section links use `react-router-dom` `Link` components.
- **Footer bar**: Bottom bar with a dynamic copyright year (`new Date().getFullYear()`) and tagline.
