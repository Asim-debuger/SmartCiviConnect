This file defines the public (unauthenticated) layout wrapper.

- **Functionality**: Provides a minimal full-page layout with a top navbar, a main content area for nested routes, and a footer.
- **Components**: Renders `PublicNavbar` at the top, `<main>` with `<Outlet />` in the center, and `PublicFooter` at the bottom.
- **Styling**: Uses a light/dark-aware background and text color scheme; the main area grows to fill available vertical space (`flex-1`).
