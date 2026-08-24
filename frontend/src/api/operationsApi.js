// import axiosInstance from "./axiosInstance";

// export async function getAdminStats(authToken) {
//   const response = await axiosInstance.get("/operations/admin/stats", { authToken });
//   return response.data;
// }

// export async function getAdminComplaints(filters = {}, authToken) {
//   const response = await axiosInstance.get("/operations/admin/complaints", { params: filters, authToken });
//   return response.data;
// }

// export async function assignComplaint(id, assignment, authToken) {
//   const response = await axiosInstance.patch(`/operations/admin/complaints/${id}/assign`, assignment, { authToken });
//   return response.data;
// }

// export async function getAssignedComplaints(authToken) {
//   const response = await axiosInstance.get("/operations/assigned", { authToken });
//   return response.data;
// }

// export async function acceptOfficerComplaint(id, authToken) {
//   const response = await axiosInstance.post(`/operations/officer/complaints/${id}/accept`, {}, { authToken });
//   return response.data;
// }

// export async function assignStaffToComplaint(id, staffId, authToken) {
//   const response = await axiosInstance.patch(`/operations/officer/complaints/${id}/staff`, { staffId }, { authToken });
//   return response.data;
// }

// export async function updateTask(id, data, authToken) {
//   const response = await axiosInstance.patch(`/operations/tasks/${id}`, data, { authToken });
//   return response.data;
// }

// export async function sendComplaintMessage(id, data, authToken) {
//   const response = await axiosInstance.post(`/operations/complaints/${id}/messages`, data, { authToken });
//   return response.data;
// }

// export async function getComplaintMessages(id, authToken) {
//   const response = await axiosInstance.get(`/operations/complaints/${id}/messages`, { authToken });
//   return response.data;
// }

















import axiosInstance from "./axiosInstance";

export async function getAdminStats() {
  const response = await axiosInstance.get("/operations/admin/stats");
  return response.data;
}

export async function getAdminComplaints(filters = {}) {
  const response = await axiosInstance.get("/operations/admin/complaints", { params: filters });
  return response.data;
}

export async function assignComplaint(id, assignment) {
  const response = await axiosInstance.patch(`/operations/admin/complaints/${id}/assign`, assignment);
  return response.data;
}

export async function getAssignedComplaints() {
  const response = await axiosInstance.get("/operations/assigned");
  return response.data;
}

export async function acceptOfficerComplaint(id) {
  const response = await axiosInstance.post(`/operations/officer/complaints/${id}/accept`, {});
  return response.data;
}

export async function assignStaffToComplaint(id, staffId) {
  const response = await axiosInstance.patch(`/operations/officer/complaints/${id}/staff`, { staffId });
  return response.data;
}

export async function updateTask(id, data) {
  const response = await axiosInstance.patch(`/operations/tasks/${id}`, data);
  return response.data;
}

export async function sendComplaintMessage(id, data) {
  const response = await axiosInstance.post(`/operations/complaints/${id}/messages`, data);
  return response.data;
}

export async function getComplaintMessages(id) {
  const response = await axiosInstance.get(`/operations/complaints/${id}/messages`);
  return response.data;
}

export async function rejectComplaint(id, note) {
  const response = await axiosInstance.post(`/operations/officer/complaints/${id}/reject`, { note });
  return response.data;
}

export async function verifyTask(id) {
  const response = await axiosInstance.post(`/operations/tasks/${id}/verify`);
  return response.data;
}

export async function rejectEvidence(id, note) {
  const response = await axiosInstance.post(`/operations/tasks/${id}/reject-evidence`, { note });
  return response.data;
}

export async function updateStaffLocation(payload) {
  const response = await axiosInstance.post("/operations/location", payload);
  return response.data;
}

export async function getLiveLocations(params = {}) {
  const response = await axiosInstance.get("/operations/locations", { params });
  return response.data;
}

export async function listWorkers(params = {}) {
  const response = await axiosInstance.get("/operations/workers", { params });
  return response.data;
}

export async function changeComplaintStatus(id, statusData) {
  const { data } = await axiosInstance.patch(`/complaints/${id}/status`, statusData);
  return data;
}
