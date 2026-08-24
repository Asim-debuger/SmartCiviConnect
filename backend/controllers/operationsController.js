const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Message = require("../models/Message");
const Assignment = require("../models/Assignment");
const LocationHistory = require("../models/LocationHistory");
const { createNotification } = require("../services/notificationService");
const { onOfficerAssigned, onStaffAssigned, onStatusForCitizen } = require("../services/complaintEvents");
const { ensureCompletionPayment } = require("./paymentController");
const { writeAudit } = require("../services/auditService");
const { isRole } = require("../utils/roles");
const { emitComplaint, emitAssignment, emitLocation } = require("../services/realtimeService");
const { sendAssignmentEmail, sendStatusEmail } = require("../services/emailService");

const { complaintQuery } = require("../utils/complaintQuery");
const { sanitizeEvidenceList, validateCompletionEvidence } = require("../utils/workEvidence");
const findComplaint = (id) => Complaint.findOne(complaintQuery(id));

function scopedComplaintQuery(req) {
  if (isRole(req.auth.role, "Head Officer") && req.user?.department) {
    return { department: req.user.department };
  }
  return {};
}

exports.listComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, search, department, from, to } = req.query;
    const query = scopedComplaintQuery(req);
    if (status && status !== "All") query.status = status;
    if (category && category !== "All") query.category = category;
    if (priority && priority !== "All") query.priority = priority;
    if (department && department !== "All") query.department = department;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    if (search) {
      query.$or = [
        { complaintId: new RegExp(search, "i") },
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }
    const complaints = await Complaint.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, complaints });
  } catch (error) { next(error); }
};

exports.dashboardStats = async (req, res, next) => {
  try {
    const match = scopedComplaintQuery(req);
    const [total, pending, completed, active, verification, users] = await Promise.all([
      Complaint.countDocuments(match),
      Complaint.countDocuments({ ...match, status: "Pending" }),
      Complaint.countDocuments({ ...match, status: "Completed" }),
      Complaint.countDocuments({ ...match, status: { $in: ["Verified", "Assigned", "In Progress"] } }),
      Complaint.countDocuments({ ...match, status: "Under Verification" }),
      User.countDocuments({ active: { $ne: false } }),
    ]);
    res.json({ success: true, stats: { total, pending, completed, active, verification, users } });
  } catch (error) { next(error); }
};

