const { Job, Application } = require("../models/Job");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const { writeAudit } = require("../services/auditService");
const { createNotification } = require("../services/notificationService");
const { sendEmail } = require("../services/emailService");
const { isRole } = require("../utils/roles");
const { sanitizeProfileImage } = require("../utils/profileImage");
const { APPLICATION_STATUSES, OPEN_JOB_STATUS, JOB_STATUSES, expireOverdueJobs, isOpenJob, normalizeApplicationStatus, normalizeJobStatus, jobTypeFilter } = require("../utils/jobStatus");
const { fetchResumeBuffer, sendResumeBuffer, resumeMeta, cloudinaryMessage } = require("../utils/resumeAccess");
const { escapeRegex } = require("../utils/escapeRegex");
const mongoose = require("mongoose");
const { toSkillList, asStoredProfileField, asExperienceYears } = require("../utils/applicationFields");
const {
  canReviewJobApplications,
  canApplicantUpdate,
  canAccessApplicationResume,
  ownedDocuments,
  buildApplicationSnapshot,
  toClientApplication,
} = require("../utils/applicationAccess");

const JOB_POPULATE = "title description department organization type location workplace salaryMin salaryMax skillsRequired deadline status createdBy";
const APPLICANT_PROFILE = "name headline bio city organization profileImage skills experienceYears experience education certifications projects achievements username role";

async function lockIfRecruiterViews(application, req, job) {
  if (String(application.applicantId) === req.auth.userId) return application;
  if (!canReviewJobApplications(req.user, job)) return application;
  if (application.lockedAt || application.status !== "Applied") return application;
  application.status = "Viewed";
  application.reviewedAt = new Date();
  application.reviewedBy = req.auth.userId;
  application.lockedAt = new Date();
  await application.save();
  return application;
}

function sortApplications(sort) {
  if (sort === "skills") return { skills: 1, createdAt: -1 };
  if (sort === "experience") return { experienceYears: -1, createdAt: -1 };
  if (sort === "status") return { status: 1, createdAt: -1 };
  return { createdAt: -1 };
}

