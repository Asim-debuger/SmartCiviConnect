# SmartciviConnect — Frontend Architecture & Folder Structure

This document explains how the `frontend/` folder is organized and how its pieces
connect to each other, from the entry point down to the backend API.

## Overview

The frontend is a **React 19 + Vite** single-page application (SPA) built with
**React Router v7** for routing, **Tailwind CSS v4** for styling, **Axios** for
HTTP, **Socket.IO** for real-time updates, and **react-hook-form** for forms.
It is the citizen-services portal (complaints, jobs, community feed, officer/staff
workflows, admin management).

Each non-empty source file in `src/` has a sibling `.md` note describing what that
specific file does. This document describes the bigger picture — how those files
fit together.

## Entry Point & Provider Hierarchy

Bootstrapping happens in two small files:

```
index.html
  └─ src/main.jsx          → mounts <App/> into #root
       └─ <BrowserRouter>  (react-router)
            └─ <AuthProvider>      (context/AuthContext)
                 └─ <AppUserProvider> (context/AppUserContext)
                      └─ <App/>
```

`src/App.jsx` then wraps the routed content with more global providers:

```
<App/>
  └─ <ThemeProvider>        (context/ThemeContext — light/dark)
       └─ <SocketProvider>  (context/SocketContext — live socket connection)
            └─ <ToastProvider> (context/ToastContext — notifications)
                 └─ <ScrollToTop/>   (component, scrolls on route change)
                      └─ <AppRoutes/> (routes/AppRoutes)
```

**Rule of thumb:** `main.jsx` sets up routing + auth; `App.jsx` sets up
theme/socket/toast + the actual routes. Pages and components consume these
providers via their `useX()` hooks.

## Folder Structure

```
frontend/
├─ index.html                  # HTML shell, loads /src/main.jsx
├─ vite.config.js             # Vite + React + Tailwind + Babel compiler
├─ package.json               # deps & scripts (dev, build, lint, test)
├─ src/
│  ├─ main.jsx                # entry point, provider stack
│  ├─ App.jsx                 # global providers + <AppRoutes/>
│  ├─ App.css / index.css     # global styles
│  ├─ api/                    # Axios API modules (one per domain)
│  ├─ components/             # reusable UI, grouped by feature
│  │   ├─ admin/  auth/  citizen/  common/  community/
│  │   ├─ complaints/  jobs/  landing/  maps/  officer/
│  │   ├─ payments/  public/  staff/
│  ├─ config/                # app config (e.g. maps.js)
│  ├─ context/               # React Context providers/state
│  ├─ hooks/                 # custom hooks (e.g. useSocket)
│  ├─ layouts/               # role-based page shells + nav
│  ├─ pages/                 # route screens, grouped by role/feature
│  │   ├─ admin/  auth/  citizen/  community/  head/
│  │   ├─ jobs/  officer/  public/  staff/
│  ├─ routes/                # route table + guards
│  │   └─ guards/            # ProtectedRoute, RoleRoute
│  └─ utils/                 # pure helpers (roles, constants, formatting)
```

## How the Layers Connect

```
            index.html
                │
            main.jsx  ── mounts ──▶ App.jsx
                                        │
                                   AppRoutes.jsx  ◀── defines every URL
                                        │
            ┌───────────────────────────┼───────────────────────────┐
            │                           │                           │
      Route Guard (guards/)      Layout (layouts/)            Page (pages/)
   ProtectedRoute + RoleRoute   role-based shell + sidebar  actual screen
                                        │
                  ┌─────────────────────┼─────────────────────┐
                  │                     │                     │
           Components/            Contexts/ (state)       api/ (HTTP)
        reusable building       Auth, Theme, Socket,      axios modules →
         blocks per feature       Toast, AppUser           backend /api
```

1. **Routes** (`routes/AppRoutes.jsx`) declare which URL renders which **Page**,
   wrapped in a **Guard** + **Layout**.
2. **Guards** (`routes/guards/`) decide if a user may enter:
   - `ProtectedRoute` → must be logged in (uses `AuthContext`).
   - `RoleRoute` → must have an allowed role (e.g. `CITIZEN`, `ADMIN`).
3. **Layouts** (`layouts/`) render the chrome (navbar/sidebar/footer) relevant to
   the role and nest the page inside `<Outlet/>`.
4. **Pages** (`pages/`) contain the screen logic and compose **Components**.
5. **Components** (`components/`) are reusable, feature-grouped UI blocks.
6. **Contexts** (`context/`) supply shared state (auth user, theme, live socket,
   toasts) to any component without prop drilling.
