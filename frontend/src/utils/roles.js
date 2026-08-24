export function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

export function displayRole(role) {
  const labels = {
    citizen: "Citizen",
    staff: "Staff",
    officer: "Officer",
    "head officer": "Head Officer",
    admin: "Admin",
    "super admin": "Super Admin",
  };
  return labels[normalizeRole(role)] || "Citizen";
}

export function portalLabel(role) {
  const labels = {
    citizen: "Citizen Portal",
    staff: "Staff Portal",
    officer: "Officer Portal",
    "head officer": "Head Officer Portal",
    admin: "Admin Portal",
    "super admin": "Super Admin Portal",
  };
  return labels[normalizeRole(role)] || "Citizen Portal";
}

export function dashboardPath(role) {
  const normalized = normalizeRole(role);
  if (normalized === "super admin") return "/super-admin/dashboard";
  if (normalized === "admin") return "/admin/dashboard";
  if (normalized === "head officer") return "/head-officer/dashboard";
  if (normalized === "officer") return "/officer/dashboard";
  if (normalized === "staff") return "/staff/dashboard";
  return "/citizen/dashboard";
}

export function reportIssuePath(role) {
  return normalizeRole(role) === "citizen" ? "/citizen/create" : dashboardPath(role);
}
