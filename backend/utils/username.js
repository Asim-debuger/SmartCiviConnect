const User = require("../models/User");

function slugifyName(name = "") {
  const base = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18) || "member";
  return base;
}

async function uniqueUsername(name) {
  const base = slugifyName(name);
  for (let i = 0; i < 12; i += 1) {
    const candidate = i === 0 ? base : `${base}${Math.floor(100 + Math.random() * 900)}`;
    const exists = await User.exists({ username: candidate });
    if (!exists) return candidate;
  }
  return `${base}${Date.now().toString().slice(-6)}`;
}

async function ensureUsername(user) {
  if (user.username) return user;
  user.username = await uniqueUsername(user.name);
  await user.save();
  return user;
}

module.exports = { uniqueUsername, ensureUsername };
