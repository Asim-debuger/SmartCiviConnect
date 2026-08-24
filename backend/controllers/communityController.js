const mongoose = require("mongoose");
const Connection = require("../models/Connection");
const Follow = require("../models/Follow");
const Post = require("../models/Post");
const User = require("../models/User");
const SavedPost = require("../models/SavedPost");
const Complaint = require("../models/Complaint");
const { createNotification } = require("../services/notificationService");
const { isRole } = require("../utils/roles");
const { escapeRegex } = require("../utils/escapeRegex");
const { normalizeKind, sanitizePostMedia } = require("../utils/postContent");
const { resolveOriginalPost, sharedFromPopulate } = require("../utils/postShare");
const { sanitizeProfileImage } = require("../utils/profileImage");
const { toSafeNetworkProfile } = require("../utils/networkProfile");

const PROFILE_PUBLIC = "name role headline bio skills city department organization profileImage availability experienceYears experience education certifications achievements projects username";

function pairQuery(a, b) {
  return { $or: [{ requester: a, recipient: b }, { requester: b, recipient: a }] };
}

exports.listDirectory = async (req, res, next) => {
  try {
    const { search, role, department, skill, location } = req.query;
    const query = { active: { $ne: false }, _id: { $ne: req.auth.userId } };
    if (typeof role === "string" && role !== "All") query.role = role;
    if (department && department !== "All") query.department = new RegExp(escapeRegex(String(department)), "i");
    if (skill) query.skills = new RegExp(escapeRegex(String(skill)), "i");
    if (location) query.city = new RegExp(escapeRegex(String(location)), "i");
    if (search) {
      const pattern = escapeRegex(String(search));
      query.$or = [
        { name: new RegExp(pattern, "i") },
        { skills: new RegExp(pattern, "i") },
        { headline: new RegExp(pattern, "i") },
        { department: new RegExp(pattern, "i") },
        { city: new RegExp(pattern, "i") },
      ];
    }
    const users = await User.find(query).select(PROFILE_PUBLIC).limit(80).lean();
    const mine = req.auth.userId;
    const ids = users.map((item) => item._id);
    const [accepted, pendingOut, pendingIn, following] = await Promise.all([
      Connection.find({ status: "Accepted", $or: [{ requester: mine, recipient: { $in: ids } }, { recipient: mine, requester: { $in: ids } }] }).lean(),
      Connection.find({ status: "Pending", requester: mine, recipient: { $in: ids } }).lean(),
      Connection.find({ status: "Pending", recipient: mine, requester: { $in: ids } }).lean(),
      Follow.find({ follower: mine, following: { $in: ids } }).lean(),
    ]);
    const connected = new Set(accepted.map((item) => String(item.requester) === mine ? String(item.recipient) : String(item.requester)));
    const requested = new Set(pendingOut.map((item) => String(item.recipient)));
    const incoming = new Set(pendingIn.map((item) => String(item.requester)));
    const follows = new Set(following.map((item) => String(item.following)));
    res.json({
      success: true,
      people: users.map((person) => ({
        ...toSafeNetworkProfile(person, { isSelf: false }),
        relation: {
          connected: connected.has(String(person._id)),
          requested: requested.has(String(person._id)),
          incoming: incoming.has(String(person._id)),
          following: follows.has(String(person._id)),
        },
      })),
    });
  } catch (error) { next(error); }
};

exports.requestConnection = async (req, res, next) => {
  try {
    const recipient = req.body.userId;
    if (!recipient || !mongoose.isValidObjectId(recipient) || String(recipient) === String(req.auth.userId)) {
      return res.status(400).json({ success: false, message: "Invalid connection target" });
    }
    const existing = await Connection.findOne(pairQuery(req.auth.userId, recipient));
    if (existing) {
      if (existing.status === "Rejected") {
        existing.status = "Pending";
        existing.requester = req.auth.userId;
        existing.recipient = recipient;
        await existing.save();
        await createNotification({
          userId: recipient,
          type: "connection",
          title: "New connection request",
          message: `${req.user.name} wants to connect with you.`,
          link: "/network",
        }, req.app.get("io"));
        return res.status(201).json({ success: true, connection: existing });
      }
      return res.status(409).json({ success: false, message: "Connection already exists", connection: existing });
    }
    const connection = await Connection.create({ requester: req.auth.userId, recipient });
    await createNotification({
      userId: recipient,
      type: "connection",
      title: "New connection request",
      message: `${req.user.name} wants to connect with you.`,
      link: "/network",
    }, req.app.get("io"));
    res.status(201).json({ success: true, connection });
  } catch (error) { next(error); }
};

