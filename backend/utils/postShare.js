const Post = require("../models/Post");

async function resolveOriginalPost(post) {
  let current = post;
  const seen = new Set();
  while (current?.sharedFrom) {
    const id = String(current._id);
    if (seen.has(id)) break;
    seen.add(id);
    const next = await Post.findById(current.sharedFrom);
    if (!next) return current.sharedFrom ? null : current;
    current = next;
  }
  return current;
}

const AUTHOR_SELECT = "name role headline profileImage username";

function sharedFromPopulate() {
  return { path: "sharedFrom", populate: { path: "author", select: AUTHOR_SELECT } };
}

module.exports = { resolveOriginalPost, sharedFromPopulate, AUTHOR_SELECT };
