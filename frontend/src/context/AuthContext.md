# AuthContext.jsx

React context provider that manages authentication state, session restoration, login success handling, and logout.

- **State**
  - `user` — parsed user object persisted in `localStorage` under `user`, or `null`.
  - `token` — access token persisted in `localStorage` under `accessToken`, or `null`.
  - `loading` — `true` while session restoration is in progress.
- **Methods**
  - `loginSuccess(data)` — stores `accessToken` and `user` in `localStorage` and updates React state.
  - `logout()` — calls `/auth/logout`, clears `localStorage`, resets state to `null`.
  - `restoreSession()` — reads stored token, calls `/auth/me` to rehydrate user state, clears storage on `401`/`403`.
- **Side effects**
  - Runs `restoreSession()` once on mount via `useEffect`.
- **Consumers get**
  - `user`, `token`, `loading`, `isLoading`, `isAuthenticated`, `loginSuccess`, `logout`, `restoreSession`.
- **Helpers**
  - `useAuthContext()` and `useAuth()` — convenience hooks to consume the context.