exports.assignComplaint = async (req, res, next) => {
  try {
    const { officerId, staffId, note } = req.body;
    if (!officerId && !staffId) return res.status(400).json({ success: false, message: "officerId or staffId is required" });
    const complaint = await findComplaint(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    if (isRole(req.auth.role, "Head Officer") && req.user.department && complaint.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Complaint is outside your department" });
    }
    if (officerId) {
      const officer = await User.findOne({ _id: officerId, role: { $in: ["Officer", "Head Officer"] }, active: { $ne: false } });
      if (!officer) return res.status(400).json({ success: false, message: "Officer not found" });
      complaint.assignedOfficerId = officerId;
      complaint.assignedOfficer = officerId;
      if (officer.department) complaint.department = officer.department;
    }
    if (staffId) {
      const staff = await User.findOne({ _id: staffId, role: "Staff", active: { $ne: false } });
      if (!staff) return res.status(400).json({ success: false, message: "Staff member not found" });
      complaint.assignedStaffId = staffId;
      complaint.assignedStaff = staffId;
    }
    complaint.status = "Assigned";
    complaint.operationalStatus = "ASSIGNED";
    complaint.history.push({ status: "Assigned", changedBy: req.auth.userId, note: note || "Workforce assignment updated" });
    await complaint.save();
    await Assignment.create({
      complaint: complaint._id,
      complaintId: complaint.complaintId,
      assignedBy: req.auth.userId,
      officer: complaint.assignedOfficerId || undefined,
      staff: complaint.assignedStaffId || undefined,
      department: complaint.department,
      note,
    });
    const io = req.app.get("io");
    emitComplaint(io, complaint, ["assignment:new"]);
    if (officerId) {
      const officer = await User.findById(officerId).select("name email").lean();
      await onOfficerAssigned(complaint, officer, io);
      emitAssignment(io, { userId: officerId, complaintId: complaint.complaintId, role: "Officer" });
      await sendAssignmentEmail(officer, complaint, "Officer", req.user);
    }
    if (staffId) {
      const staff = await User.findById(staffId).select("name email").lean();
      await onStaffAssigned(complaint, staff, req.auth.role, io);
      emitAssignment(io, { userId: staffId, complaintId: complaint.complaintId, role: "Staff" });
      await sendAssignmentEmail(staff, complaint, "Staff", req.user);
    }
    await writeAudit({ actorId: req.auth.userId, action: "complaint.assign", targetType: "Complaint", targetId: complaint.complaintId, metadata: { officerId, staffId } });
    res.json({ success: true, complaint });
  } catch (error) { next(error); }
};

exports.listAssigned = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    const actorId = req.auth.userId;
    if (isRole(req.user.role, "Officer")) query = { assignedOfficerId: actorId };
    if (isRole(req.user.role, "Staff")) query = { assignedStaffId: actorId };
    if (isRole(req.user.role, "Head Officer")) {
      query = { $or: [{ assignedOfficerId: actorId }, { department: req.user.department }] };
    }
    if (status === "Pending") query.status = { $in: ["Pending", "Verified", "Assigned"] };
    if (status === "Accepted") query.operationalStatus = "ACCEPTED";
    if (status === "Completed") query.status = "Completed";
    const complaints = await Complaint.find(query).sort({ updatedAt: -1 }).lean();
    res.json({ success: true, complaints });
  } catch (error) { next(error); }
};

exports.acceptComplaint = async (req, res, next) => {
  try {
    const complaint = await findComplaint(req.params.id);
    if (!complaint || complaint.assignedOfficerId !== req.auth.userId) {
      return res.status(404).json({ success: false, message: "Assigned complaint not found" });
    }
    complaint.operationalStatus = "ACCEPTED";
    complaint.acceptedAt = new Date();
    complaint.taskHistory.push({ status: "ACCEPTED", changedBy: req.auth.userId, note: "Officer accepted complaint" });
    await complaint.save();
    emitComplaint(req.app.get("io"), complaint);
    await createNotification({
      userId: complaint.citizenId,
      type: "status",
      title: "Complaint accepted",
      message: `An officer accepted ${complaint.complaintId}.`,
      link: `/citizen/complaint/${complaint.complaintId}`,
    }, req.app.get("io"));
    res.json({ success: true, complaint });
  } catch (error) { next(error); }
};

