const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true, index: true },
  complaintId: { type: String, required: true, index: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  officer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: { type: String, default: "", index: true },
  note: { type: String, trim: true, maxlength: 1000 },
  status: { type: String, enum: ["Active", "Completed", "Cancelled"], default: "Active", index: true },
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
