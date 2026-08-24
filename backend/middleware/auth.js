const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { normalizeRole } = require("../utils/roles");

const ISSUER = "smartciviconnect";

function accessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET (or JWT_SECRET) is not configured");
  }
  return secret;
}

function extractBearerToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : null;
}

async function authenticateUser(req, res, next) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  let payload;
  try {
    payload = jwt.verify(token, accessSecret(), { issuer: ISSUER });
  } catch (error) {
    const expired = error.name === "TokenExpiredError";
    return res.status(401).json({
      success: false,
      message: expired ? "Access token expired" : "Invalid authentication token",
      code: expired ? "TOKEN_EXPIRED" : "TOKEN_INVALID",
    });
  }

  try {
    const user = await User.findById(payload.sub).select("+resumePublicId +resumeFileName +resumeFileType +resumeUploadedAt");
    if (!user) {
      return res.status(401).json({ success: false, message: "Account not found" });
    }
    if (!user.active) {
      return res.status(403).json({ success: false, message: "This account has been deactivated" });
    }

    const userId = user._id.toString();
    req.user = user;
    req.user = user;
    req.auth = {
      userId,
      userId,
      user,
      role: user.role,
    };
    return next();
  } catch (error) {
    return next(error);
  }
}

function authorizeRoles(...roles) {
  const allowed = roles.map(normalizeRole);
  return (req, res, next) => {
    if (!req.auth?.role) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    if (!allowed.includes(normalizeRole(req.auth.role))) {
      return res.status(403).json({ success: false, message: "You do not have permission to perform this action" });
    }
    return next();
  };
}

module.exports = {
  authenticateUser,
  authorizeRoles,
  authenticate: authenticateUser,
  requireAuth: authenticateUser,
  requireUser: authenticateUser,
  requireRoles: authorizeRoles,
};
