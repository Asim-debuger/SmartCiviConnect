# ThemeContext.jsx

React context provider that manages the application dark/light theme preference.

- **State**
  - `dark` — boolean reflecting the current theme.
- **Initialization**
  - Reads `smartcivi-theme` from `localStorage`; falls back to `prefers-color-scheme` media query.
- **Side effects**
  - Toggles the `dark` class on `document.documentElement` whenever `dark` changes.
  - Persists the chosen theme to `localStorage` as `"dark"` or `"light"`.
- **Consumers get**
  - `dark` boolean and `toggleTheme` function to flip the theme.
- **Helpers**
  - `useTheme()` — convenience hook to consume the context.
