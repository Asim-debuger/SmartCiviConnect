const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true, maxlength: 1000 },
  categories: { type: [String], default: [] },
  headOfficerId: { type: String, default: "", index: true },
  officerIds: { type: [String], default: [] },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Department", departmentSchema);
