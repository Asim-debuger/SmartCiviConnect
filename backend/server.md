Application entry point: sets up Express, HTTP server, Socket.IO, middleware, routes, and socket events.

- Loads env via `dotenv` from `backend/.env`.
- Creates an Express `app` and an HTTP `server`; wraps it with `socket.io` allowing credentials from `FRONTEND_URL` (default `http://localhost:5173`).
- Stores the `io` instance on `app.set("io", ...)` for access in controllers.
- Connects to MongoDB and seeds default departments via `ensureDefaultDepartments`.
- Security/parsing middleware: `cors` (configured origins/headers), `cookie-parser`, `helmet` (cross-origin resource policy), `express-rate-limit` (300 requests / 15 min), `express.json` (1 MB limit), and a raw-body webhook handler at `/api/payments/webhook`.
- Route mounting: `/api/users`, `/api/complaints`, `/api/uploads`, `/api/operations`, `/api/public`, `/api/auth`, plus platform and community routes at `/api`.
- Socket auth middleware: verifies JWT from `socket.handshake.auth.token`, sets `socket.userId`/`socket.userRole`.
- Socket events: `presence:online/offline` broadcasts, `complaint:join`/`chat:join` room joins, `chat:typing`, `location:update` (emitted to complaint room and officer/admin roles).
- Root route returns a status string; centralized error handler maps validation/cast errors to 400, else 500.
- Listens on `process.env.PORT` or 5000.
