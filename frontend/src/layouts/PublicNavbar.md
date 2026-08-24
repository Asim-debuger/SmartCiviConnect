This file defines the public-facing navigation bar component.

- **Functionality**: Renders a sticky top navbar with brand logo, public navigation links, theme toggle, authentication actions, and a responsive mobile menu drawer.
- **State**: `open` (boolean) controls the mobile menu visibility.
- **Context**: Reads theme from `ThemeContext` (`useTheme`), auth state from `AuthContext` (`useAuthContext`), and user dashboard path from `AppUserContext` (`useAppUserContext`).
- **Navigation links**: Home, About, Services, Jobs, Feed, Professionals, How It Works, Contact.
- **Auth behavior**: Shows Login/Register buttons when not authenticated; shows Profile, Dashboard (to `dashboard || "/citizen/dashboard"`), and Logout when authenticated. Logout also redirects to `/`.
- **Theme toggle**: Switches between dark/light mode using `toggleTheme` from `ThemeContext`.
- **Responsive behavior**: Full nav and auth actions hidden on mobile (`lg:hidden`), replaced by a collapsible menu drawer with the same links and auth actions.
