const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: String,
  resourceType: { type: String, enum: ["image", "video", "raw"], default: "image" },
  phase: { type: String, enum: ["before", "after", "general"] },
  name: String,
  capturedAt: Date,
  uploadedAt: Date,
  latitude: Number,
  longitude: Number,
  duration: Number,
  staffId: String,
  complaintId: String,
  source: { type: String, enum: ["camera", "upload"], default: "upload" },
}, { _id: false });

const historySchema = new mongoose.Schema({
  status: { type: String, enum: ["Pending", "Verified", "Assigned", "In Progress", "Under Verification", "Completed", "Rejected"], required: true },
  note: { type: String, trim: true, maxlength: 1000 },
  changedBy: { type: String, trim: true },
}, { timestamps: true });

const taskHistorySchema = new mongoose.Schema({
  status: { type: String, enum: ["ASSIGNED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "VERIFIED"], required: true },
  changedBy: { type: String, required: true },
  note: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true });

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true, index: true },
  citizenId: { type: String, required: true, index: true },
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  category: { type: String, enum: ["Road Damage", "Potholes", "Garbage", "Drainage Problems", "Water Leakage", "Street Light Problems", "Electricity Problems", "Sewage Issues", "Traffic Problems", "Public Safety", "Other"], required: true },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Verified", "Assigned", "In Progress", "Under Verification", "Completed", "Rejected"], default: "Pending", index: true },
  location: {
    address: String,
    formattedAddress: String,
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    mapsUrl: String,
  },
  media: { type: [mediaSchema], default: [] },
  assignedOfficerId: { type: String, index: true },
  assignedStaffId: { type: String, index: true },
  assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: { type: String, index: true },
  departmentRef: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  operationalStatus: { type: String, enum: ["ASSIGNED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "VERIFIED"], default: "ASSIGNED", index: true },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  workEvidence: { type: [mediaSchema], default: [] },
  evidenceStatus: { type: String, enum: ["none", "pending", "approved", "rejected"], default: "none" },
  verifiedBy: String,
  verificationNote: { type: String, trim: true, maxlength: 2000 },
  workSession: {
    active: { type: Boolean, default: false },
    startedAt: Date,
    endedAt: Date,
  },
  taskHistory: { type: [taskHistorySchema], default: [] },
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  verifiedAt: Date,
  history: { type: [historySchema], default: [] },
  rating: { type: Number, min: 1, max: 5 },
  ratingQuality: { type: Number, min: 1, max: 5 },
  ratingSatisfaction: { type: Number, min: 1, max: 5 },
  ratingBehaviour: { type: Number, min: 1, max: 5 },
  feedback: { type: String, trim: true, maxlength: 2000 },
}, { timestamps: true });

complaintSchema.pre("validate", function setComplaintId() {
  if (!this.complaintId) this.complaintId = `SCC-PENDING-${this._id || Date.now()}`;
});

complaintSchema.index({ citizenId: 1, createdAt: -1 });
complaintSchema.index({ assignedOfficerId: 1, status: 1 });
complaintSchema.index({ assignedStaffId: 1, status: 1 });
complaintSchema.index({ "location.latitude": 1, "location.longitude": 1 });

module.exports = mongoose.model("Complaint", complaintSchema);