import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axiosInstance";

const AuthContext = createContext(null);
let meRequest = null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);

  function loginSuccess(data) {
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      setToken(data.accessToken);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Cookie/session may already be gone.
    }
    meRequest = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  async function restoreSession() {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) {
      setToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      if (!meRequest) meRequest = api.get("/auth/me");
      const { data } = await meRequest;
      loginSuccess({ accessToken: localStorage.getItem("accessToken") || storedToken, user: data.user });
    } catch (requestError) {
      const status = requestError?.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      }
    } finally {
      meRequest = null;
      setLoading(false);
    }
  }

  useEffect(() => {
    restoreSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isLoading: loading,
      isAuthenticated: Boolean(user && token),
      loginSuccess,
      logout,
      restoreSession,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export function useAuth() {
  return useAuthContext();
}
