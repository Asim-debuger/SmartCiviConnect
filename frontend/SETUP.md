# SmartciviConnect Frontend — Setup & Development

Getting-started guide for running and developing the **SmartciviConnect** frontend
(React 19 + Vite civic-services SPA). For the big-picture design, see
[ARCHITECTURE.md](./ARCHITECTURE.md); per-file notes live next to each source file
as `*.md`.

## Prerequisites

- **Node.js** (latest LTS recommended; the project uses ESM, Vite 8, React 19).
- The **backend** server running and reachable (default `http://localhost:5000`).
  The frontend is an SPA that talks to the backend over HTTP (Axios) and
  Socket.IO; it does not bundle any server logic.

## Install

```bash
cd frontend
npm install
```

## Environment Variables

Copy the existing `.env` (already present) and adjust if needed. The frontend reads
these at build/runtime via Vite's `import.meta.env`:

| Variable                       | Purpose                                              | Default                   |
|--------------------------------|------------------------------------------------------|---------------------------|
| `VITE_APP_NAME`                | App display name                                     | `SmartciviConnect`        |
| `VITE_API_BASE_URL` / `VITE_BACKEND_URL` | Base path for API calls (Axios `baseURL`)  | `http://localhost:5000/api` |
| `VITE_API_URL`                 | Backend origin (Socket.IO / direct calls)            | `http://localhost:5000`   |
| `VITE_GOOGLE_MAPS_API_KEY`     | Google Maps (tracking/map features)                  | —                         |
| `VITE_CLERK_PUBLISHABLE_KEY`   | Clerk publishable key (social/login, if enabled)     | —                         |

> The Axios instance (`src/api/axiosInstance.js`) prefers `VITE_API_URL` +
> `/api` and falls back to `http://localhost:5000/api`.

## Run

```bash
npm run dev        # start Vite dev server (HMR) → open the printed localhost URL
```

Production build / preview:

```bash
npm run build      # bundle to dist/
npm run preview    # serve the built bundle locally
```

## Scripts

| Script            | What it does                                        |
|-------------------|-----------------------------------------------------|
| `npm run dev`     | Vite dev server with hot reload.                    |
| `npm run build`   | Production build via Vite (React Compiler enabled). |
| `npm run preview` | Preview the production build.                       |
| `npm run lint`    | ESLint (react-hooks + react-refresh rules).         |
| `npm test`        | Node test runner for `src/utils/*.test.js`.         |

## Project Layout (short)

```
frontend/
├─ index.html          # HTML shell
├─ vite.config.js      # Vite + React + Tailwind v4 + Babel compiler
├─ vercel.json         # SPA rewrite → /index.html (Vercel deploy)
├─ .env                # environment variables (see above)
├─ src/
│  ├─ main.jsx         # entry: BrowserRouter + Auth providers
│  ├─ App.jsx          # global providers + routes
│  ├─ api/             # Axios API modules (one per domain)
│  ├─ components/      # reusable UI, grouped by feature
│  ├─ context/         # global state (Auth, Theme, Socket, Toast, AppUser)
│  ├─ hooks/           # custom hooks (useSocket)
│  ├─ layouts/         # role-based shells (Citizen/Admin/Officer/Staff/Public)
│  ├─ pages/           # route screens, grouped by role
│  ├─ routes/          # route table + guards (ProtectedRoute, RoleRoute)
│  ├─ utils/           # helpers (roles, constants, formatting)
│  └─ config/          # config (maps)
```

## Common Workflows

- **Add a page**: create `src/pages/<role>/X.jsx`, then register a lazy route in
  `src/routes/AppRoutes.jsx` inside the matching role-guarded `<Route>` group.
- **Call the backend**: import the relevant module from `src/api/` (e.g.
  `userApi`, `complaintApi`) — never instantiate Axios directly.
- **New global state**: add a provider in `context/`, wrap it in `App.jsx`
  (or `main.jsx` for auth/routing), and expose a `useX()` hook.
- **Styling**: Tailwind utility classes; global CSS in `src/index.css` / `src/App.css`.

## Deployment (Vercel)

`vercel.json` rewrites all paths to `index.html` so client-side routing works on
a static host. Build command: `npm run build`; output directory: `dist`.

## Notes

- Auth tokens live in `localStorage`; `axiosInstance` auto-attaches the JWT and
  refreshes expired tokens via `/auth/refresh`.
- Real-time features (notifications, tracking) use Socket.IO through
  `context/SocketContext` + `hooks/useSocket`.
- No dev proxy is configured in `vite.config.js`; the SPA calls the backend
  directly at `localhost:5000` (relies on CORS + `withCredentials`).
