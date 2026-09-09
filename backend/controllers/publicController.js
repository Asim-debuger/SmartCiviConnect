const mongoose = require("mongoose");
const { sendEmail, supportInbox } = require("../services/emailService");
const rateLimit = require("express-rate-limit");
const { Job, Application } = require("../models/Job");
const User = require("../models/User");
const Follow = require("../models/Follow");
const Connection = require("../models/Connection");
const Complaint = require("../models/Complaint");
const Post = require("../models/Post");
const { sanitizeProfileImage } = require("../utils/profileImage");
const { toSafeNetworkProfile } = require("../utils/networkProfile");
const { expireOverdueJobs, OPEN_JOB_STATUS, jobTypeFilter } = require("../utils/jobStatus");
const { escapeRegex } = require("../utils/escapeRegex");
const { sharedFromPopulate } = require("../utils/postShare");

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

const contactLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  limit: 8, 
  standardHeaders: true, 
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for localhost during development
    const isLocalhost = req.hostname === 'localhost' || 
                        req.hostname === '127.0.0.1' || 
                        req.ip === '127.0.0.1' || 
                        req.ip === '::1';
    const isDevelopment = process.env.NODE_ENV !== 'production';
    return isLocalhost && isDevelopment;
  }
});

async function submitContact(req, res, next) {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim();
    const phone = String(req.body?.phone || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length > 2000 || name.length > 120) {
      return res.status(400).json({ success: false, message: "Please provide a valid name, email, and message." });
    }

    const destination = supportInbox();
    
    // Send email asynchronously - don't block the response
    sendEmail({
      to: destination,
      subject: `Public website contact from ${name}`,
      html: `<h2>New SmartCiviConnect enquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p><p><strong>Message:</strong></p><p>${escapeHtml(message)}</p>`,
      replyTo: email,
    }).catch((emailError) => {
      console.error("Email service error (non-blocking):", emailError.message);
      // Log but don't fail the request
    });

    return res.json({ success: true, message: "Message received successfully" });
  } catch (error) {
    next(error);
  }
}