exports.respondConnection = async (req, res, next) => {
  try {
    const connection = await Connection.findById(req.params.id);
    if (!connection || String(connection.recipient) !== req.auth.userId) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    connection.status = req.body.status === "Accepted" ? "Accepted" : "Rejected";
    await connection.save();
    if (connection.status === "Accepted") {
      await createNotification({
        userId: String(connection.requester),
        type: "connection",
        title: "Connection accepted",
        message: `${req.user.name} accepted your connection request.`,
        link: "/network",
      }, req.app.get("io"));
    }
    res.json({ success: true, connection });
  } catch (error) { next(error); }
};

exports.listConnections = async (req, res, next) => {
  try {
    const mine = req.auth.userId;
    const pending = await Connection.find({ recipient: mine, status: "Pending" }).populate("requester", "name role headline profileImage department skills city").lean();
    const accepted = await Connection.find({ status: "Accepted", $or: [{ requester: mine }, { recipient: mine }] })
      .populate("requester", "name role headline profileImage department skills city")
      .populate("recipient", "name role headline profileImage department skills city")
      .lean();
    const connections = accepted.map((item) => {
      const other = String(item.requester._id) === mine ? item.recipient : item.requester;
      return { ...item, person: other };
    });
    res.json({ success: true, pending, connections, count: connections.length });
  } catch (error) { next(error); }
};

exports.listFeed = async (req, res, next) => {
  try {
    const mine = req.auth.userId;
    const limit = Math.min(Number(req.query.limit) || 12, 30);
    const before = req.query.before ? new Date(req.query.before) : null;
    const [accepted, follows, me] = await Promise.all([
      Connection.find({ status: "Accepted", $or: [{ requester: mine }, { recipient: mine }] }).lean(),
      Follow.find({ follower: mine }).select("following").lean(),
      User.findById(mine).select("savedPosts").lean(),
    ]);
    const networkIds = new Set([mine]);
    accepted.forEach((item) => {
      networkIds.add(String(item.requester));
      networkIds.add(String(item.recipient));
    });
    follows.forEach((item) => networkIds.add(String(item.following)));
    const query = {
      $or: [
        { author: { $in: [...networkIds] } },
        { kind: { $in: ["Announcement", "Job Opportunity", "Job", "Community Update", "Community"] } },
      ],
    };
    if (before && !Number.isNaN(before.getTime())) query.createdAt = { $lt: before };
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "name role headline profileImage department organization username")
      .populate(sharedFromPopulate())
      .populate("comments.author", "name profileImage headline")
      .populate("comments.replies.author", "name profileImage")
      .lean();
    const saved = new Set((me?.savedPosts || []).map(String));
    res.json({
      success: true,
      hasMore: posts.length === limit,
      nextCursor: posts.length ? posts[posts.length - 1].createdAt : null,
      posts: posts.map((post) => ({
        ...post,
        kind: normalizeKind(post.kind),
        isRepost: Boolean(post.isRepost || post.sharedFrom),
        saved: saved.has(String(post._id)) || (post.saves || []).includes(mine),
        recommended: !networkIds.has(String(post.author?._id || post.author)),
      })),
    });
  } catch (error) { next(error); }
};

exports.trendingPosts = async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const posts = await Post.find({ createdAt: { $gte: since } })
      .sort({ shares: -1, createdAt: -1 })
      .limit(8)
      .populate("author", "name headline profileImage role")
      .lean();
    posts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    res.json({ success: true, posts: posts.slice(0, 6).map((post) => ({ ...post, kind: normalizeKind(post.kind) })) });
  } catch (error) { next(error); }
};

