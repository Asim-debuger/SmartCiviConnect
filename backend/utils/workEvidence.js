const MAX_CAPTURE_AGE_MS = 24 * 60 * 60 * 1000;

function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function sanitizeEvidenceItem(item, { staffId, complaintId } = {}) {
  if (!item?.url) return null;
  const capturedAt = item.capturedAt ? new Date(item.capturedAt) : null;
  return {
    url: String(item.url),
    publicId: item.publicId || "",
    resourceType: item.resourceType === "video" ? "video" : item.resourceType === "raw" ? "raw" : "image",
    phase: ["before", "after", "general"].includes(item.phase) ? item.phase : "after",
    name: String(item.name || "evidence").slice(0, 180),
    capturedAt: capturedAt && !Number.isNaN(capturedAt.getTime()) ? capturedAt : undefined,
    uploadedAt: item.uploadedAt ? new Date(item.uploadedAt) : new Date(),
    latitude: asNumber(item.latitude ?? item.lat),
    longitude: asNumber(item.longitude ?? item.lng),
    duration: asNumber(item.duration),
    staffId: String(item.staffId || staffId || ""),
    complaintId: String(item.complaintId || complaintId || ""),
    source: item.source === "camera" ? "camera" : "upload",
  };
}

function sanitizeEvidenceList(list, ctx) {
  return (Array.isArray(list) ? list : []).map((item) => sanitizeEvidenceItem(item, ctx)).filter(Boolean);
}

function evidenceIsRecent(item) {
  if (!item.capturedAt) return false;
  const age = Date.now() - new Date(item.capturedAt).getTime();
  return age >= 0 && age <= MAX_CAPTURE_AGE_MS;
}

function evidenceHasGps(item) {
  return Number.isFinite(item.latitude) && Number.isFinite(item.longitude);
}

function validateCompletionEvidence(list, { staffId, complaintId }) {
  const items = sanitizeEvidenceList(list, { staffId, complaintId });
  if (!items.length) return { ok: false, message: "Camera photo or video proof is required before submitting completion" };
  const valid = items.some((item) => (
    item.source === "camera"
    && evidenceHasGps(item)
    && evidenceIsRecent(item)
    && String(item.staffId) === String(staffId)
    && String(item.complaintId) === String(complaintId)
  ));
  if (!valid) {
    return { ok: false, message: "Completion proof must be a recent camera capture with live GPS, linked to this assigned complaint" };
  }
  return { ok: true, items };
}

function isApprovedCompletion(complaint) {
  return complaint?.status === "Completed" && Boolean(complaint.verifiedAt || complaint.evidenceStatus === "approved");
}

function redactEvidenceForViewer(complaint, user) {
  if (!complaint) return complaint;
  const copy = { ...complaint };
  const role = user?.role;
  const uid = String(user?._id || user?.id || "");
  const staff = String(copy.assignedStaffId || "") === uid;
  const officer = String(copy.assignedOfficerId || "") === uid;
  const privileged = ["Admin", "Super Admin", "Head Officer"].includes(role) || officer || staff;
  if (privileged || isApprovedCompletion(copy)) return copy;
  copy.workEvidence = [];
  return copy;
}

module.exports = {
  MAX_CAPTURE_AGE_MS,
  sanitizeEvidenceList,
  validateCompletionEvidence,
  isApprovedCompletion,
  redactEvidenceForViewer,
};
