const ROLES = ["Citizen", "Staff", "Officer", "Head Officer", "Admin", "Super Admin"];

function normalizeRole(role) {
  return String(role || "").trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

function isRole(role, ...allowed) {
  const current = normalizeRole(role);
  return allowed.some((item) => normalizeRole(item) === current);
}

function dashboardPath(role) {
  const current = normalizeRole(role);
  if (current === "super admin") return "/super-admin/dashboard";
  if (current === "admin") return "/admin/dashboard";
  if (current === "head officer") return "/head-officer/dashboard";
  if (current === "officer") return "/officer/dashboard";
  if (current === "staff") return "/staff/dashboard";
  return "/citizen/dashboard";
}

const COMPLAINT_STATUSES = ["Pending", "Verified", "Assigned", "In Progress", "Under Verification", "Completed", "Rejected"];

const STATUS_TRANSITIONS = {
  Pending: ["Verified", "Rejected", "Assigned"],
  Verified: ["Assigned", "Rejected"],
  Assigned: ["In Progress", "Rejected"],
  "In Progress": ["Under Verification", "Completed"],
  "Under Verification": ["Completed", "In Progress", "Rejected"],
  Completed: [],
  Rejected: [],
};

const CITIZEN_TIMELINE = ["Created", "Assigned", "Accepted", "Work Started", "Under Verification", "Completed"];

module.exports = {
  ROLES,
  normalizeRole,
  isRole,
  dashboardPath,
  COMPLAINT_STATUSES,
  STATUS_TRANSITIONS,
  CITIZEN_TIMELINE,
};
