const Department = require("../models/Department");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const { writeAudit } = require("../services/auditService");
const { isRole } = require("../utils/roles");
const { ensureDefaultDepartments } = require("../services/departmentService");

exports.listDepartments = async (req, res, next) => {
  try {
    await ensureDefaultDepartments();
    const departments = await Department.find().sort({ name: 1 }).lean();
    res.json({ success: true, departments });
  } catch (error) { next(error); }
};

exports.createDepartment = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can create departments" });
    }
    const { name, description, categories } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: "Department name is required" });
    const department = await Department.create({ name: name.trim(), description, categories: categories || [] });
    await writeAudit({ actorId: req.auth.userId, action: "department.create", targetType: "Department", targetId: String(department._id) });
    res.status(201).json({ success: true, department });
  } catch (error) { next(error); }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can update departments" });
    }
    const allowed = ["name", "description", "categories", "active", "headOfficerId", "officerIds"];
    const patch = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    });
    const department = await Department.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!department) return res.status(404).json({ success: false, message: "Department not found" });
    if (patch.headOfficerId) {
      await User.findByIdAndUpdate(patch.headOfficerId, { role: "Head Officer", department: department.name });
    }
    res.json({ success: true, department });
  } catch (error) { next(error); }
};

exports.assignOfficer = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin", "Head Officer")) {
      return res.status(403).json({ success: false, message: "Not authorized to assign officers" });
    }
    const { officerId } = req.body;
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ success: false, message: "Department not found" });
    const officer = await User.findOne({ _id: officerId, role: { $in: ["Officer", "Head Officer"] } });
    if (!officer) return res.status(400).json({ success: false, message: "Officer not found" });
    officer.department = department.name;
    await officer.save();
    if (!department.officerIds.includes(officerId)) department.officerIds.push(officerId);
    await department.save();
    res.json({ success: true, department });
  } catch (error) { next(error); }
};

exports.analytics = async (req, res, next) => {
  try {
    const match = {};
    if (isRole(req.auth.role, "Head Officer") && req.user?.department) match.department = req.user.department;
    const [byStatus, byCategory, byDepartment, byMonth, workforce] = await Promise.all([
      Complaint.aggregate([{ $match: match }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $match: match }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $match: match }, { $group: { _id: "$department", count: { $sum: 1 } } }]),
      Complaint.aggregate([
        { $match: match },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } } } },
        { $sort: { _id: 1 } },
      ]),
      Promise.all([
        User.countDocuments({ role: "Officer", ...(match.department ? { department: match.department } : {}) }),
        User.countDocuments({ role: "Staff", ...(match.department ? { department: match.department } : {}) }),
        User.countDocuments({ role: "Citizen" }),
        User.countDocuments({ role: "Staff", availability: "Available", ...(match.department ? { department: match.department } : {}) }),
      ]),
    ]);
    const workerPerformance = await Complaint.aggregate([
      { $match: { ...match, assignedStaffId: { $ne: null } } },
      { $group: { _id: "$assignedStaffId", total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } } } },
      { $sort: { completed: -1 } },
      { $limit: 10 },
    ]);
    const total = byStatus.reduce((sum, item) => sum + item.count, 0);
    const completed = byStatus.find((item) => item._id === "Completed")?.count || 0;
    res.json({
      success: true,
      analytics: {
        byStatus,
        byCategory,
        byDepartment,
        byMonth,
        workerPerformance,
        completionRate: total ? Math.round((completed / total) * 100) : 0,
        workforce: { officers: workforce[0], staff: workforce[1], citizens: workforce[2], availableStaff: workforce[3] },
      },
    });
  } catch (error) { next(error); }
};

exports.listAuditLogs = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, logs });
  } catch (error) { next(error); }
};