exports.assignStaff = async (req, res, next) => {
  try {
    const { staffId, note } = req.body;
    const complaint = await findComplaint(req.params.id);
    const canAssign = complaint && (complaint.assignedOfficerId === req.auth.userId || isRole(req.auth.role, "Head Officer", "Admin", "Super Admin"));
    if (!canAssign) return res.status(404).json({ success: false, message: "Officer complaint not found" });
    const staff = await User.findOne({ _id: staffId, role: "Staff", active: { $ne: false } });
    if (!staff) return res.status(400).json({ success: false, message: "Staff member not found" });
    complaint.assignedStaffId = staff._id.toString();
    complaint.assignedStaff = staff._id;
    complaint.operationalStatus = "ASSIGNED";
    complaint.status = complaint.status === "Pending" ? "Assigned" : complaint.status;
    complaint.taskHistory.push({ status: "ASSIGNED", changedBy: req.auth.userId, note: note || "Task assigned to field staff" });
    await complaint.save();
    await Assignment.create({
      complaint: complaint._id,
      complaintId: complaint.complaintId,
      assignedBy: req.auth.userId,
      officer: complaint.assignedOfficerId || undefined,
      staff: staff._id,
      department: complaint.department,
      note,
    });
    const io = req.app.get("io");
    emitComplaint(io, complaint, ["assignment:new"]);
    emitAssignment(io, { userId: staff._id.toString(), complaintId: complaint.complaintId, role: "Staff" });
    await onStaffAssigned(complaint, staff, req.auth.role, io);
    await sendAssignmentEmail(staff, complaint, "Staff / Worker", req.user);
    res.json({ success: true, complaint });
  } catch (error) { next(error); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { status, progress, workEvidence, note } = req.body;
    const complaint = await findComplaint(req.params.id);
    const isOfficer = complaint?.assignedOfficerId === req.auth.userId;
    const isStaff = complaint?.assignedStaffId === req.auth.userId;
    if (!complaint || (!isOfficer && !isStaff && !isRole(req.auth.role, "Head Officer", "Admin", "Super Admin"))) {
      return res.status(404).json({ success: false, message: "Assigned task not found" });
    }
    if (complaint.status === "Completed" && complaint.verifiedAt) {
      return res.status(409).json({ success: false, message: "Verified completion cannot be modified" });
    }
    const allowed = isOfficer
      ? { ACCEPTED: ["ASSIGNED"], IN_PROGRESS: ["ACCEPTED", "IN_PROGRESS"] }
      : { ACCEPTED: ["ASSIGNED"], IN_PROGRESS: ["ACCEPTED", "IN_PROGRESS"], COMPLETED: ["IN_PROGRESS"] };
    const isSameStateUpdate = status === complaint.operationalStatus && (progress !== undefined || workEvidence);
    if (!isSameStateUpdate && status && !allowed[status]?.includes(complaint.operationalStatus) && !isRole(req.auth.role, "Head Officer", "Admin", "Super Admin")) {
      return res.status(409).json({ success: false, message: `Cannot change ${complaint.operationalStatus} to ${status}` });
    }
    if (workEvidence) {
      if (!isStaff) {
        return res.status(403).json({ success: false, message: "Only the assigned staff member can submit work evidence" });
      }
      const sanitized = sanitizeEvidenceList(workEvidence, { staffId: req.auth.userId, complaintId: complaint.complaintId });
      complaint.workEvidence = sanitized;
      complaint.evidenceStatus = "pending";
    }
    if (status) complaint.operationalStatus = status;
    if (progress !== undefined) complaint.progress = progress;
    if (status === "IN_PROGRESS") {
      const firstStart = !complaint.startedAt;
      complaint.startedAt = complaint.startedAt || new Date();
      complaint.status = "In Progress";
      complaint.workSession = {
        active: true,
        startedAt: complaint.workSession?.startedAt || new Date(),
        endedAt: undefined,
      };
      if (firstStart) {
        complaint.history.push({ status: "In Progress", changedBy: req.auth.userId, note: note || "Work started" });
      }
    }
    if (status === "COMPLETED") {
      if (!isStaff && !isRole(req.auth.role, "Head Officer", "Admin", "Super Admin")) {
        return res.status(403).json({ success: false, message: "Only assigned staff can submit completion" });
      }
      const check = validateCompletionEvidence(complaint.workEvidence, { staffId: complaint.assignedStaffId, complaintId: complaint.complaintId });
      if (!check.ok) return res.status(400).json({ success: false, message: check.message });
      complaint.workEvidence = check.items;
      complaint.completedAt = new Date();
      complaint.progress = 100;
      complaint.status = "Under Verification";
      complaint.evidenceStatus = "pending";
      complaint.workSession = { ...(complaint.workSession || {}), active: false, endedAt: new Date() };
      complaint.history.push({ status: "Under Verification", changedBy: req.auth.userId, note: note || "Work submitted for officer verification" });
    }
    if (status && !isSameStateUpdate) complaint.taskHistory.push({ status, changedBy: req.auth.userId, note: note || `Task marked ${status.toLowerCase()}` });
    await complaint.save();
    const io = req.app.get("io");
    emitComplaint(io, complaint);
    if (status === "ACCEPTED" && isStaff && complaint.assignedOfficerId) {
      await createNotification({
        userId: complaint.assignedOfficerId,
        type: "task",
        title: "Staff accepted task",
        message: `Staff accepted ${complaint.complaintId}.`,
        link: "/officer/complaints",
        complaintId: complaint.complaintId,
      }, io);
    }
    if (status === "IN_PROGRESS" || status === "COMPLETED" || (progress !== undefined && isSameStateUpdate)) {
      await onStatusForCitizen(complaint, complaint.status, io);
      if (complaint.assignedOfficerId && (status === "IN_PROGRESS" || status === "COMPLETED" || workEvidence)) {
        await createNotification({
          userId: complaint.assignedOfficerId,
          type: workEvidence ? "task" : "progress",
          title: workEvidence ? "Proof uploaded" : status === "COMPLETED" ? "Work completed" : "Work progress updated",
          message: `${complaint.complaintId} is now ${complaint.status}${progress !== undefined ? ` (${progress}%)` : ""}.`,
          link: "/officer/complaints",
          complaintId: complaint.complaintId,
        }, io);
      }
      const citizen = await User.findById(complaint.citizenId).select("name email").lean();
      await sendStatusEmail(citizen, complaint, complaint.status);
    }
    res.json({ success: true, complaint });
  } catch (error) { next(error); }
};

