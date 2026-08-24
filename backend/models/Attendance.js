const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  checkInAt: Date,
  checkOutAt: Date,
  checkInLocation: { latitude: Number, longitude: Number },
  checkOutLocation: { latitude: Number, longitude: Number },
}, { timestamps: true });

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
