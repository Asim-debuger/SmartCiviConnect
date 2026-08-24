const Notification = require("../models/Notification");
const { isRole } = require("../utils/roles");

exports.listMine = async (req, res, next) => {
  try {
    const { category, unread } = req.query;
    const query = { userId: req.auth.userId };
    if (isRole(req.auth.role, "Citizen")) query.category = { $ne: "payment" };
    if (category === "social") query.category = { $in: ["social", "post", "connection"] };
    else if (category && category !== "all") {
      if (isRole(req.auth.role, "Citizen") && category === "payment") {
        return res.json({ success: true, notifications: [], unread: 0 });
      }
      query.category = category;
    }
    if (unread === "true") query.read = false;
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(150).lean();
    const unreadQuery = { userId: req.auth.userId, read: false };
    if (isRole(req.auth.role, "Citizen")) unreadQuery.category = { $ne: "payment" };
    const unreadCount = await Notification.countDocuments(unreadQuery);
    res.json({ success: true, notifications, unread: unreadCount });
  } catch (error) { next(error); }
};

exports.markRead = async (req, res, next) => {
  try {
    await Notification.updateOne({ _id: req.params.id, userId: req.auth.userId }, { read: true });
    res.json({ success: true });
  } catch (error) { next(error); }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.auth.userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    await Notification.deleteOne({ _id: req.params.id, userId: req.auth.userId });
    res.json({ success: true });
  } catch (error) { next(error); }
};

exports.markRead = exports.markRead;
exports.markAllRead = exports.markAllRead;