exports.verifyTask = async (req, res, next) => {
  try {
    const complaint = await findComplaint(req.params.id);
    const isAdmin = isRole(req.auth.role, "Admin", "Super Admin", "Head Officer");
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    const ready = complaint.operationalStatus === "COMPLETED" || complaint.status === "Under Verification";
    if (!ready) return res.status(409).json({ success: false, message: "Only completed work can be verified" });
    if (!isAdmin && complaint.assignedOfficerId !== req.auth.userId) {
      return res.status(403).json({ success: false, message: "Only the assigned officer can verify this work" });
    }
    if (!complaint.workEvidence?.length) {
      return res.status(409).json({ success: false, message: "Cannot approve without submitted evidence" });
    }
    complaint.operationalStatus = "VERIFIED";
    complaint.verifiedAt = new Date();
    complaint.verifiedBy = req.auth.userId;
    complaint.evidenceStatus = "approved";
    complaint.verificationNote = req.body?.note || "Work verified";
    complaint.status = "Completed";
    complaint.history.push({ status: "Completed", changedBy: req.auth.userId, note: "Completion verified" });
    complaint.taskHistory.push({ status: "VERIFIED", changedBy: req.auth.userId, note: "Completion verified" });
    await complaint.save();
    const io = req.app.get("io");
    emitComplaint(io, complaint);
    await onStatusForCitizen(complaint, "Completed", io);
    if (complaint.assignedStaffId) {
      await createNotification({
        userId: complaint.assignedStaffId,
        type: "completion",
        title: "Work verified",
        message: `${complaint.complaintId} was approved.`,
        link: "/staff/tasks",
        complaintId: complaint.complaintId,
      }, io);
    }
    if (complaint.assignedOfficerId) {
      await createNotification({
        userId: complaint.assignedOfficerId,
        type: "task",
        title: "Approval recorded",
        message: `${complaint.complaintId} completion was approved.`,
        link: "/officer/complaints",
        complaintId: complaint.complaintId,
      }, io);
    }
    await ensureCompletionPayment(complaint, req.auth.userId);
    const citizen = await User.findById(complaint.citizenId).select("name email").lean();
    await sendStatusEmail(citizen, complaint, "Completed");
    res.json({ success: true, complaint });
  } catch (error) { next(error); }
};

