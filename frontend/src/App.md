# App.jsx

Root React component that composes the top-level context providers and routing layer for the SmartciviConnect frontend.

- **Context providers**
  - Wraps the app tree in `ThemeProvider`, `SocketProvider`, and `ToastProvider` so global theme, real-time socket, and toast notification state are available everywhere.
- **Routing**
  - Renders `ScrollToTop` and `AppRoutes` as the primary rendered children.
- **Exports**
  - Default export `App` component.
