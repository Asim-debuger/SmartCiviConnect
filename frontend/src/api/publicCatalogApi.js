import api from "./axiosInstance";

export async function listPublicJobs(params = {}) {
  const { data } = await api.get("/public/jobs", { params });
  return data;
}

export async function listPublicProfessionals(params = {}) {
  const { data } = await api.get("/public/professionals", { params });
  return data;
}

export async function getPublicProfessional(id) {
  const { data } = await api.get(`/public/professionals/${id}`);
  return data;
}

export async function getPublicJob(id) {
  const { data } = await api.get(`/public/jobs/${id}`);
  return data;
}

export async function listPublicPosts(params = {}) {
  const { data } = await api.get("/public/posts", { params });
  return data;
}

export async function getPublicPost(id) {
  const { data } = await api.get(`/public/posts/${id}`);
  return data;
}

export async function getPlatformStats() {
  const { data } = await api.get("/public/stats");
  return data;
}

export async function getFeatured() {
  const { data } = await api.get("/public/featured");
  return data;
}
