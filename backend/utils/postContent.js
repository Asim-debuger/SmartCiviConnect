const KIND_ALIASES = {
  post: "Community Update",
  update: "Work Update",
  achievement: "Professional Achievement",
  work: "Work Update",
  Achievement: "Professional Achievement",
  Job: "Job Opportunity",
  Community: "Community Update",
  Announcement: "Announcement",
  Project: "Project",
  project: "Project",
};

const ALLOWED_KINDS = new Set([
  "Professional Achievement",
  "Work Update",
  "Job Opportunity",
  "Community Update",
  "Announcement",
  "Project",
  "Achievement",
  "Job",
  "Community",
  "post",
  "update",
  "achievement",
  "work",
]);

function normalizeKind(kind) {
  const raw = String(kind || "").trim();
  const mapped = KIND_ALIASES[raw] || raw || "Community Update";
  return ALLOWED_KINDS.has(mapped) ? mapped : "Community Update";
}

function sanitizePostMedia(media) {
  if (!Array.isArray(media)) return [];
  return media.map((item) => {
    if (!item || typeof item !== "object") return null;
    const url = String(item.url || "").trim();
    if (!url) return null;
    let resourceType = String(item.resourceType || "image").toLowerCase();
    if (resourceType === "document" || resourceType === "file") resourceType = "raw";
    if (!["image", "video", "raw"].includes(resourceType)) resourceType = "image";
    return {
      url,
      resourceType,
      name: String(item.name || "").slice(0, 200),
    };
  }).filter(Boolean);
}

module.exports = { normalizeKind, sanitizePostMedia, ALLOWED_KINDS };
