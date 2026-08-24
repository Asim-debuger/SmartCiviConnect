import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function isAuthPublicPath(url = "") {
  return ["/auth/login", "/auth/register", "/auth/refresh", "/auth/forgot-password", "/auth/reset-password"].some((path) => url.includes(path));
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && !isAuthPublicPath(config.url || "")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const blobBody = error.response?.data;
    if (typeof Blob !== "undefined" && blobBody instanceof Blob) {
      try {
        error.response.data = JSON.parse(await blobBody.text());
      } catch {
        error.response.data = { message: "Unable to complete this request." };
      }
    }
    const originalRequest = error.config;
    const expired = error.response?.status === 401 && (
      error.response?.data?.code === "TOKEN_EXPIRED"
      || /expired|jwt/i.test(String(error.response?.data?.message || ""))
    );
    const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
    if (!expired || !hasAccessToken || originalRequest?._retry || isAuthPublicPath(originalRequest?.url || "")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      refreshPromise = refreshPromise || refreshClient.post("/auth/refresh");
      const { data } = await refreshPromise;
      refreshPromise = null;
      if (!data?.accessToken) {
        throw Object.assign(new Error("Session could not be renewed"), { response: { status: 401 } });
      }
      localStorage.setItem("accessToken", data.accessToken);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      const refreshFailed = refreshError?.response?.status === 401 || refreshError?.response?.status === 403;
      if (refreshFailed) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        const path = window.location.pathname;
        const publicPath = path === "/" || path.startsWith("/login") || path.startsWith("/register") || path.startsWith("/forgot-password") || path.startsWith("/reset-password") || path.startsWith("/jobs") || path.startsWith("/job/") || path.startsWith("/professionals") || path.startsWith("/u/") || path.startsWith("/post/") || path.startsWith("/feed") || path.startsWith("/contact") || path.startsWith("/about") || path.startsWith("/services");
        if (!publicPath) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(refreshError);
    }
  },
);

export function setupAxios() {}

export { refreshClient };
export default api;
