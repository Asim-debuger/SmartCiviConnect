const Connection = require("../models/Connection");
const { Conversation, ChatMessage } = require("../models/Conversation");
const User = require("../models/User");
const { createNotification } = require("../services/notificationService");

function sortedPair(a, b) {
  return [a, b].sort();
}

exports.listConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.auth.userId }).sort({ lastAt: -1 }).lean();
    const ids = [...new Set(conversations.flatMap((item) => item.participants))];
    const users = await User.find({ _id: { $in: ids } }).select("name role headline profileImage").lean();
    const byId = Object.fromEntries(users.map((user) => [String(user._id), user]));
    const conversationIds = conversations.map((item) => item._id);
    const unreadRows = await ChatMessage.aggregate([
      { $match: { conversation: { $in: conversationIds }, senderId: { $ne: req.auth.userId } } },
      { $match: { readBy: { $nin: [req.auth.userId] } } },
      { $group: { _id: "$conversation", count: { $sum: 1 } } },
    ]);
    const unreadMap = Object.fromEntries(unreadRows.map((item) => [String(item._id), item.count]));
    const unreadTotal = unreadRows.reduce((sum, item) => sum + item.count, 0);
    res.json({
      success: true,
      unreadTotal,
      conversations: conversations.map((item) => ({
        ...item,
        unread: unreadMap[String(item._id)] || 0,
        other: byId[item.participants.find((id) => String(id) !== String(req.auth.userId))] || null,
      })),
    });
  } catch (error) { next(error); }
};

exports.openConversation = async (req, res, next) => {
  try {
    const otherId = req.body.userId;
    if (!otherId || String(otherId) === String(req.auth.userId)) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }
    const participants = sortedPair(req.auth.userId, otherId);
    let conversation = await Conversation.findOne({ participants: { $all: participants, $size: 2 } });
    if (!conversation) {
      const connected = await Connection.findOne({
        status: "Accepted",
        $or: [{ requester: req.auth.userId, recipient: otherId }, { requester: otherId, recipient: req.auth.userId }],
      });
      if (!connected) {
        return res.status(403).json({ success: false, message: "Connect with this professional before messaging" });
      }
      conversation = await Conversation.create({ participants });
    }
    res.json({ success: true, conversation });
  } catch (error) { next(error); }
};

exports.listMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || !conversation.participants.some((id) => String(id) === String(req.auth.userId))) {
      return res.status(403).json({ success: false, message: "Not part of this conversation" });
    }
    const messages = await ChatMessage.find({ conversation: conversation._id }).sort({ createdAt: 1 }).limit(200).lean();
    await ChatMessage.updateMany(
      { conversation: conversation._id, senderId: { $ne: req.auth.userId } },
      { $addToSet: { readBy: req.auth.userId } },
    );
    const io = req.app.get("io");
    if (io) io.to(`conversation:${conversation._id}`).emit("chat:read", { conversationId: String(conversation._id), userId: req.auth.userId });
    res.json({ success: true, messages, conversation });
  } catch (error) { next(error); }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || !conversation.participants.some((id) => String(id) === String(req.auth.userId))) {
      return res.status(403).json({ success: false, message: "Not part of this conversation" });
    }
    if (!req.body.body?.trim() && !(req.body.attachments || []).length) {
      return res.status(400).json({ success: false, message: "Message body is required" });
    }
    const message = await ChatMessage.create({
      conversation: conversation._id,
      senderId: req.auth.userId,
      body: (req.body.body || "").trim(),
      attachments: req.body.attachments || [],
      readBy: [req.auth.userId],
    });
    conversation.lastMessage = message.body || "Attachment";
    conversation.lastAt = new Date();
    await conversation.save();
    const io = req.app.get("io");
    if (io) {
      io.to(`conversation:${conversation._id}`).emit("chat:message", message);
      conversation.participants.filter((id) => id !== req.auth.userId).forEach((userId) => {
        io.to(`user:${userId}`).emit("chat:message", message);
      });
    }
    const other = conversation.participants.find((id) => id !== req.auth.userId);
    if (other) {
      await createNotification({
        userId: other,
        type: "message",
        title: "New message",
        message: message.body || "You received an attachment.",
        link: "/inbox",
        email: false,
      }, io);
    }
    res.status(201).json({ success: true, message });
  } catch (error) { next(error); }
};
