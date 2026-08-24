const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendWelcomeEmail, sendPasswordResetEmail } = require("../services/emailService");
const { validatePassword } = require("../utils/password");
const { uniqueUsername, ensureUsername } = require("../utils/username");
const { sanitizeProfileImage } = require("../utils/profileImage");

const ACCESS_TTL = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_DAYS = Number(process.env.JWT_REFRESH_DAYS || 7);
const REFRESH_TTL_MS = REFRESH_DAYS * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE = "scc_refresh";
const ISSUER = "smartciviconnect";

function accessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET (or JWT_SECRET) is not configured");
  }
  return secret;
}

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      name: user.name,
    },
    accessSecret(),
    { expiresIn: ACCESS_TTL, issuer: ISSUER },
  );
}

function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: REFRESH_TTL_MS,
  };
}

function fail(next, res, error) {
  if (typeof next === "function") return next(error);
  console.error(error);
  return res.status(500).json({ success: false, message: error.message || "Internal server error" });
}

async function issueRefreshCookie(res, user) {
  const rawToken = jwt.sign(
    { sub: user._id.toString(), typ: "refresh" },
    accessSecret(),
    { expiresIn: `${REFRESH_DAYS}d`, issuer: ISSUER },
  );
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
  user.refreshTokens = (user.refreshTokens || []).filter((entry) => entry.expiresAt > new Date());
  user.refreshTokens.push({ tokenHash: hashToken(rawToken), expiresAt });
  await user.save();
  res.cookie(REFRESH_COOKIE, rawToken, cookieOptions());
}

function toSafeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    username: user.username || "",
    role: user.role,
    profileImage: sanitizeProfileImage(user.profileImage),
    phone: user.phone || "",
    department: user.department || "",
    skills: user.skills || [],
    headline: user.headline || "",
    bio: user.bio || "",
    city: user.city || "",
    organization: user.organization || "",
    hasResume: Boolean(user.resumePublicId),
    resumeFileName: user.resumeFileName || "",
    resumeFileType: user.resumeFileType || "",
    resumeUploadedAt: user.resumeUploadedAt || null,
    active: user.active !== false,
  };
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ success: false, message: passwordError });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "Citizen",
      username: await uniqueUsername(name.trim()),
    });

    await issueRefreshCookie(res, user);
    sendWelcomeEmail(user).catch((error) => console.error("Welcome email failed", error.message));
    return res.status(201).json({
      success: true,
      accessToken: signAccessToken(user),
      user: toSafeUser(user),
    });
  } catch (error) {
    console.error("Register failed:", error.code || error.name, error.message);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }
    return fail(next, res, error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select("+password +refreshTokens");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    if (!user.active) {
      return res.status(403).json({ success: false, message: "This account has been deactivated" });
    }

    await ensureUsername(user);
    await issueRefreshCookie(res, user);
    return res.json({
      success: true,
      accessToken: signAccessToken(user),
      user: toSafeUser(user),
    });
  } catch (error) {
    return fail(next, res, error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const raw = req.cookies?.[REFRESH_COOKIE];
    if (!raw) {
      return res.status(401).json({ success: false, message: "No refresh token present" });
    }

    try {
      const payload = jwt.verify(raw, accessSecret(), { issuer: ISSUER });
      if (payload.typ && payload.typ !== "refresh") {
        throw new Error("Invalid refresh token type");
      }
    } catch {
      res.clearCookie(REFRESH_COOKIE, cookieOptions());
      return res.status(401).json({ success: false, message: "Refresh token is invalid or expired" });
    }

    const tokenHash = hashToken(raw);
    const user = await User.findOne({
      "refreshTokens.tokenHash": tokenHash,
      "refreshTokens.expiresAt": { $gt: new Date() },
    }).select("+refreshTokens +resumePublicId");

    if (!user || !user.active) {
      res.clearCookie(REFRESH_COOKIE, cookieOptions());
      return res.status(401).json({ success: false, message: "Refresh token is invalid or expired" });
    }

    user.refreshTokens = (user.refreshTokens || []).filter((entry) => entry.tokenHash !== tokenHash);
    await ensureUsername(user);
    await issueRefreshCookie(res, user);
    return res.json({
      success: true,
      accessToken: signAccessToken(user),
      user: toSafeUser(user),
    });
  } catch (error) {
    return fail(next, res, error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const raw = req.cookies?.[REFRESH_COOKIE];
    if (raw) {
      const tokenHash = hashToken(raw);
      await User.updateOne(
        { "refreshTokens.tokenHash": tokenHash },
        { $pull: { refreshTokens: { tokenHash } } },
      );
    }
    res.clearCookie(REFRESH_COOKIE, cookieOptions());
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return fail(next, res, error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    await ensureUsername(req.user);
    return res.json({ success: true, user: toSafeUser(req.user) });
  } catch (error) {
    return fail(next, res, error);
  }
};

function appOrigin(req) {
  return process.env.CLIENT_URL || process.env.FRONTEND_URL || process.env.APP_URL || req.headers.origin || "http://localhost:5173";
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    console.log("Forgot password requested", email);
    const user = await User.findOne({ email });
    if (user && user.active !== false) {
      const raw = crypto.randomBytes(32).toString("hex");
      user.passwordReset = { tokenHash: hashToken(raw), expiresAt: new Date(Date.now() + 60 * 60 * 1000) };
      await user.save();
      const link = `${appOrigin(req)}/reset-password/${raw}`;
      try {
        await sendPasswordResetEmail(user, link);
        console.log("Reset email sent successfully");
      } catch (emailError) {
        console.error("Reset email failed", emailError.message);
        return res.status(502).json({ success: false, message: emailError.message || "Unable to send the reset email. Please try again." });
      }
    } else {
      console.log("Forgot password: no active account for that email");
    }
    return res.json({ success: true, message: "If that email is registered, a reset link has been sent." });
  } catch (error) {
    return fail(next, res, error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const passwordError = validatePassword(password);
    if (!token || passwordError) {
      return res.status(400).json({ success: false, message: passwordError || "Reset token and password are required" });
    }
    const tokenHash = hashToken(String(token));
    const user = await User.findOne({
      "passwordReset.tokenHash": tokenHash,
      "passwordReset.expiresAt": { $gt: new Date() },
    }).select("+password +refreshTokens");
    if (!user) return res.status(400).json({ success: false, message: "This reset link is invalid or has expired" });
    user.password = password;
    user.passwordReset = undefined;
    user.refreshTokens = [];
    await user.save();
    return res.json({ success: true, message: "Password updated. You can log in now." });
  } catch (error) {
    return fail(next, res, error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const passwordError = validatePassword(newPassword);
    if (passwordError) return res.status(400).json({ success: false, message: passwordError });
    const user = await User.findById(req.auth.userId).select("+password +refreshTokens");
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }
    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();
    await issueRefreshCookie(res, user);
    return res.json({ success: true, message: "Password changed", accessToken: signAccessToken(user), user: toSafeUser(user) });
  } catch (error) {
    return fail(next, res, error);
  }
};
