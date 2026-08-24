const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  likes: { type: [String], default: [] },
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  likes: { type: [String], default: [] },
  replies: { type: [replySchema], default: [] },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  body: { type: String, default: "", trim: true, maxlength: 5000 },
  kind: {
    type: String,
    enum: [
      "Professional Achievement",
      "Work Update",
      "Job Opportunity",
      "Community Update",
      "Announcement",
      "Project",
      "Achievement",
      "Job",
      "Community",
      "post",
      "update",
      "achievement",
      "work",
    ],
    default: "Community Update",
    index: true,
  },
  link: { type: String, default: "" },
  linkPreview: {
    url: String,
    title: String,
    description: String,
    image: String,
  },
  media: [{ url: String, resourceType: { type: String, default: "image" }, name: String }],
  visibility: { type: String, enum: ["public", "connections"], default: "public", index: true },
  likes: { type: [String], default: [] },
  comments: { type: [commentSchema], default: [] },
  shares: { type: Number, default: 0 },
  saves: { type: [String], default: [] },
  sharedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
  isRepost: { type: Boolean, default: false, index: true },
}, { timestamps: true });

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ likes: 1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
