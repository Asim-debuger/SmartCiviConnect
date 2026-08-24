const test = require("node:test");
const assert = require("node:assert/strict");
const { isOpenJob, normalizeApplicationStatus, normalizeJobStatus } = require("../utils/jobStatus");
const { complaintQuery } = require("../utils/complaintQuery");
const { escapeRegex } = require("../utils/escapeRegex");
const { normalizeKind, sanitizePostMedia } = require("../utils/postContent");
const { toSkillList, asStoredProfileField, asExperienceYears } = require("../utils/applicationFields");

test("open jobs reject closed and expired listings", () => {
  assert.equal(isOpenJob({ status: "Open" }), true);
  assert.equal(isOpenJob({ status: "Closed" }), false);
  assert.equal(isOpenJob({ status: "Open", deadline: new Date(Date.now() - 1000) }), false);
});

test("application status aliases map to stored values", () => {
  assert.equal(normalizeApplicationStatus("Interview"), "Interview Scheduled");
  assert.equal(normalizeApplicationStatus("Hired"), "Joined");
  assert.equal(normalizeJobStatus("open"), "Open");
});

test("complaint lookup avoids casting civic ids as ObjectIds", () => {
  const civic = complaintQuery("SCC-1001");
  assert.deepEqual(civic, { complaintId: "SCC-1001" });
  const mongo = complaintQuery("507f1f77bcf86cd799439011");
  assert.ok(mongo.$or);
});

test("regex metacharacters are escaped for directory search", () => {
  assert.equal(escapeRegex("C++ (core)"), "C\\+\\+ \\(core\\)");
});

test("feed kinds outside the schema enum fall back to Community Update", () => {
  assert.equal(normalizeKind("Job Opportunity"), "Job Opportunity");
  assert.equal(normalizeKind("not-a-kind"), "Community Update");
  assert.equal(normalizeKind(" achievement "), "Professional Achievement");
});

test("post media is reduced to url, type, and name", () => {
  const media = sanitizePostMedia([
    { url: "https://cdn.example/a.jpg", publicId: "secret", phase: "general", resourceType: "image", name: "a.jpg" },
    { url: "", name: "skip" },
    { url: "https://cdn.example/cv.pdf", resourceType: "document", name: "cv.pdf" },
  ]);
  assert.equal(media.length, 2);
  assert.deepEqual(media[0], { url: "https://cdn.example/a.jpg", resourceType: "image", name: "a.jpg" });
  assert.equal(media[1].resourceType, "raw");
});

test("job applications coerce skills and ignore empty education strings", () => {
  assert.deepEqual(toSkillList("React, Node"), ["React", "Node"]);
  assert.deepEqual(toSkillList([{ name: "GIS" }]), ["GIS"]);
  assert.deepEqual(asStoredProfileField("", [{ school: "NIT" }]), [{ school: "NIT" }]);
  assert.equal(asExperienceYears("", 4), 4);
  assert.equal(asExperienceYears("oops", 0), 0);
});

const { isApplicationLocked, canApplicantUpdate, canAccessApplicationResume, canReviewJobApplications, sanitizeDocuments } = require("../utils/applicationAccess");

test("application locks after recruiter review, terminal status, or job close", () => {
  assert.equal(isApplicationLocked({ status: "Applied" }, { status: "Open" }), false);
  assert.equal(isApplicationLocked({ status: "Viewed" }, { status: "Open" }), true);
  assert.equal(isApplicationLocked({ status: "Applied", lockedAt: new Date() }, { status: "Open" }), true);
  assert.equal(isApplicationLocked({ status: "Applied" }, { status: "Closed" }), true);
  assert.equal(isApplicationLocked({ status: "Selected" }, { status: "Open" }), true);
});

test("applicant can update only own unlocked application", () => {
  const user = { _id: "u1", role: "Citizen" };
  const app = { applicantId: "u1", status: "Applied" };
  assert.equal(canApplicantUpdate(user, app, { status: "Open" }), true);
  assert.equal(canApplicantUpdate(user, { ...app, status: "Rejected" }, { status: "Open" }), false);
  assert.equal(canApplicantUpdate({ _id: "u2" }, app, { status: "Open" }), false);
});

test("resume access is owner or job recruiter, never public", () => {
  const owner = { _id: "u1", role: "Citizen" };
  const recruiter = { _id: "r1", role: "Head Officer" };
  const other = { _id: "u2", role: "Citizen" };
  const admin = { _id: "a1", role: "Admin" };
  const app = { applicantId: "u1" };
  const job = { createdBy: "r1" };
  assert.equal(canAccessApplicationResume(owner, app, job), true);
  assert.equal(canAccessApplicationResume(recruiter, app, job), true);
  assert.equal(canAccessApplicationResume(admin, app, job), true);
  assert.equal(canAccessApplicationResume(other, app, job), false);
  assert.equal(canReviewJobApplications(recruiter, { createdBy: "someone-else" }), false);
  assert.equal(canReviewJobApplications(admin, { createdBy: "someone-else" }), true);
  assert.deepEqual(sanitizeDocuments([{ publicId: "secret", fileName: "id.pdf", name: "ID" }]), [
    { index: 0, name: "ID", fileName: "id.pdf", fileType: "", uploadedAt: null },
  ]);
});

test("application payloads expose hasResume from filename even when publicId is stripped", () => {
  const { stripResumeSecrets } = require("../utils/resumeAccess");
  const hidden = stripResumeSecrets({
    resumePublicId: "smartciviconnect/resumes/u1/file",
    resumeFileName: "cv.pdf",
    resumeFileType: "pdf",
    snapshot: { resumeFileName: "cv.pdf" },
  });
  assert.equal(hidden.hasResume, true);
  assert.equal(hidden.resumePublicId, undefined);
  assert.equal(hidden.resumeFileName, "cv.pdf");
});

test("resume delivery metadata never includes a Cloudinary URL", () => {
  const { cloudinaryMessage, mimeForResume, resumeMeta } = require("../utils/resumeAccess");
  assert.match(cloudinaryMessage({ message: "Customer is marked as untrusted: show_original_customer_untrusted" }), /stream/i);
  assert.equal(mimeForResume("cv.pdf", "pdf"), "application/pdf");
  const meta = resumeMeta("cv.pdf", "pdf");
  assert.equal(meta.delivery, "proxy");
  assert.equal(meta.url, undefined);
  assert.equal(meta.success, true);
});

test("network profiles expose id and never leak resume or payment fields", () => {
  const { toSafeNetworkProfile } = require("../utils/networkProfile");
  const other = toSafeNetworkProfile({
    _id: "abc123",
    name: "Pat",
    email: "pat@example.com",
    phone: "999",
    resumePublicId: "secret",
    resumeUrl: "https://res.cloudinary.com/x/raw/upload/cv.pdf",
    paymentProfile: { last4: "1234" },
    headline: "Electrician",
  }, { isSelf: false });
  assert.equal(other.id, "abc123");
  assert.equal(other._id, "abc123");
  assert.equal(other.email, undefined);
  assert.equal(other.resumePublicId, undefined);
  assert.equal(other.resumeUrl, undefined);
  assert.equal(other.paymentProfile, undefined);
  const mine = toSafeNetworkProfile({
    _id: "abc123",
    email: "pat@example.com",
    resumeFileName: "cv.pdf",
    resumePublicId: "folder/file",
  }, { isSelf: true });
  assert.equal(mine.email, "pat@example.com");
  assert.equal(mine.hasResume, true);
  assert.equal(mine.resumePublicId, undefined);
});
