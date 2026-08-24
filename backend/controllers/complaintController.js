const { nextComplaintId } = require("../utils/complaintId");
const { STATUS_TRANSITIONS, isRole } = require("../utils/roles");
const { onComplaintCreated, onDepartmentAssigned, onStatusForCitizen } = require("../services/complaintEvents");
const { writeAudit } = require("../services/auditService");
const { resolveDepartment } = require("../services/departmentService");
const { emitComplaint } = require("../services/realtimeService");
const { sendStatusEmail } = require("../services/emailService");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { complaintQuery } = require("../utils/complaintQuery");
const { redactEvidenceForViewer, isApprovedCompletion } = require("../utils/workEvidence");
const { ensureCompletionPayment } = require("./paymentController");

function canViewComplaint(user, userId, complaint) {
  if (isRole(user.role, "Admin", "Super Admin")) return true;
  if (isRole(user.role, "Head Officer")) {
    if (!user.department) return true;
    return complaint.department === user.department
      || [complaint.assignedOfficerId, complaint.assignedStaffId].includes(userId);
  }
  return [complaint.citizenId, complaint.assignedOfficerId, complaint.assignedStaffId].includes(userId);
}

async function enrichComplaint(complaint) {
  if (!complaint) return complaint;
  const [citizen, officer, staff] = await Promise.all([
    User.findById(complaint.citizenId).select("name email phone").lean(),
    complaint.assignedOfficerId ? User.findById(complaint.assignedOfficerId).select("name email phone department").lean() : null,
    complaint.assignedStaffId ? User.findById(complaint.assignedStaffId).select("name email phone department lastLocation locationSharing").lean() : null,
  ]);
  return { ...complaint, citizen, assignedOfficer: officer, assignedStaff: staff };
}

async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    const response = await fetch(url, { headers: { "User-Agent": "SmartCiviConnect/1.0" } });
    if (!response.ok) return "";
    const payload = await response.json();
    return payload.display_name || "";
  } catch {
    return "";
  }
}

async function normalizeGpsLocation(input) {
  const latitude = Number(input?.latitude ?? input?.lat);
  const longitude = Number(input?.longitude ?? input?.lng ?? input?.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const mapsUrl = input?.mapsUrl || `https://www.google.com/maps?q=${latitude},${longitude}`;
  const formattedAddress = input?.formattedAddress || input?.address || await reverseGeocode(latitude, longitude);
  return {
    latitude,
    longitude,
    address: formattedAddress || input?.address || "Current GPS location",
    formattedAddress: formattedAddress || "",
    mapsUrl,
  };
}

exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, location, media } = req.body;
    if (!title?.trim() || !description?.trim() || !category) {
      return res.status(400).json({ success: false, message: "Title, description and category are required" });
    }
    const gpsLocation = await normalizeGpsLocation(location);
    if (!gpsLocation) {
      return res.status(400).json({ success: false, message: "Current GPS location is required. Manual location entry is not allowed." });
    }
    const citizenId = req.auth.userId;
    const complaintId = await nextComplaintId();
    const department = await resolveDepartment(category);
    const complaint = await Complaint.create({
      complaintId,
      citizenId,
      citizen: citizenId,
      title: title.trim(),
      description: description.trim(),
      category,
      priority: priority || "Medium",
      location: gpsLocation,
      media: Array.isArray(media) ? media : [],
      department: department.name,
      departmentRef: department._id || undefined,
      history: [{ status: "Pending", changedBy: citizenId, note: "Complaint submitted" }],
    });

    const io = req.app.get("io");
    emitComplaint(io, complaint);
    await onComplaintCreated(complaint, io);
    if (complaint.department) await onDepartmentAssigned(complaint, io);
    await writeAudit({ actorId: citizenId, action: "complaint.create", targetType: "Complaint", targetId: complaintId });
    res.status(201).json({ success: true, message: "Complaint created successfully", complaint });
  } catch (error) { next(error); }
};

exports.suggest = async (req, res, next) => {
  try {
    const text = String(req.query.text || req.body?.text || "").toLowerCase();
    const rules = [
      { test: /street light|bulb|lamp|electric/, category: "Street Light Problems", priority: "Medium", department: "Electricity" },
      { test: /power|transformer|electricity/, category: "Electricity Problems", priority: "High", department: "Electricity" },
      { test: /pothole|road|asphalt/, category: "Potholes", priority: "Medium", department: "Road Maintenance" },
      { test: /garbage|waste|trash|dump/, category: "Garbage", priority: "Medium", department: "Waste Management" },
      { test: /water leak|pipeline|tap/, category: "Water Leakage", priority: "High", department: "Water Supply" },
      { test: /drain|sewage|sewer/, category: "Drainage Problems", priority: "High", department: "Water Supply" },
      { test: /traffic|signal/, category: "Traffic Problems", priority: "Medium", department: "Road Maintenance" },
      { test: /safety|crime|harass/, category: "Public Safety", priority: "Urgent", department: "Public Safety" },
    ];
    const hit = rules.find((rule) => rule.test.test(text));
    res.json({ success: true, suggestion: hit ? { category: hit.category, priority: hit.priority, department: hit.department } : { category: "Other", priority: "Medium", department: "Public Safety" } });
  } catch (error) { next(error); }
};

