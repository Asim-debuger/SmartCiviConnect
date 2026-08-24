const User = require("../models/User");
const { ROLES, isRole } = require("../utils/roles");
const { writeAudit } = require("../services/auditService");
const { createNotification, notifyRoles } = require("../services/notificationService");
const { sendRoleUpdatedEmail } = require("../services/emailService");

const { sanitizeProfileImage } = require("../utils/profileImage");
const { ownsResumePublicId, resumeTypeFromFile, isAllowedResumeType, fetchResumeBuffer, sendResumeBuffer, resumeMeta, cloudinaryMessage } = require("../utils/resumeAccess");
const { escapeRegex } = require("../utils/escapeRegex");
const { encryptField, decryptField } = require("../utils/fieldCrypto");
const { validatePaymentProfileInput, maskName, toSummary } = require("../utils/paymentProfile");

function toSafeUser(user) {
  const source = typeof user.toObject === "function" ? user.toObject() : user;
  return {
    id: source._id.toString(),
    name: source.name,
    email: source.email,
    username: source.username || "",
    role: source.role,
    profileImage: sanitizeProfileImage(source.profileImage),
    phone: source.phone || "",
    department: source.department || "",
    skills: source.skills || [],
    availability: source.availability || "Available",
    headline: source.headline || "",
    bio: source.bio || "",
    city: source.city || "",
    organization: source.organization || "",
    experienceYears: source.experienceYears || 0,
    experience: source.experience || [],
    education: source.education || [],
    certifications: source.certifications || [],
    achievements: source.achievements || [],
    projects: source.projects || [],
    hasResume: Boolean(source.resumePublicId),
    resumeFileName: source.resumeFileName || "",
    resumeFileType: source.resumeFileType || "",
    resumeUploadedAt: source.resumeUploadedAt || null,
    locationSharing: Boolean(source.locationSharing),
    active: source.active !== false,
  };
}

const WORKFORCE_ROLES = ["Staff", "Officer", "Head Officer"];

function canManageOwnPayout(role) {
  return isRole(role, ...WORKFORCE_ROLES);
}

function toFullPaymentProfile(profile) {
  if (!profile?.accountNumberEnc) return { ...toSummary(profile), accountNumber: "", accountHolderName: "", ifsc: "", bankName: "", phone: "" };
  return {
    ...toSummary(profile),
    accountNumber: decryptField(profile.accountNumberEnc),
    accountHolderName: decryptField(profile.accountHolderEnc),
    ifsc: decryptField(profile.ifscEnc),
    bankName: decryptField(profile.bankNameEnc) || profile.bankNameDisplay || "",
    phone: decryptField(profile.phoneEnc),
  };
}

function applyPaymentProfile(user, fields, { verified, actorId } = {}) {
  user.paymentProfile = {
    accountNumberEnc: encryptField(fields.accountNumber),
    accountHolderEnc: encryptField(fields.accountHolderName),
    ifscEnc: encryptField(fields.ifsc),
    bankNameEnc: encryptField(fields.bankName),
    phoneEnc: encryptField(fields.phone),
    last4: fields.accountNumber.slice(-4),
    ifscPrefix: fields.ifsc.slice(0, 4),
    bankNameDisplay: fields.bankName,
    holderMasked: maskName(fields.accountHolderName),
    verified: Boolean(verified),
    verifiedBy: verified ? actorId : "",
    verifiedAt: verified ? new Date() : undefined,
    updatedAt: new Date(),
  };
  user.phone = fields.phone;
}

exports.getMyPaymentProfile = async (req, res, next) => {
  try {
    if (!canManageOwnPayout(req.auth.role)) {
      return res.status(403).json({ success: false, message: "Payment profiles are only for workforce accounts" });
    }
    const user = await User.findById(req.auth.userId).select("+paymentProfile");
    res.json({ success: true, profile: toFullPaymentProfile(user?.paymentProfile) });
  } catch (error) { next(error); }
};