exports.rejectEvidence = async (req, res, next) => {
  try {
    const complaint = await findComplaint(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    const canReject = isRole(req.auth.role, "Admin", "Super Admin", "Head Officer") || complaint.assignedOfficerId === req.auth.userId;
    if (!canReject) return res.status(403).json({ success: false, message: "Not authorized to reject this evidence" });
    const ready = complaint.operationalStatus === "COMPLETED" || complaint.status === "Under Verification";
    if (!ready) return res.status(409).json({ success: false, message: "There is no completion submission to reject" });
    const reason = String(req.body?.note || req.body?.reason || "").trim();
    if (!reason) return res.status(400).json({ success: false, message: "A rejection reason is required" });
    complaint.status = "In Progress";
    complaint.operationalStatus = "IN_PROGRESS";
    complaint.evidenceStatus = "rejected";
    complaint.verificationNote = reason;
    complaint.progress = Math.min(complaint.progress || 80, 80);
    complaint.history.push({ status: "In Progress", changedBy: req.auth.userId, note: `Evidence rejected: ${reason}` });
    complaint.taskHistory.push({ status: "IN_PROGRESS", changedBy: req.auth.userId, note: `Evidence rejected: ${reason}` });
    await complaint.save();
    const io = req.app.get("io");
    emitComplaint(io, complaint);
    if (complaint.assignedStaffId) {
      await createNotification({
        userId: complaint.assignedStaffId,
        type: "rejection",
        title: "Evidence rejected",
        message: `${complaint.complaintId}: ${reason}`,
        link: "/staff/tasks",
        complaintId: complaint.complaintId,
      }, io);
    }
    res.json({ success: true, complaint });
  } catch (error) { next(error); }
};

exports.rejectComplaint = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Officer", "Head Officer", "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Not authorized to reject complaints" });
    }
    const complaint = await findComplaint(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    complaint.status = "Rejected";
    complaint.history.push({ status: "Rejected", changedBy: req.auth.userId, note: req.body.note || "Complaint rejected" });
    await complaint.save();
    emitComplaint(req.app.get("io"), complaint);
    await createNotification({
      userId: complaint.citizenId,
      type: "rejection",
      title: "Complaint rejected",
      message: `${complaint.complaintId} was marked invalid.`,
      link: `/citizen/complaint/${complaint.complaintId}`,
    }, req.app.get("io"));
    res.json({ success: true, complaint });
  } catch (error) { next(error); }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const complaint = await findComplaint(req.params.id);
    const involved = [complaint?.citizenId, complaint?.assignedOfficerId, complaint?.assignedStaffId];
    if (!complaint || (!involved.includes(req.auth.userId) && !isRole(req.auth.role, "Admin", "Super Admin", "Head Officer"))) {
      return res.status(403).json({ success: false, message: "You are not part of this complaint" });
    }
    const { recipientId, body } = req.body;
    if (!recipientId || !body?.trim()) return res.status(400).json({ success: false, message: "recipientId and message body are required" });
    const message = await Message.create({ complaintId: complaint._id, senderId: req.auth.userId, recipientId, body: body.trim() });
    const io = req.app.get("io");
    if (io) io.to(`complaint:${complaint.complaintId}`).emit("message_received", message);
    res.status(201).json({ success: true, message });
  } catch (error) { next(error); }
};

exports.listMessages = async (req, res, next) => {
  try {
    const complaint = await findComplaint(req.params.id);
    const involved = [complaint?.citizenId, complaint?.assignedOfficerId, complaint?.assignedStaffId];
    if (!complaint || (!involved.includes(req.auth.userId) && !isRole(req.auth.role, "Admin", "Super Admin", "Head Officer"))) {
      return res.status(403).json({ success: false, message: "You are not part of this complaint" });
    }
    const messages = await Message.find({ complaintId: complaint._id }).sort({ createdAt: 1 }).lean();
    res.json({ success: true, messages });
  } catch (error) { next(error); }
};

