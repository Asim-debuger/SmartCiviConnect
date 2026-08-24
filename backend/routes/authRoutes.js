const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login, refresh, logout, getCurrentUser, forgotPassword, resetPassword, changePassword } = require("../controllers/authController");
const { authenticateUser } = require("../middleware/auth");

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication attempts. Please try again later." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
router.post("/change-password", authenticateUser, changePassword);
router.get("/me", authenticateUser, getCurrentUser);

module.exports = router;
