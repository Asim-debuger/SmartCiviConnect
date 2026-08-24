import api from "./axiosInstance";

export async function listPeople(params = {}) {
  const { data } = await api.get("/network/people", { params });
  return data;
}

export async function listConnections() {
  const { data } = await api.get("/network/connections");
  return data;
}

export async function requestConnection(userId) {
  const { data } = await api.post("/network/connections", { userId });
  return data;
}

export async function respondConnection(id, status) {
  const { data } = await api.patch(`/network/connections/${id}`, { status });
  return data;
}

export async function removeConnection(id) {
  const { data } = await api.delete(`/network/connections/${id}`);
  return data;
}

export async function getPublicProfile(id) {
  const { data } = await api.get(`/network/profile/${id}`);
  return data;
}

export async function toggleFollow(userId) {
  const { data } = await api.post("/network/follow", { userId });
  return data;
}

export async function listFollows(params = {}) {
  const { data } = await api.get("/network/follows", { params });
  return data;
}

export async function listFeed(params = {}) {
  const { data } = await api.get("/feed", { params });
  return data;
}

export async function listTrending() {
  const { data } = await api.get("/feed/trending");
  return data;
}

export async function listRecommendations() {
  const { data } = await api.get("/network/recommendations");
  return data;
}

export async function listSavedPosts() {
  const { data } = await api.get("/feed/saved");
  return data;
}

export async function createPost(payload) {
  const { data } = await api.post("/feed", payload);
  return data;
}

export async function likePost(id) {
  const { data } = await api.post(`/feed/${id}/like`);
  return data;
}

export async function commentPost(id, body, commentId) {
  const { data } = await api.post(`/feed/${id}/comment`, { body, commentId });
  return data;
}

export async function sharePost(id, body) {
  const { data } = await api.post(`/feed/${id}/share`, { body });
  return data;
}

export async function deletePost(id) {
  const { data } = await api.delete(`/feed/${id}`);
  return data;
}

export async function likeComment(id, commentId) {
  const { data } = await api.post(`/feed/${id}/comments/like`, { commentId });
  return data;
}

export async function savePost(id) {
  const { data } = await api.post(`/feed/${id}/save`);
  return data;
}
