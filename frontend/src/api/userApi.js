import api from "./axiosInstance";
import { fetchProtectedFile } from "./fileAccess";

export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const updateCurrentUser = async (profileData) => {
  const { data } = await api.patch("/users/me", profileData);
  return data;
};

export const getMyResume = async (download = false) => {
  return fetchProtectedFile("/users/me/resume", { download });
};

export const listUsers = async (filters = {}) => {
  const { data } = await api.get("/users", { params: filters });
  return data;
};

export const updateUser = async (userId, updateData) => {
  const { data } = await api.patch(`/users/${userId}/role`, updateData);
  return data;
};

export const getMyPaymentProfile = async () => {
  const { data } = await api.get("/users/me/payment-profile");
  return data;
};

export const updateMyPaymentProfile = async (payload) => {
  const { data } = await api.patch("/users/me/payment-profile", payload);
  return data;
};

export const getUserPaymentProfile = async (userId) => {
  const { data } = await api.get(`/users/${userId}/payment-profile`);
  return data;
};

export const updateUserPaymentProfile = async (userId, payload) => {
  const { data } = await api.patch(`/users/${userId}/payment-profile`, payload);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};
