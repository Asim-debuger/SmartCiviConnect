export const COMPLAINT_TIMELINE_STEPS = [
  "Created",
  "Verified",
  "Assigned Officer",
  "Assigned Staff",
  "Accepted",
  "Work Started",
  "Work In Progress",
  "Proof Uploaded",
  "Under Verification",
  "Completed",
];

export function complaintTimelineIndex(complaint) {
  if (!complaint) return 0;
  if (complaint.status === "Rejected") return 0;
  if (complaint.status === "Completed") return 9;
  if (complaint.status === "Under Verification" || (complaint.operationalStatus === "COMPLETED" && complaint.status !== "Completed")) return 8;
  if ((complaint.workEvidence || []).length) return 7;
  if (complaint.status === "In Progress" || complaint.operationalStatus === "IN_PROGRESS") return 6;
  if (complaint.operationalStatus === "STARTED" || complaint.status === "Work Started") return 5;
  if (complaint.operationalStatus === "ACCEPTED") return 4;
  if (complaint.assignedStaffId || complaint.assignedStaff) return 3;
  if (complaint.status === "Assigned" || complaint.assignedOfficerId || complaint.assignedOfficer) return 2;
  if (complaint.status === "Verified") return 1;
  return 0;
}

export function payloadMatchesComplaint(payload, complaint, routeId) {
  if (!payload || !complaint) return false;
  const candidates = [payload._id, payload.complaintId, payload.id, payload.complaint?._id]
    .filter(Boolean)
    .map(String);
  const known = [complaint._id, complaint.complaintId, routeId].filter(Boolean).map(String);
  if (candidates.some((value) => known.includes(value))) return true;
  if (payload.staffId && complaint.assignedStaffId && String(payload.staffId) === String(complaint.assignedStaffId)) {
    return true;
  }
  return false;
}
