const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true, index: true },
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);