exports.updateLocation = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Staff")) return res.status(403).json({ success: false, message: "Only staff can share live location" });
    const { latitude, longitude, sharing, complaintId } = req.body;
    const user = req.user;
    if (sharing !== undefined) user.locationSharing = Boolean(sharing);
    let related = null;
    if (latitude !== undefined && longitude !== undefined) {
      user.lastLocation = { latitude, longitude, updatedAt: new Date() };
      related = complaintId ? await Complaint.findOne(complaintQuery(complaintId)).select("_id complaintId") : null;
      await LocationHistory.create({
        user: user._id,
        latitude,
        longitude,
        complaintId: related?.complaintId || complaintId,
        complaint: related?._id,
      });
    }
    await user.save();
    const io = req.app.get("io");
    if (io && user.locationSharing && user.lastLocation) {
      const assigned = await Complaint.find({
        assignedStaffId: String(user._id),
        status: { $nin: ["Completed", "Rejected"] },
      }).select("_id complaintId").lean();
      const targets = related
        ? [related]
        : assigned;
      if (!targets.length) {
        emitLocation(io, { staffId: user._id.toString(), name: user.name, ...user.lastLocation, complaintId });
      } else {
        targets.forEach((item) => {
          emitLocation(io, {
            staffId: user._id.toString(),
            name: user.name,
            ...user.lastLocation,
            complaintId: item.complaintId || complaintId,
            complaintMongoId: String(item._id),
          });
        });
      }
    }
    res.json({ success: true, locationSharing: user.locationSharing, lastLocation: user.lastLocation });
  } catch (error) { next(error); }
};

exports.listLiveLocations = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Officer", "Head Officer", "Admin", "Super Admin", "Citizen")) {
      return res.status(403).json({ success: false, message: "Not authorized to view live locations" });
    }
    const query = { role: "Staff", locationSharing: true, "lastLocation.latitude": { $ne: null } };
    if (isRole(req.auth.role, "Head Officer") && req.user?.department) query.department = req.user.department;
    if (isRole(req.auth.role, "Officer")) {
      const assigned = await Complaint.find({ assignedOfficerId: req.auth.userId, assignedStaffId: { $ne: null } }).select("assignedStaffId").lean();
      query._id = { $in: assigned.map((item) => item.assignedStaffId).filter(Boolean) };
    }
    if (isRole(req.auth.role, "Citizen")) {
      if (!req.query.complaintId) return res.json({ success: true, locations: [] });
      const complaint = await Complaint.findOne({ complaintId: req.query.complaintId, citizenId: req.auth.userId }).lean();
      if (!complaint?.assignedStaffId) return res.json({ success: true, locations: [] });
      query._id = complaint.assignedStaffId;
    }
    const staff = await User.find(query).select("_id name department lastLocation locationSharing").lean();
    res.json({ success: true, locations: staff });
  } catch (error) { next(error); }
};

exports.listWorkers = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Officer", "Head Officer", "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    const query = { role: "Staff", active: { $ne: false } };
    if (req.query.skill) query.skills = new RegExp(req.query.skill, "i");
    if (req.query.availability && req.query.availability !== "All") query.availability = req.query.availability;
    if (isRole(req.auth.role, "Head Officer") && req.user.department) query.department = req.user.department;
    const workers = await User.find(query).select("name email phone skills department availability lastLocation").sort({ name: 1 }).lean();
    res.json({ success: true, workers });
  } catch (error) { next(error); }
};

exports.departmentOverview = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Head Officer", "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    const department = req.user.department || req.query.department;
    const match = department ? { department } : {};
    const [total, activeWorkers, officers, pending, completed] = await Promise.all([
      Complaint.countDocuments(match),
      User.countDocuments({ role: "Staff", active: { $ne: false }, ...(department ? { department } : {}) }),
      User.find({ role: { $in: ["Officer", "Head Officer"] }, ...(department ? { department } : {}) }).select("name email role department").lean(),
      Complaint.countDocuments({ ...match, status: { $nin: ["Completed", "Rejected"] } }),
      Complaint.countDocuments({ ...match, status: "Completed" }),
    ]);
    res.json({ success: true, overview: { department, total, pending, completed, activeWorkers, officers } });
  } catch (error) { next(error); }
};
