const mongoose = require("mongoose");

const locationHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
  complaintId: { type: String, index: true },
  latitude: { type: Number, required: true, min: -90, max: 90 },
  longitude: { type: Number, required: true, min: -180, max: 180 },
}, { timestamps: true });

locationHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("LocationHistory", locationHistorySchema);