async function listPublicJobs(req, res, next) {
  try {
    await expireOverdueJobs(Job);
    const { location, skill, department, type, search } = req.query;
    const query = { status: OPEN_JOB_STATUS };
    if (location) query.location = new RegExp(escapeRegex(location), "i");
    if (department && department !== "All") query.department = new RegExp(escapeRegex(department), "i");
    const typeFilter = jobTypeFilter(type);
    if (typeFilter) query.type = typeFilter;
    if (skill) query.skillsRequired = new RegExp(escapeRegex(skill), "i");
    if (req.query.experience) query.experience = new RegExp(escapeRegex(req.query.experience), "i");
    if (req.query.workplace && req.query.workplace !== "All") query.workplace = req.query.workplace;
    if (search) query.$or = [{ title: new RegExp(escapeRegex(search), "i") }, { description: new RegExp(escapeRegex(search), "i") }];
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(40, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).select("-createdBy").lean(),
      Job.countDocuments(query),
    ]);
    const counts = await Application.aggregate([
      { $match: { jobId: { $in: jobs.map((item) => item._id) } } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(counts.map((item) => [String(item._id), item.count]));
    res.json({
      success: true,
      page,
      total,
      hasMore: skip + jobs.length < total,
      jobs: jobs.map((job) => ({ ...job, applicantCount: map[String(job._id)] || 0 })),
    });
  } catch (error) { next(error); }
}

async function listPublicProfessionals(req, res, next) {
  try {
    const { search, role, department, skill, location } = req.query;
    const query = { active: { $ne: false }, role: { $in: ["Staff", "Officer", "Head Officer", "Citizen"] } };
    if (role && role !== "All") query.role = role;
    if (department && department !== "All") query.department = new RegExp(escapeRegex(department), "i");
    if (skill) query.skills = new RegExp(escapeRegex(skill), "i");
    if (location) query.city = new RegExp(escapeRegex(location), "i");
    if (search) {
      query.$or = [
        { name: new RegExp(escapeRegex(search), "i") },
        { skills: new RegExp(escapeRegex(search), "i") },
        { headline: new RegExp(escapeRegex(search), "i") },
        { department: new RegExp(escapeRegex(search), "i") },
      ];
    }
    const people = await User.find(query)
      .select("name username role headline skills city department profileImage availability experienceYears")
      .limit(60)
      .lean();
    res.json({ success: true, people: people.map((person) => toSafeNetworkProfile(person, { isSelf: false })) });
  } catch (error) { next(error); }
}

async function getPublicProfessional(req, res, next) {
  try {
    const key = req.params.id;
    const query = mongoose.isValidObjectId(key)
      ? { $or: [{ _id: key }, { username: String(key).toLowerCase() }] }
      : { username: String(key).toLowerCase() };
    const user = await User.findOne(query)
      .select("name username role headline bio skills city department organization profileImage availability experienceYears experience education certifications achievements projects")
      .lean();
    if (!user) return res.status(404).json({ success: false, message: "Profile not found" });
    const [followers, connections, completedWorks] = await Promise.all([
      Follow.countDocuments({ following: user._id }),
      Connection.countDocuments({ status: "Accepted", $or: [{ requester: user._id }, { recipient: user._id }] }),
      Complaint.countDocuments({ assignedStaffId: String(user._id), status: "Completed" }),
    ]);
    res.json({ success: true, profile: { ...toSafeNetworkProfile(user, { isSelf: false }), completedWorks }, stats: { followers, connections, completedWorks } });
  } catch (error) { next(error); }
}

async function getPublicJob(req, res, next) {
  try {
    await expireOverdueJobs(Job);
    const job = await Job.findOne({ _id: req.params.id, status: OPEN_JOB_STATUS }).lean();
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    const applicantCount = await Application.countDocuments({ jobId: job._id });
    let recruiter = null;
    if (job.createdBy) {
      recruiter = await User.findById(job.createdBy).select("name role headline department profileImage").lean();
      if (recruiter) recruiter.profileImage = sanitizeProfileImage(recruiter.profileImage);
    }
    delete job.createdBy;
    res.json({ success: true, job: { ...job, applicantCount, recruiter } });
  } catch (error) { next(error); }
}

async function platformStats(req, res, next) {
  try {
    const [complaints, completed, pending, inProgress, people, jobs] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Completed" }),
      Complaint.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: { $in: ["Assigned", "In Progress", "Verified", "Under Verification"] } }),
      User.countDocuments({ active: { $ne: false } }),
      Job.countDocuments({ status: OPEN_JOB_STATUS }),
    ]);
    res.json({ success: true, stats: { complaints, completed, pending, inProgress, people, jobs } });
  } catch (error) { next(error); }
}

async function featured(req, res, next) {
  try {
    const [jobs, people] = await Promise.all([
      Job.find({ status: OPEN_JOB_STATUS }).sort({ createdAt: -1 }).limit(4).select("-createdBy").lean(),
      User.find({ active: { $ne: false }, role: { $in: ["Staff", "Officer", "Head Officer", "Citizen"] }, headline: { $ne: "" } })
        .select("name username role headline city department profileImage skills")
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean(),
    ]);
    res.json({
      success: true,
      jobs,
      professionals: people.map((person) => ({ ...person, profileImage: sanitizeProfileImage(person.profileImage) })),
    });
  } catch (error) { next(error); }
}

async function getPublicPost(req, res, next) {
  try {
    const post = await Post.findOne({ _id: req.params.id, visibility: { $ne: "connections" } })
      .populate("author", "name role headline profileImage username")
      .populate(sharedFromPopulate())
      .lean();
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, post });
  } catch (error) { next(error); }
}

async function listPublicPosts(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 12, 30);
    const posts = await Post.find({ visibility: { $ne: "connections" } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "name role headline profileImage username")
      .populate(sharedFromPopulate())
      .lean();
    res.json({ success: true, posts });
  } catch (error) { next(error); }
}

module.exports = { submitContact, contactLimiter, listPublicJobs, listPublicProfessionals, getPublicProfessional, getPublicJob, platformStats, featured, listPublicPosts, getPublicPost };
