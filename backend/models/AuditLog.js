const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  actorId: { type: String, required: true, index: true },
  action: { type: String, required: true, index: true },
  targetType: String,
  targetId: String,
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema);