async function fetchLinkPreview(url) {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  try {
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(4000) });
    const html = await response.text();
    const pick = (pattern) => html.match(pattern)?.[1]?.trim();
    return {
      url,
      title: pick(/property="og:title"[^>]*content="([^"]+)"/i) || pick(/<title>([^<]+)<\/title>/i) || url,
      image: pick(/property="og:image"[^>]*content="([^"]+)"/i) || "",
      description: pick(/property="og:description"[^>]*content="([^"]+)"/i) || "",
    };
  } catch {
    return { url, title: url, image: "", description: "" };
  }
}

exports.createPost = async (req, res, next) => {
  try {
    const text = String(req.body.body || req.body.content || req.body.text || "").trim();
    const media = sanitizePostMedia(req.body.media);
    const link = String(req.body.link || "").trim();
    if (!text && !media.length && !link) {
      return res.status(400).json({ success: false, message: "Add text, a file, or a link before publishing" });
    }
    const linkPreview = link ? await fetchLinkPreview(link) : null;
    const post = await Post.create({
      author: req.auth.userId,
      body: text,
      kind: normalizeKind(req.body.kind),
      media,
      link,
      linkPreview,
      visibility: "public",
    });
    const populated = await post.populate("author", "name role headline profileImage department");
    res.status(201).json({ success: true, post: populated });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message || "This post could not be published. Check text, media, and category." });
    }
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    const id = req.auth.userId;
    const liked = (post.likes || []).includes(id);
    post.likes = liked ? post.likes.filter((item) => item !== id) : [...(post.likes || []), id];
    await post.save();
    if (!liked && String(post.author) !== id) {
      await createNotification({
        userId: post.author,
        type: "post",
        title: "Post liked",
        message: `${req.user.name} liked your post.`,
        link: "/feed",
        email: false,
      }, req.app.get("io"));
    }
    res.json({ success: true, likes: post.likes.length, liked: !liked });
  } catch (error) { next(error); }
};

exports.commentPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (!req.body.body?.trim()) return res.status(400).json({ success: false, message: "Comment is required" });
    if (req.body.commentId) {
      const comment = post.comments.id(req.body.commentId);
      if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
      comment.replies.push({ author: req.auth.userId, body: req.body.body.trim() });
    } else {
      post.comments.push({ author: req.auth.userId, body: req.body.body.trim() });
    }
    await post.save();
    await post.populate("comments.author", "name profileImage headline");
    await post.populate("comments.replies.author", "name profileImage");
    if (String(post.author) !== req.auth.userId) {
      await createNotification({
        userId: post.author,
        type: "post",
        title: req.body.commentId ? "New reply" : "New comment",
        message: `${req.user.name} commented on your post.`,
        link: "/feed",
        email: false,
      }, req.app.get("io"));
    }
    res.json({ success: true, post });
  } catch (error) { next(error); }
};

exports.sharePost = async (req, res, next) => {
  try {
    const clicked = await Post.findById(req.params.id);
    if (!clicked) return res.status(404).json({ success: false, message: "Post not found" });
    const original = await resolveOriginalPost(clicked);
    if (!original) return res.status(404).json({ success: false, message: "Original post is no longer available" });
    original.shares = (original.shares || 0) + 1;
    await original.save();
    const commentary = String(req.body.body || req.body.note || "").trim();
    const share = await Post.create({
      author: req.auth.userId,
      body: commentary,
      kind: original.kind,
      sharedFrom: original._id,
      isRepost: true,
      visibility: "public",
      media: [],
    });
    if (String(original.author) !== req.auth.userId) {
      await createNotification({
        userId: original.author,
        type: "post",
        title: "Post shared",
        message: `${req.user.name} shared your post.`,
        link: "/feed",
        email: false,
      }, req.app.get("io"));
    }
    const populated = await Post.findById(share._id)
      .populate("author", "name role headline profileImage username")
      .populate(sharedFromPopulate());
    res.json({ success: true, shares: original.shares, post: populated });
  } catch (error) { next(error); }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (String(post.author) !== req.auth.userId && !isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "You can only delete your own posts" });
    }
    const originalId = post.sharedFrom;
    await post.deleteOne();
    if (originalId) {
      await Post.updateOne({ _id: originalId, shares: { $gt: 0 } }, { $inc: { shares: -1 } });
    }
    res.json({ success: true });
  } catch (error) { next(error); }
};

