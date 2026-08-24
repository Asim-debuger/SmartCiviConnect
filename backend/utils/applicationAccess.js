const { isRole } = require("./roles");
const { isOpenJob } = require("./jobStatus");
const { ownsResumePublicId, stripResumeSecrets } = require("./resumeAccess");
const { toSkillList, asStoredProfileField, asExperienceYears } = require("./applicationFields");

const REVIEWED_STATUSES = ["Viewed", "Shortlisted", "Interview Scheduled", "Selected", "Joined", "Rejected"];

function actorId(user) {
  if (!user) return "";
  const raw = user._id || user.id || user.userId;
  return raw == null ? "" : String(raw);
}

function canReviewJobApplications(user, job) {
  if (!user) return false;
  if (isRole(user.role, "Admin", "Super Admin")) return true;
  if (job?.createdBy && String(job.createdBy) === actorId(user)) return true;
  return false;
}

function isApplicationLocked(application, job) {
  if (!application) return true;
  if (application.lockedAt) return true;
  if (REVIEWED_STATUSES.includes(application.status)) return true;
  if (job && !isOpenJob(job)) return true;
  return false;
}

function canApplicantUpdate(user, application, job) {
  if (!user || !application) return false;
  const uid = actorId(user);
  if (!uid || String(application.applicantId) !== uid) return false;
  return !isApplicationLocked(application, job);
}

function canAccessApplicationResume(user, application, job) {
  if (!user || !application) return false;
  const uid = actorId(user);
  if (uid && String(application.applicantId) === uid) return true;
  return canReviewJobApplications(user, job);
}

function sanitizeDocuments(docs = []) {
  return (Array.isArray(docs) ? docs : []).map((item, index) => ({
    index,
    name: item.name || item.fileName || `Document ${index + 1}`,
    fileName: item.fileName || "",
    fileType: item.fileType || "",
    uploadedAt: item.uploadedAt || null,
  }));
}

function ownedDocuments(docs, userId) {
  return (Array.isArray(docs) ? docs : []).filter((item) => item?.publicId && ownsResumePublicId(item.publicId, userId)).map((item) => ({
    name: String(item.name || item.fileName || "Document").slice(0, 120),
    fileName: String(item.fileName || "document").slice(0, 180),
    fileType: String(item.fileType || "").toLowerCase(),
    publicId: item.publicId,
    uploadedAt: item.uploadedAt || new Date(),
  }));
}

function buildApplicationSnapshot(user, extras = {}) {
  const skills = toSkillList(extras.skills || user.skills);
  const experience = asStoredProfileField(extras.experience, user.experience);
  const education = asStoredProfileField(extras.education, user.education);
  const certifications = asStoredProfileField(extras.certifications, user.certifications);
  const documents = extras.documents || [];
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    headline: user.headline || "",
    bio: user.bio || "",
    city: user.city || "",
    organization: user.organization || "",
    profileImage: user.profileImage || "",
    skills,
    experience,
    experienceYears: asExperienceYears(extras.experienceYears, user.experienceYears),
    education,
    certifications,
    projects: user.projects || [],
    achievements: user.achievements || [],
    resumeFileName: extras.resumeFileName || user.resumeFileName || "",
    resumeFileType: extras.resumeFileType || user.resumeFileType || "",
    resumeUploadedAt: extras.resumeUploadedAt || user.resumeUploadedAt || null,
    documents: sanitizeDocuments(documents),
  };
}

function toClientApplication(application, { job, user } = {}) {
  const payload = stripResumeSecrets(typeof application.toObject === "function" ? application.toObject() : application);
  if (payload.documents) payload.documents = sanitizeDocuments(payload.documents);
  if (payload.snapshot?.documents) payload.snapshot.documents = sanitizeDocuments(payload.snapshot.documents);
  payload.locked = isApplicationLocked(payload, job || payload.jobId);
  payload.canUpdate = user ? canApplicantUpdate(user, payload, job || payload.jobId) : false;
  return payload;
}

module.exports = {
  REVIEWED_STATUSES,
  canReviewJobApplications,
  isApplicationLocked,
  canApplicantUpdate,
  canAccessApplicationResume,
  sanitizeDocuments,
  ownedDocuments,
  buildApplicationSnapshot,
  toClientApplication,
};