async function withApplicantCounts(jobs) {
  const ids = jobs.map((job) => job._id);
  const counts = await Application.aggregate([
    { $match: { jobId: { $in: ids } } },
    { $group: { _id: "$jobId", count: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(counts.map((item) => [String(item._id), item.count]));
  return jobs.map((job) => ({ ...job, applicantCount: map[String(job._id)] || 0 }));
}

exports.listJobs = async (req, res, next) => {
  try {
    const { location, skill, department, type, search } = req.query;
    await expireOverdueJobs(Job);
    const query = isRole(req.auth.role, "Admin", "Super Admin")
      ? {}
      : isRole(req.auth.role, "Head Officer")
        ? { createdBy: req.auth.userId }
        : { status: OPEN_JOB_STATUS };
    if (location) query.location = new RegExp(escapeRegex(location), "i");
    if (department && department !== "All") query.department = department;
    const typeFilter = jobTypeFilter(type);
    if (typeFilter) query.type = typeFilter;
    if (skill) query.skillsRequired = new RegExp(escapeRegex(skill), "i");
    if (search) query.$or = [{ title: new RegExp(escapeRegex(search), "i") }, { description: new RegExp(escapeRegex(search), "i") }];
    if (req.query.experience) query.experience = new RegExp(escapeRegex(req.query.experience), "i");
    if (req.query.workplace && req.query.workplace !== "All") query.workplace = req.query.workplace;
    if (req.query.salaryMin) query.salaryMax = { $gte: Number(req.query.salaryMin) };
    const jobs = await Job.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, jobs: await withApplicantCounts(jobs) });
  } catch (error) { next(error); }
};

exports.getJob = async (req, res, next) => {
  try {
    await expireOverdueJobs(Job);
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    const applicantCount = await Application.countDocuments({ jobId: job._id });
    let recruiter = null;
    if (job.createdBy) {
      recruiter = await User.findById(job.createdBy).select("name role headline department profileImage").lean();
      if (recruiter) recruiter.profileImage = sanitizeProfileImage(recruiter.profileImage);
    }
    res.json({ success: true, job: { ...job, applicantCount, recruiter } });
  } catch (error) { next(error); }
};

exports.createJob = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin", "Head Officer")) {
      return res.status(403).json({ success: false, message: "Not authorized to post jobs" });
    }
    const { title, description } = req.body;
    const department = req.body.department || req.body.department;
    if (!title || !description || !department) return res.status(400).json({ success: false, message: "Title, description and department are required" });
    const skillsRequired = Array.isArray(req.body.skillsRequired || req.body.skillsRequired)
      ? (req.body.skillsRequired || req.body.skillsRequired)
      : String(req.body.skillsRequired || req.body.skillsRequired || "").split(",").map((item) => item.trim()).filter(Boolean);
    const job = await Job.create({
      title,
      description,
      department,
      location: req.body.location,
      skillsRequired,
      salaryMin: req.body.salaryMin,
      salaryMax: req.body.salaryMax,
      experience: req.body.experience,
      education: req.body.education || "",
      certifications: req.body.certifications || "",
      deadline: req.body.deadline || req.body.deadline || undefined,
      organization: req.body.organization,
      workplace: req.body.workplace || req.body.workplace || "On-site",
      type: req.body.type || "Full time",
      requiredDocuments: Array.isArray(req.body.requiredDocuments || req.body.requiredDocuments)
        ? (req.body.requiredDocuments || req.body.requiredDocuments)
        : String(req.body.requiredDocuments || req.body.requiredDocuments || "").split(",").map((item) => item.trim()).filter(Boolean),
      createdBy: req.auth.userId,
      status: JOB_STATUSES.includes(normalizeJobStatus(req.body.status || OPEN_JOB_STATUS))
        ? normalizeJobStatus(req.body.status || OPEN_JOB_STATUS)
        : OPEN_JOB_STATUS,
    });
    await writeAudit({ actorId: req.auth.userId, action: "job.create", targetType: "Job", targetId: String(job._id) });
    res.status(201).json({ success: true, job });
  } catch (error) { next(error); }
};

exports.updateJob = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin", "Head Officer")) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    const allowed = ["title", "description", "department", "location", "skillsRequired", "salaryMin", "salaryMax", "experience", "education", "certifications", "deadline", "organization", "workplace", "type", "requiredDocuments", "status"];
    const payload = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    }
    if (payload.status) payload.status = normalizeJobStatus(payload.status);
    const job = await Job.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (error) { next(error); }
};

