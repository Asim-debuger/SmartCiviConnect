import api from "./axiosInstance";
import { fetchProtectedFile } from "./fileAccess";

export async function listJobs(params = {}) {
  const { data } = await api.get("/jobs", { params });
  return data;
}

export async function getJob(id) {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
}

export async function createJob(payload) {
  const { data } = await api.post("/jobs", payload);
  return data;
}

export async function updateJob(id, payload) {
  const { data } = await api.patch(`/jobs/${id}`, payload);
  return data;
}

export async function applyToJob(id, payload) {
  const { data } = await api.post(`/jobs/${id}/apply`, payload);
  return data;
}

export async function listJobApplications(id, params = {}) {
  const { data } = await api.get(`/jobs/${id}/applications`, { params });
  return data;
}

export async function myApplications() {
  const { data } = await api.get("/jobs/applications/mine");
  return data;
}

export async function getApplication(applicationId) {
  const { data } = await api.get(`/jobs/applications/${applicationId}`);
  return data;
}

export async function updateApplication(applicationId, status, extra = {}) {
  const { data } = await api.patch(`/jobs/applications/${applicationId}`, { status, ...extra });
  return data;
}

export async function updateApplicationMaterials(applicationId, payload) {
  const { data } = await api.patch(`/jobs/applications/${applicationId}/materials`, payload);
  return data;
}

export async function getApplicationResume(applicationId, download = false) {
  return fetchProtectedFile(`/jobs/applications/${applicationId}/resume`, { download });
}

export async function getApplicationDocument(applicationId, index, download = true) {
  return fetchProtectedFile(`/jobs/applications/${applicationId}/documents/${index}`, {
    download,
    params: download ? {} : { download: "0" },
  });
}
