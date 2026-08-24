import api from "./axiosInstance";

export async function listInbox() {
  const { data } = await api.get("/inbox");
  return data;
}

export async function openConversation(userId) {
  const { data } = await api.post("/inbox", { userId });
  return data;
}

export async function listMessages(id) {
  const { data } = await api.get(`/inbox/${id}/messages`);
  return data;
}

export async function sendMessage(id, payload) {
  const { data } = await api.post(`/inbox/${id}/messages`, payload);
  return data;
}