exports.apply = async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ success: false, message: "Login or register to apply for this job" });
    }
    await expireOverdueJobs(Job);
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    const openCheck = { status: normalizeJobStatus(job.status), deadline: job.deadline };
    if (!isOpenJob(openCheck)) return res.status(400).json({ success: false, message: "This job is not open for applications" });
    if (job.deadline && new Date(job.deadline) < new Date()) return res.status(400).json({ success: false, message: "This job is past its deadline" });
    const applicantId = String(req.auth.userId);
    const existing = await Application.findOne({ jobId: job._id, applicantId });
    if (existing) return res.status(409).json({ success: false, message: "You have already applied for this job" });
    const applicant = await User.findById(applicantId).select("+resumePublicId resumeFileName resumeFileType resumeUploadedAt name email skills experience experienceYears education certifications role headline bio city organization profileImage projects achievements");
    const user = applicant || req.user;
    const resumePublicId = user.resumePublicId || "";
    const resumeFileName = user.resumeFileName || "";
    const resumeFileType = user.resumeFileType || "";
    const resumeUploadedAt = user.resumeUploadedAt || new Date();
    if (!resumePublicId) return res.status(400).json({ success: false, message: "Upload a PDF, DOC, or DOCX resume on your profile before applying" });
    const completedWorks = await Complaint.countDocuments({ assignedStaffId: req.auth.userId, status: "Completed" });
    const skills = toSkillList(req.body.skills || user.skills);
    const experience = asStoredProfileField(req.body.experience, user.experience);
    const education = asStoredProfileField(req.body.education, user.education);
    const certifications = asStoredProfileField(req.body.certifications, user.certifications);
    const experienceYears = asExperienceYears(req.body.experienceYears, user.experienceYears);
    const documents = ownedDocuments(req.body.documents, applicantId);
    const snapshot = buildApplicationSnapshot(user, {
      skills,
      experience,
      education,
      certifications,
      experienceYears,
      resumeFileName,
      resumeFileType,
      resumeUploadedAt,
      documents,
    });
    const application = await Application.create({
      jobId: job._id,
      applicantId,
      name: user.name,
      email: user.email,
      resumePublicId,
      resumeFileName,
      resumeFileType,
      resumeUploadedAt,
      coverLetter: req.body.coverLetter,
      skills,
      experience,
      experienceYears,
      education,
      certifications,
      documents,
      snapshot,
      completedWorks,
    });
    await createNotification({
      userId: req.auth.userId,
      type: "application",
      category: "application",
      title: "Application submitted",
      message: `You applied for ${job.title}.`,
      link: "/jobs",
      email: false,
    }, req.app.get("io"));
    if (job.createdBy) {
      await createNotification({
        userId: job.createdBy,
        type: "application",
        category: "application",
        title: "New job application",
        message: `${user.name} applied for ${job.title}.`,
        link: "/admin/jobs",
      }, req.app.get("io"));
    }
    res.status(201).json({ success: true, application: toClientApplication(application, { job, user: req.user }) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "You have already applied for this job" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message || "Application details are incomplete. Upload a resume and complete your profile." });
    }
    next(error);
  }
};

exports.listApplications = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: "Job is required" });
    }
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (!canReviewJobApplications(req.user, job)) {
      return res.status(403).json({ success: false, message: "You can only manage applications for your own jobs" });
    }
    const query = { jobId: job._id };
    if (req.query.status && req.query.status !== "All") query.status = normalizeApplicationStatus(req.query.status);
    if (req.query.q) {
      const needle = new RegExp(escapeRegex(req.query.q), "i");
      query.$or = [{ name: needle }, { email: needle }, { skills: needle }];
    }
    if (req.query.experienceMin) query.experienceYears = { $gte: Number(req.query.experienceMin) || 0 };
    const applications = await Application.find(query).select("+resumePublicId").sort(sortApplications(req.query.sort)).lean();
    const ids = [...new Set(applications.map((item) => item.applicantId).filter((id) => id && mongoose.isValidObjectId(id)))];
    const people = await User.find({ _id: { $in: ids } }).select(APPLICANT_PROFILE).lean();
    const byId = Object.fromEntries(people.map((person) => [String(person._id), person]));
    res.json({
      success: true,
      job: { _id: job._id, title: job.title, status: job.status, createdBy: job.createdBy },
      applications: applications.map((item) => ({
        ...toClientApplication(item, { job, user: req.user }),
        applicant: byId[String(item.applicantId)] || null,
      })),
    });
  } catch (error) { next(error); }
};

exports.myApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      applicantId: { $in: [req.auth.userId, String(req.auth.userId)] },
    }).select("+resumePublicId").sort({ createdAt: -1 }).populate("jobId", JOB_POPULATE).lean();
    res.json({
      success: true,
      applications: applications.map((item) => toClientApplication(item, { job: item.jobId, user: req.user })),
    });
  } catch (error) { next(error); }
};

exports.getApplication = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.applicationId)) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    const application = await Application.findById(req.params.applicationId).select("+resumePublicId").populate("jobId", JOB_POPULATE);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    const job = application.jobId && typeof application.jobId === "object" ? application.jobId : await Job.findById(application.jobId).lean();
    const owner = String(application.applicantId) === req.auth.userId;
    const recruiter = canReviewJobApplications(req.user, job);
    if (!owner && !recruiter) {
      return res.status(403).json({ success: false, message: "Not authorized to view this application" });
    }
    if (recruiter) await lockIfRecruiterViews(application, req, job);
    const applicant = await User.findById(application.applicantId).select(APPLICANT_PROFILE).lean();
    res.json({
      success: true,
      application: {
        ...toClientApplication(application, { job, user: req.user }),
        applicant: recruiter ? applicant : undefined,
      },
    });
  } catch (error) { next(error); }
};

