const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ["assignment", "status", "message", "task", "verification", "rejection", "completion", "payment", "job", "system", "progress", "feedback", "connection", "social", "workload", "application", "post"],
    default: "system",
    index: true,
  },
  category: { type: String, enum: ["complaint", "payment", "system", "job", "social", "message", "assignment", "task", "application", "connection", "post"], default: "system", index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: String,
  complaintId: { type: String, index: true },
  read: { type: Boolean, default: false, index: true },
}, { timestamps: true });

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