7. **API modules** (`api/`) are the only place that talks to the backend.

## Routing & Role-Based Access

All page components are **lazy-loaded** (`React.lazy` + `<Suspense>`) for code
splitting. Routes are grouped into guarded segments in `routes/AppRoutes.jsx`:

| Segment                      | Guard (roles)                          | Layout            |
|------------------------------|----------------------------------------|-------------------|
| Public (`/`, `/about`…)      | none                                   | `PublicLayout`    |
| `/login`, `/register`…       | none                                   | (standalone)      |
| `/citizen/*`                 | `CITIZEN`                              | `CitizenLayout`   |
| `/admin/*`                   | `ADMIN`, `SUPER_ADMIN`                 | `AdminLayout`     |
| `/super-admin/*`             | `SUPER_ADMIN`                          | `AdminLayout`     |
| `/officer/*`, `/head-officer/*` | `OFFICER`, `HEAD_OFFICER`          | `OfficerLayout`   |
| `/staff/*`                   | `STAFF`                                | `StaffLayout`     |
| `*` (catch-all)              | none                                   | `PublicLayout` → `NotFound` |

Role definitions live in `utils/roles.js`; route protection reads them from
`AuthContext`. `utils/constants.js` holds shared enums (statuses, categories, etc.).

## State Management (Contexts)

- **`AuthContext`** — current user, token, `loginSuccess`, `logout`,
  `restoreSession` (rehydrates from `/auth/me`). Source of truth for guards.
- **`AppUserContext`** — richer current-user profile data used across the app.
- **`ThemeContext`** — light/dark theme toggle.
- **`SocketContext`** — opens the Socket.IO connection (via `hooks/useSocket.js`)
  for live notifications/tracking.
- **`ToastContext`** — global toast/notification popups.

Components read these with `useAuth()`, `useTheme()`, `useSocket()`, `useToast()`
style hooks instead of prop drilling.

## API Layer & Backend Connection

- **`api/axiosInstance.js`** creates the centralized Axios instance:
  - `baseURL` = `VITE_API_URL` or default **`http://localhost:5000/api`**.
  - `withCredentials: true` (sends cookies).
  - Request interceptor attaches the JWT `Authorization` header from `localStorage`
    (skipped for public auth paths).
  - Response interceptor auto-refreshes expired tokens via `/auth/refresh`
    (deduped with a shared promise) and retries the original request; on failure
    it logs the user out and redirects to login.
- **`api/*.js`** — one module per domain (`userApi`, `complaintApi`, `jobApi`,
  `communityApi`, `chatApi`, `notificationApi`, `uploadApi`, `operationsApi`,
  `platformApi`, `publicCatalogApi`, `contactApi`, `fileAccess`) all built on the
  shared instance. Pages import these instead of calling Axios directly.
- **Real-time** — `SocketContext` + `hooks/useSocket.js` connect to the backend
  Socket.IO server for live updates (notifications, complaint/staff tracking).

> Note: `vite.config.js` does **not** define a dev proxy; the SPA calls the
> backend directly at `localhost:5000` via the Axios `baseURL` + CORS
> (`withCredentials`).

## Roles (who uses what)

| Role           | Primary area                          |
|----------------|--------------------------------------|
| `CITIZEN`      | complaints, community feed, jobs      |
| `OFFICER`      | assigned complaints, staff, tracking  |
| `HEAD_OFFICER` | officer dashboard + job management    |
| `STAFF`        | field tasks, live tracking, earnings |
| `ADMIN`        | users, complaints, departments, etc.  |
| `SUPER_ADMIN`  | super-admin dashboard                |

## Build & Tooling

- **Dev server:** `npm run dev` (Vite, port from config; SPA).
- **Build:** `npm run build` → static bundle.
- **Lint:** `npm run lint` (ESLint + react-hooks/refresh plugins).
- **Tests:** `npm test` runs the `src/utils/*.test.js` unit tests (Node test runner).
- **Styling:** Tailwind v4 via `@tailwindcss/vite`; global CSS in `index.css`/`App.css`.
- **Icons:** `lucide-react`. **Maps:** `@react-google-maps/api` (config in `config/maps.js`).

## Quick Mental Model

> A **URL** hits `AppRoutes` → checked by a **Guard** → wrapped in a **Layout**
> → renders a **Page** → built from **Components** → which pull **state** from
> **Contexts** and data from **API modules** → which talk to the **backend** over
> HTTP (Axios) and real-time (Socket.IO).