exports.updateApplicationMaterials = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.applicationId).select("+resumePublicId");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    const job = await Job.findById(application.jobId);
    if (!canApplicantUpdate(req.user, application, job)) {
      return res.status(403).json({ success: false, message: "This application is locked and can no longer be updated" });
    }
    const applicant = await User.findById(req.auth.userId).select("+resumePublicId resumeFileName resumeFileType resumeUploadedAt name email skills experience experienceYears education certifications role headline bio city organization profileImage projects achievements");
    if (req.body.resumePublicId) {
      const { ownsResumePublicId, resumeTypeFromFile, isAllowedResumeType } = require("../utils/resumeAccess");
      if (!ownsResumePublicId(req.body.resumePublicId, req.auth.userId)) {
        return res.status(400).json({ success: false, message: "Invalid resume upload" });
      }
      const fileType = resumeTypeFromFile(req.body.resumeFileName, req.body.resumeFileType) || String(req.body.resumeFileType || "").toLowerCase();
      if (!isAllowedResumeType(fileType)) {
        return res.status(400).json({ success: false, message: "Resume must be PDF, DOC, or DOCX" });
      }
      application.resumePublicId = req.body.resumePublicId;
      application.resumeFileName = String(req.body.resumeFileName || "resume").slice(0, 180);
      application.resumeFileType = fileType;
      application.resumeUploadedAt = req.body.resumeUploadedAt || new Date();
    } else if (applicant?.resumePublicId) {
      application.resumePublicId = applicant.resumePublicId;
      application.resumeFileName = applicant.resumeFileName;
      application.resumeFileType = applicant.resumeFileType;
      application.resumeUploadedAt = applicant.resumeUploadedAt;
    }
    if (req.body.coverLetter !== undefined) application.coverLetter = req.body.coverLetter;
    if (req.body.skills !== undefined) application.skills = toSkillList(req.body.skills);
    if (req.body.experience !== undefined) application.experience = asStoredProfileField(req.body.experience, applicant.experience);
    if (req.body.education !== undefined) application.education = asStoredProfileField(req.body.education, applicant.education);
    if (req.body.certifications !== undefined) application.certifications = asStoredProfileField(req.body.certifications, applicant.certifications);
    if (req.body.experienceYears !== undefined) application.experienceYears = asExperienceYears(req.body.experienceYears, applicant.experienceYears);
    if (Array.isArray(req.body.documents)) {
      const incoming = ownedDocuments(req.body.documents, req.auth.userId);
      if (incoming.length) {
        const existing = application.documents || [];
        const byId = new Map(existing.filter((item) => item?.publicId).map((item) => [item.publicId, item]));
        incoming.forEach((item) => byId.set(item.publicId, item));
        application.documents = [...byId.values()];
      }
    }
    application.name = applicant.name;
    application.email = applicant.email;
    application.snapshot = buildApplicationSnapshot(applicant, {
      skills: application.skills,
      experience: application.experience,
      education: application.education,
      certifications: application.certifications,
      experienceYears: application.experienceYears,
      resumeFileName: application.resumeFileName,
      resumeFileType: application.resumeFileType,
      resumeUploadedAt: application.resumeUploadedAt,
      documents: application.documents,
    });
    await application.save();
    res.json({ success: true, application: toClientApplication(application, { job, user: req.user }) });
  } catch (error) { next(error); }
};