exports.likeComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    const comment = post.comments.id(req.body.commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    const id = req.auth.userId;
    comment.likes = (comment.likes || []).includes(id) ? comment.likes.filter((item) => item !== id) : [...(comment.likes || []), id];
    await post.save();
    res.json({ success: true, likes: comment.likes.length });
  } catch (error) { next(error); }
};

exports.savePost = async (req, res, next) => {
  try {
    const user = req.user;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    const existing = await SavedPost.findOne({ userId: req.auth.userId, postId });
    if (existing) {
      await existing.deleteOne();
      user.savedPosts = (user.savedPosts || []).filter((item) => String(item) !== postId);
      post.saves = (post.saves || []).filter((item) => item !== req.auth.userId);
      await user.save();
      await post.save();
      return res.json({ success: true, saved: false });
    }
    await SavedPost.create({ userId: req.auth.userId, postId: post._id });
    user.savedPosts = [...(user.savedPosts || []).filter((item) => String(item) !== postId), post._id];
    if (!post.saves.includes(req.auth.userId)) post.saves.push(req.auth.userId);
    await user.save();
    await post.save();
    res.json({ success: true, saved: true });
  } catch (error) { next(error); }
};

exports.savedPosts = async (req, res, next) => {
  try {
    const saved = await SavedPost.find({ userId: req.auth.userId }).sort({ createdAt: -1 }).lean();
    const ids = saved.map((item) => item.postId);
    const posts = await Post.find({ _id: { $in: ids } })
      .populate("author", "name role headline profileImage")
      .populate(sharedFromPopulate())
      .lean();
    const order = new Map(ids.map((id, index) => [String(id), index]));
    posts.sort((a, b) => (order.get(String(a._id)) ?? 0) - (order.get(String(b._id)) ?? 0));
    res.json({ success: true, posts: posts.map((post) => ({ ...post, kind: normalizeKind(post.kind), saved: true })) });
  } catch (error) { next(error); }
};

exports.removeConnection = async (req, res, next) => {
  try {
    const connection = await Connection.findById(req.params.id);
    if (!connection) return res.status(404).json({ success: false, message: "Connection not found" });
    const mine = req.auth.userId;
    if (String(connection.requester) !== mine && String(connection.recipient) !== mine) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    await connection.deleteOne();
    res.json({ success: true });
  } catch (error) { next(error); }
};

exports.getPublicProfile = async (req, res, next) => {
  try {
    const key = req.params.id;
    const query = mongoose.isValidObjectId(key)
      ? { $or: [{ _id: key }, { username: String(key).toLowerCase() }] }
      : { username: String(key).toLowerCase() };
    const user = await User.findOne(query).select(`${PROFILE_PUBLIC} email phone resumeFileName resumeFileType resumeUploadedAt +resumePublicId`).lean();
    if (!user) return res.status(404).json({ success: false, message: "Profile not found" });
    const [followers, following, connected, completedWorks, relationConn, relationFollow] = await Promise.all([
      Follow.countDocuments({ following: user._id }),
      Follow.countDocuments({ follower: user._id }),
      Connection.countDocuments({ status: "Accepted", $or: [{ requester: user._id }, { recipient: user._id }] }),
      Complaint.countDocuments({ assignedStaffId: String(user._id), status: "Completed" }),
      Connection.findOne({ status: "Accepted", ...pairQuery(req.auth.userId, user._id) }),
      Follow.findOne({ follower: req.auth.userId, following: user._id }),
    ]);
    const pending = await Connection.findOne({ status: "Pending", ...pairQuery(req.auth.userId, user._id) });
    const isSelf = String(user._id) === String(req.auth.userId);
    const profile = toSafeNetworkProfile(user, { isSelf });
    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate(sharedFromPopulate())
      .lean();
    res.json({
      success: true,
      profile: { ...profile, completedWorks },
      posts: posts.map((post) => ({ ...post, kind: normalizeKind(post.kind) })),
      stats: { followers, following, connections: connected, completedWorks },
      relation: {
        connected: Boolean(relationConn),
        following: Boolean(relationFollow),
        pending: Boolean(pending),
        incoming: Boolean(pending && String(pending.recipient) === req.auth.userId),
      },
    });
  } catch (error) { next(error); }
};

