# SocketContext.jsx

React context provider that manages a single Socket.IO client instance and ties its connection lifecycle to the authentication token.

- **Socket creation**
  - Creates a `socket.io-client` instance using `VITE_BACKEND_URL` (stripping `/api` suffix) or `http://localhost:5000`, with `autoConnect: false`.
- **Connection side effects**
  - `useEffect` watches `token`: when present, sets `socket.auth.token` and calls `socket.connect()`; when absent, calls `socket.disconnect()`.
  - Cleanup disconnects the socket on unmount.
- **Consumers get**
  - The live `socket` instance via `SocketContextValue`.