exports.getMyComplaints = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;
    const query = { citizenId: req.auth.userId };
    if (status && status !== "All") query.status = status;
    if (category && category !== "All") query.category = category;
    if (priority && priority !== "All") query.priority = priority;
    const complaints = await Complaint.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, complaints: complaints.map((item) => redactEvidenceForViewer(item, req.user)) });
  } catch (error) { next(error); }
};

exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne(complaintQuery(req.params.id)).lean();
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    if (!canViewComplaint(req.user, req.auth.userId, complaint)) {
      return res.status(403).json({ success: false, message: "You are not authorized to view this complaint" });
    }
    res.json({ success: true, complaint: redactEvidenceForViewer(await enrichComplaint(complaint), req.user) });
  } catch (error) { next(error); }
};

exports.updateComplaint = async (req, res, next) => {
  try {
    const { rating, feedback, ratingQuality, ratingSatisfaction, ratingBehaviour } = req.body;
    const complaint = await Complaint.findOne(complaintQuery(req.params.id));
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    if (complaint.citizenId !== req.auth.userId) {
      return res.status(403).json({ success: false, message: "Only the reporting citizen can submit a rating and feedback" });
    }
    if (!isApprovedCompletion(complaint)) {
      return res.status(409).json({ success: false, message: "Feedback is only available after officer-verified completion" });
    }
    if (ratingQuality !== undefined) complaint.ratingQuality = ratingQuality;
    if (ratingSatisfaction !== undefined) complaint.ratingSatisfaction = ratingSatisfaction;
    if (ratingBehaviour !== undefined) complaint.ratingBehaviour = ratingBehaviour;
    const parts = [complaint.ratingQuality, complaint.ratingSatisfaction, complaint.ratingBehaviour].filter((value) => Number(value) >= 1);
    if (rating !== undefined) complaint.rating = rating;
    else if (parts.length) complaint.rating = Math.round(parts.reduce((sum, value) => sum + Number(value), 0) / parts.length);
    if (feedback !== undefined) complaint.feedback = feedback;
    await complaint.save();
    emitComplaint(req.app.get("io"), complaint);
    res.json({ success: true, complaint: redactEvidenceForViewer(complaint.toObject(), req.user) });
  } catch (error) { next(error); }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const complaint = await Complaint.findOne(complaintQuery(req.params.id));
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    if (!STATUS_TRANSITIONS[complaint.status]?.includes(status)) {
      return res.status(409).json({ success: false, message: `Cannot change status from ${complaint.status} to ${status}` });
    }
    if (["Verified", "Rejected"].includes(status) && !isRole(req.user.role, "Admin", "Super Admin", "Head Officer")) {
      return res.status(403).json({ success: false, message: "Only administrators or head officers can verify or reject complaints" });
    }
    if (isRole(req.user.role, "Head Officer") && req.user.department && complaint.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "You can only manage complaints in your department" });
    }

    if (status === "Completed") {
      const { validateCompletionEvidence } = require("../utils/workEvidence");
      if (complaint.status !== "Under Verification") {
        return res.status(409).json({ success: false, message: "Work must be submitted for officer verification before it can be marked completed" });
      }
      const check = validateCompletionEvidence(complaint.workEvidence, { staffId: complaint.assignedStaffId, complaintId: complaint.complaintId });
      if (!check.ok) return res.status(400).json({ success: false, message: check.message });
      complaint.workEvidence = check.items;
      complaint.operationalStatus = "VERIFIED";
      complaint.verifiedAt = complaint.verifiedAt || new Date();
      complaint.verifiedBy = complaint.verifiedBy || req.auth.userId;
      complaint.evidenceStatus = "approved";
    }

    complaint.status = status;
    complaint.history.push({ status, note, changedBy: req.auth.userId });
    await complaint.save();
    emitComplaint(req.app.get("io"), complaint);
    await writeAudit({ actorId: req.auth.userId, action: `complaint.${status.toLowerCase()}`, targetType: "Complaint", targetId: complaint.complaintId });
    await onStatusForCitizen(complaint, status, req.app.get("io"));
    if (status === "Completed") await ensureCompletionPayment(complaint, req.auth.userId);
    const citizen = await User.findById(complaint.citizenId).select("name email").lean();
    await sendStatusEmail(citizen, complaint, status);
    res.json({ success: true, complaint });
  } catch (error) { next(error); }
};

exports.suggest = exports.suggest;
