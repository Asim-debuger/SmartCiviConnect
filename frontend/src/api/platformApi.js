import api from "./axiosInstance";

export async function listDepartments() {
  const { data } = await api.get("/departments");
  return data;
}

export async function createDepartment(payload) {
  const { data } = await api.post("/departments", payload);
  return data;
}

export async function updateDepartment(id, payload) {
  const { data } = await api.patch(`/departments/${id}`, payload);
  return data;
}

export async function assignDepartmentOfficer(id, officerId) {
  const { data } = await api.post(`/departments/${id}/officers`, { officerId });
  return data;
}

export async function getAnalytics() {
  const { data } = await api.get("/analytics");
  return data;
}

export async function getAuditLogs() {
  const { data } = await api.get("/audit-logs");
  return data;
}

export async function getDepartmentOverview() {
  const { data } = await api.get("/operations/department/overview");
  return data;
}

export async function listPayments(params = {}) {
  const { data } = await api.get("/payments", { params });
  return data;
}

export async function getPayment(id) {
  const { data } = await api.get(`/payments/${id}`);
  return data;
}

export async function createPayment(payload) {
  const { data } = await api.post("/payments", payload);
  return data;
}

export async function approvePayment(id) {
  const { data } = await api.post(`/payments/${id}/approve`);
  return data;
}

export async function createPaymentOrder(id) {
  const { data } = await api.post(`/payments/${id}/order`);
  return data;
}

export async function initiatePayment(id) {
  const { data } = await api.post(`/payments/${id}/initiate`);
  return data;
}

export async function cancelPayment(id, reason) {
  const { data } = await api.post(`/payments/${id}/cancel`, { reason });
  return data;
}

export async function failPayment(id, reason) {
  const { data } = await api.post(`/payments/${id}/fail`, { reason });
  return data;
}

export async function refundPayment(id) {
  const { data } = await api.post(`/payments/${id}/refund`);
  return data;
}

export async function verifyPayment(payload) {
  const { data } = await api.post("/payments/verify", payload);
  return data;
}

export async function getPaymentSummary() {
  const { data } = await api.get("/payments/summary");
  return data;
}

export async function getPaymentInvoice(id) {
  const { data } = await api.get(`/payments/${id}/invoice`);
  return data;
}

export function printInvoiceHtml(html) {
  const win = window.open("", "invoice");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
