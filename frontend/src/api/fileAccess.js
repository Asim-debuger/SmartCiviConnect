import api, { refreshClient } from "./axiosInstance";

function fileNameFromDisposition(header, fallback) {
  if (!header) return fallback;
  const match = /filename\*?=(?:UTF-8''|"?)([^";]+)/i.exec(header);
  return match ? decodeURIComponent(match[1].replace(/"/g, "")) : fallback;
}

async function messageFromBlob(blob, fallback) {
  if (!blob || typeof blob.text !== "function") return fallback;
  const text = await blob.text();
  try {
    const parsed = JSON.parse(text);
    return parsed.message || fallback;
  } catch {
    return text.slice(0, 280) || fallback;
  }
}

function fileUrl(path, params) {
  const base = (api.defaults.baseURL || "http://localhost:5000/api").replace(/\/$/, "");
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function rawGet(url) {
  const token = localStorage.getItem("accessToken");
  return fetch(url, {
    method: "GET",
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

async function refreshAccessToken() {
  const { data } = await refreshClient.post("/auth/refresh");
  if (!data?.accessToken) throw new Error("Session could not be renewed");
  localStorage.setItem("accessToken", data.accessToken);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
}

export async function fetchProtectedFile(path, { download = false, params = {} } = {}) {
  const url = fileUrl(path, { file: "1", download: download ? "1" : "0", ...params });
  let response = await rawGet(url);
  if (response.status === 401) {
    try {
      await refreshAccessToken();
      response = await rawGet(url);
    } catch {
      // keep original 401 body
    }
  }
  const blob = await response.blob();
  if (!response.ok) {
    throw new Error(await messageFromBlob(blob, "Unable to open this document."));
  }
  if (blob.type === "application/json") {
    throw new Error(await messageFromBlob(blob, "Unable to open this document."));
  }
  const fileName = fileNameFromDisposition(response.headers.get("content-disposition"), "document");
  const fileType = blob.type || response.headers.get("content-type") || "";
  const objectUrl = URL.createObjectURL(blob);
  return { url: objectUrl, fileName, fileType, blob, delivery: "proxy" };
}

export function revokeFileUrl(url) {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}