exports.toggleFollow = async (req, res, next) => {
  try {
    const target = req.body.userId;
    if (!target || !mongoose.isValidObjectId(target) || String(target) === String(req.auth.userId)) {
      return res.status(400).json({ success: false, message: "Invalid follow target" });
    }
    const existing = await Follow.findOne({ follower: req.auth.userId, following: target });
    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, following: false });
    }
    await Follow.create({ follower: req.auth.userId, following: target });
    await createNotification({
      userId: target,
      type: "social",
      title: "New follower",
      message: `${req.user.name} started following you.`,
      link: "/network",
      email: false,
    }, req.app.get("io"));
    res.json({ success: true, following: true });
  } catch (error) { next(error); }
};

exports.listFollows = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.auth.userId;
    const [followers, following] = await Promise.all([
      Follow.find({ following: userId }).populate("follower", "name role headline profileImage").lean(),
      Follow.find({ follower: userId }).populate("following", "name role headline profileImage").lean(),
    ]);
    res.json({ success: true, followers, following });
  } catch (error) { next(error); }
};

exports.recommendPeople = async (req, res, next) => {
  try {
    const me = req.user;
    const exclude = [req.auth.userId];
    const connected = await Connection.find({
      status: { $in: ["Accepted", "Pending"] },
      $or: [{ requester: req.auth.userId }, { recipient: req.auth.userId }],
    }).lean();
    connected.forEach((item) => {
      exclude.push(String(item.requester));
      exclude.push(String(item.recipient));
    });
    const candidates = await User.find({ active: { $ne: false }, _id: { $nin: exclude } })
      .select("name role headline skills city department organization profileImage experienceYears")
      .limit(80)
      .lean();
    const scored = candidates.map((person) => {
      let score = 0;
      const reasons = [];
      if (me.department && person.department && me.department.toLowerCase() === person.department.toLowerCase()) {
        score += 5;
        reasons.push("Same department");
      }
      if (me.city && person.city && me.city.toLowerCase() === person.city.toLowerCase()) {
        score += 3;
        reasons.push("Same location");
      }
      const overlap = (person.skills || []).filter((skill) => (me.skills || []).some((mine) => mine.toLowerCase() === skill.toLowerCase()));
      if (overlap.length) {
        score += overlap.length * 2;
        reasons.push(`Shared skills: ${overlap.slice(0, 2).join(", ")}`);
      }
      if (me.role === "Officer" && ["Staff", "Head Officer"].includes(person.role)) score += 2;
      if (me.role === "Staff" && ["Officer", "Staff"].includes(person.role)) score += 2;
      return { ...person, profileImage: sanitizeProfileImage(person.profileImage), score, reason: reasons[0] || "Suggested professional" };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
    res.json({ success: true, people: scored });
  } catch (error) { next(error); }
};

exports.recommendPeople = exports.recommendPeople;
exports.requestConnection = exports.requestConnection;
exports.respondConnection = exports.respondConnection;
exports.listFollows = exports.listFollows;
exports.toggleFollow = exports.toggleFollow;
exports.getPublicProfile = exports.getPublicProfile;
exports.trendingPosts = exports.trendingPosts;
exports.savedPosts = exports.savedPosts;
exports.listFeed = exports.listFeed;
exports.likePost = exports.likePost;
exports.commentPost = exports.commentPost;
exports.likeComment = exports.likeComment;
exports.sharePost = exports.sharePost;
exports.deletePost = exports.deletePost;
exports.savePost = exports.savePost;
