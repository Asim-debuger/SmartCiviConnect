const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: { type: [String], required: true, index: true },
  lastMessage: String,
  lastAt: Date,
}, { timestamps: true });

conversationSchema.index({ participants: 1 });

const chatMessageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
  senderId: { type: String, required: true, index: true },
  body: { type: String, trim: true, maxlength: 4000 },
  attachments: [{ url: String, resourceType: String }],
  readBy: { type: [String], default: [] },
}, { timestamps: true });

module.exports = {
  Conversation: mongoose.model("Conversation", conversationSchema),
  ChatMessage: mongoose.model("ChatMessage", chatMessageSchema),
};