exports.updateMyPaymentProfile = async (req, res, next) => {
  try {
    if (!canManageOwnPayout(req.auth.role)) {
      return res.status(403).json({ success: false, message: "Payment profiles are only for workforce accounts" });
    }
    const parsed = validatePaymentProfileInput(req.body || {});
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });
    const user = await User.findById(req.auth.userId).select("+paymentProfile");
    applyPaymentProfile(user, parsed, { verified: false });
    user.markModified("paymentProfile");
    await user.save();
    await writeAudit({ actorId: req.auth.userId, action: "paymentProfile.selfUpdate", targetType: "User", targetId: String(user._id) });
    res.json({ success: true, profile: toFullPaymentProfile(user.paymentProfile) });
  } catch (error) { next(error); }
};

exports.getUserPaymentProfile = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can view workforce bank details" });
    }
    const user = await User.findById(req.params.id).select("name email role +paymentProfile");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!canManageOwnPayout(user.role)) {
      return res.status(400).json({ success: false, message: "This account is not a workforce payment profile" });
    }
    res.json({ success: true, user: { id: String(user._id), name: user.name, email: user.email, role: user.role }, profile: toFullPaymentProfile(user.paymentProfile) });
  } catch (error) { next(error); }
};

exports.updateUserPaymentProfile = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can verify workforce bank details" });
    }
    const user = await User.findById(req.params.id).select("+paymentProfile name role");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!canManageOwnPayout(user.role)) {
      return res.status(400).json({ success: false, message: "This account is not a workforce payment profile" });
    }
    if (req.body.accountNumber || req.body.ifsc || req.body.accountHolderName || req.body.bankName || req.body.phone) {
      const parsed = validatePaymentProfileInput(req.body || {});
      if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });
      applyPaymentProfile(user, parsed, { verified: req.body.verified !== false, actorId: req.auth.userId });
    } else if (req.body.verified !== undefined) {
      if (!user.paymentProfile?.accountNumberEnc) {
        return res.status(409).json({ success: false, message: "No bank details on file to verify" });
      }
      user.paymentProfile.verified = Boolean(req.body.verified);
      user.paymentProfile.verifiedBy = req.auth.userId;
      user.paymentProfile.verifiedAt = req.body.verified ? new Date() : undefined;
    } else {
      return res.status(400).json({ success: false, message: "Provide bank details or a verification flag" });
    }
    user.markModified("paymentProfile");
    await user.save();
    await writeAudit({ actorId: req.auth.userId, action: "paymentProfile.adminUpdate", targetType: "User", targetId: String(user._id) });
    res.json({ success: true, profile: toFullPaymentProfile(user.paymentProfile) });
  } catch (error) { next(error); }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: toSafeUser(req.user) });
  } catch (error) {
    next(error);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { phone, skills, locationSharing, name, availability, headline, bio, city, experienceYears, experience, education, certifications, achievements, profileImage, resumePublicId, resumeFileName, resumeFileType, resumeUploadedAt, organization, projects } = req.body;
    const user = req.user;
    if (name?.trim()) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (Array.isArray(skills)) user.skills = skills;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (city !== undefined) user.city = city;
    if (experienceYears !== undefined) user.experienceYears = experienceYears;
    if (Array.isArray(experience)) user.experience = experience;
    if (Array.isArray(education)) user.education = education;
    if (Array.isArray(certifications)) user.certifications = certifications;
    if (Array.isArray(achievements)) user.achievements = achievements;
    if (resumePublicId !== undefined) {
      if (resumePublicId && !ownsResumePublicId(resumePublicId, user._id)) {
        return res.status(400).json({ success: false, message: "Invalid resume upload" });
      }
      const fileType = resumeTypeFromFile(resumeFileName, resumeFileType) || String(resumeFileType || "").toLowerCase();
      if (resumePublicId && !isAllowedResumeType(fileType)) {
        return res.status(400).json({ success: false, message: "Resume must be a PDF, DOC, or DOCX file" });
      }
      user.resumePublicId = resumePublicId || "";
      user.resumeUrl = "";
      user.resumeFileName = resumePublicId ? String(resumeFileName || "resume").slice(0, 180) : "";
      user.resumeFileType = resumePublicId ? fileType : "";
      user.resumeUploadedAt = resumePublicId ? (resumeUploadedAt || new Date()) : undefined;
    }
    if (organization !== undefined) user.organization = organization;
    if (Array.isArray(projects)) user.projects = projects;
    if (profileImage !== undefined) user.profileImage = sanitizeProfileImage(profileImage);
    if (availability && isRole(user.role, "Staff")) {
      user.availability = availability;
      if (availability !== "Available") {
        await notifyRoles(["Admin", "Super Admin"], {
          type: "workload",
          title: "Worker unavailable",
          message: `${user.name} is now ${availability}.`,
          link: "/admin/staff",
        }, req.app.get("io"));
      }
    }
    if (locationSharing !== undefined && isRole(user.role, "Staff")) {
      user.locationSharing = Boolean(locationSharing);
    }
    await user.save();
    res.json({ success: true, user: toSafeUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.getMyResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId).select("+resumePublicId resumeFileName resumeFileType");
    if (!user?.resumePublicId) return res.status(404).json({ success: false, message: "No resume on file" });
    if (req.query.file === "1") {
      const file = await fetchResumeBuffer({
        publicId: user.resumePublicId,
        fileName: user.resumeFileName,
        fileType: user.resumeFileType,
      });
      return sendResumeBuffer(res, file, { download: req.query.download === "1" });
    }
    res.json(resumeMeta(user.resumeFileName, user.resumeFileType));
  } catch (error) {
    error.message = cloudinaryMessage(error);
    next(error);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const { role, search, skill, availability } = req.query;
    const query = {};
    if (typeof role === "string" && role !== "All") query.role = role;
    if (availability && availability !== "All") query.availability = availability;
    if (skill) query.skills = new RegExp(escapeRegex(skill), "i");
    if (search) query.$or = [{ name: new RegExp(escapeRegex(search), "i") }, { email: new RegExp(escapeRegex(search), "i") }];
    if (isRole(req.user.role, "Officer")) query.role = "Staff";
    if (isRole(req.user.role, "Head Officer") && req.user.department) {
      query.department = req.user.department;
      query.role = { $in: ["Officer", "Staff"] };
    }
    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, users: users.map(toSafeUser) });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role, department, phone, skills, active } = req.body;
    const actor = req.user;

    if (role && !ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role specified" });
    }
    if (isRole(actor.role, "Admin") && role && isRole(role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Admins cannot assign Admin or Super Admin roles" });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });
    if (isRole(targetUser.role, "Super Admin") && !isRole(actor.role, "Super Admin")) {
      return res.status(403).json({ success: false, message: "You do not have permission to modify a Super Admin" });
    }

    const previousRole = targetUser.role;
    if (role) targetUser.role = role;
    if (department !== undefined) targetUser.department = department;
    if (phone !== undefined) targetUser.phone = phone;
    if (Array.isArray(skills)) targetUser.skills = skills;
    if (active !== undefined) targetUser.active = Boolean(active);
    await targetUser.save();

    await writeAudit({
      actorId: actor._id.toString(),
      action: "user.update",
      targetType: "User",
      targetId: targetUser._id.toString(),
      metadata: { role, department, active, previousRole },
    });
    await createNotification({
      userId: targetUser._id.toString(),
      type: "system",
      title: "Your SmartCiviConnect role has been updated",
      message: `Your account role has changed to ${targetUser.role}.`,
      link: "/",
    }, req.app.get("io"));
    await sendRoleUpdatedEmail(targetUser);

    res.json({ success: true, user: toSafeUser(targetUser) });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = exports.getCurrentUser;
exports.getMyResume = exports.getMyResume;
exports.updateUserRole = exports.updateUserRole;
