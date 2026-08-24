const Notification = require("../models/Notification");
const User = require("../models/User");
const { sendEmail } = require("./emailService");

function inferCategory(type) {
  if (type === "assignment") return "assignment";
  if (["task", "workload"].includes(type)) return "task";
  if (type === "application") return "application";
  if (type === "connection") return "connection";
  if (["social", "post"].includes(type)) return "post";
  if (["status", "verification", "rejection", "completion", "progress", "feedback"].includes(type)) return "complaint";
  if (type === "payment") return "payment";
  if (type === "job") return "job";
  if (type === "message") return "message";
  return "system";
}

async function createNotification({ userId, type = "system", title, message, link, category, complaintId, email = true }, io) {
  if (!userId || !title || !message) return null;
  const notification = await Notification.create({
    userId: String(userId),
    type,
    category: category || inferCategory(type),
    title,
    message,
    link,
    complaintId,
  });
  if (io) io.to(`user:${String(userId)}`).emit("notification:new", notification);
  if (email) {
    const user = await User.findById(userId).select("email").lean();
    if (user?.email) {
      sendEmail({ to: user.email, subject: title, html: `<p>${message}</p>` }).catch((error) => console.error("Email failed", error.message));
    }
  }
  return notification;
}

async function notifyRoles(roles, payload, io) {
  const users = await User.find({ role: { $in: roles }, active: { $ne: false } }).select("_id").lean();
  await Promise.all(users.map((user) => createNotification({ ...payload, userId: user._id.toString() }, io)));
}

async function notifyMany(userIds, payload, io) {
  const unique = [...new Set((userIds || []).filter(Boolean).map(String))];
  await Promise.all(unique.map((userId) => createNotification({ ...payload, userId }, io)));
}

module.exports = { createNotification, notifyRoles, notifyMany, inferCategory };
