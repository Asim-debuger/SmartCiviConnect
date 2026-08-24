# main.jsx

React application entry point that mounts the root component into the DOM and bootstraps global client-side infrastructure.

- **Rendering**
  - Uses `ReactDOM.createRoot` to render `App` inside `React.StrictMode`.
- **Routing**
  - Wraps the app in `BrowserRouter` from `react-router-dom` to enable client-side routing.
- **Authentication and app state**
  - Wraps the tree in `AuthProvider` and `AppUserProvider` so authentication and user-profile state are available globally.
- **Styles**
  - Imports `index.css` for global stylesheet initialization.