exports.updateApplication = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin", "Head Officer")) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    const application = await Application.findById(req.params.applicationId);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    const job = await Job.findById(application.jobId);
    if (!canReviewJobApplications(req.user, job)) {
      return res.status(403).json({ success: false, message: "You can only manage applications for your own jobs" });
    }
    const status = normalizeApplicationStatus(req.body.status === "Hired" ? "Joined" : req.body.status);
    if (!APPLICATION_STATUSES.includes(status)) return res.status(400).json({ success: false, message: "Invalid application status" });
    application.status = status;
    if (!application.lockedAt) application.lockedAt = new Date();
    if (!application.reviewedAt) {
      application.reviewedAt = new Date();
      application.reviewedBy = req.auth.userId;
    }
    if (req.body.interviewAt) application.interviewAt = req.body.interviewAt;
    if (req.body.recruiterNote !== undefined) application.recruiterNote = req.body.recruiterNote;
    await application.save();
    const titles = {
      Shortlisted: "You were shortlisted",
      "Interview Scheduled": "Interview scheduled",
      Selected: "You were selected",
      Joined: "Welcome aboard",
      Rejected: "Application update",
      Viewed: "Application viewed",
    };
    await createNotification({
      userId: application.applicantId,
      type: "application",
      category: "application",
      title: titles[status] || "Application update",
      message: status === "Interview Scheduled" && application.interviewAt
        ? `Interview for ${job?.title || "a role"} is scheduled for ${new Date(application.interviewAt).toLocaleString()}.`
        : `Your application for ${job?.title || "a role"} is now ${status}.`,
      link: "/jobs",
    }, req.app.get("io"));
    const applicant = await User.findById(application.applicantId).select("name email").lean();
    if (applicant?.email) {
      const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
      await sendEmail({
        to: applicant.email,
        subject: `Application update: ${job?.title || "civic role"}`,
        html: `<p>Hi ${applicant.name || "applicant"},</p><p>Your application for <strong>${job?.title || "a civic role"}</strong> is now <strong>${status}</strong>.</p>${application.interviewAt ? `<p>Interview: ${new Date(application.interviewAt).toLocaleString()}</p>` : ""}${application.recruiterNote ? `<p>${application.recruiterNote}</p>` : ""}<p><a href="${frontend}/jobs">Open jobs dashboard</a></p>`,
      }).catch((error) => console.error("Application email failed", error.message));
    }
    res.json({ success: true, application: toClientApplication(application, { job, user: req.user }) });
  } catch (error) { next(error); }
};

exports.accessApplicationResume = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.applicationId)) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    const application = await Application.findById(req.params.applicationId).select("+resumePublicId");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    const job = await Job.findById(application.jobId).lean();
    if (!canAccessApplicationResume(req.user, application, job)) {
      return res.status(403).json({ success: false, message: "You are not authorized to view this resume" });
    }
    await lockIfRecruiterViews(application, req, job);
    if (!application.resumePublicId) return res.status(404).json({ success: false, message: "No resume on file for this application" });
    if (req.query.file === "1") {
      const file = await fetchResumeBuffer({
        publicId: application.resumePublicId,
        fileName: application.resumeFileName,
        fileType: application.resumeFileType,
      });
      return sendResumeBuffer(res, file, { download: req.query.download === "1" });
    }
    res.json(resumeMeta(application.resumeFileName, application.resumeFileType));
  } catch (error) {
    error.message = cloudinaryMessage(error);
    next(error);
  }
};

exports.accessApplicationDocument = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.applicationId)) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    const application = await Application.findById(req.params.applicationId);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    const job = await Job.findById(application.jobId).lean();
    if (!canAccessApplicationResume(req.user, application, job)) {
      return res.status(403).json({ success: false, message: "You are not authorized to view this document" });
    }
    await lockIfRecruiterViews(application, req, job);
    const doc = (application.documents || [])[Number(req.params.index)];
    if (!doc?.publicId) return res.status(404).json({ success: false, message: "Document not found" });
    if (req.query.file === "1") {
      const file = await fetchResumeBuffer({
        publicId: doc.publicId,
        fileName: doc.fileName,
        fileType: doc.fileType,
      });
      return sendResumeBuffer(res, file, { download: req.query.download !== "0" });
    }
    res.json(resumeMeta(doc.fileName, doc.fileType, { name: doc.name }));
  } catch (error) {
    error.message = cloudinaryMessage(error);
    next(error);
  }
};
