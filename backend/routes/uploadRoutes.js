const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { createUploadSignature, createResumeSignature } = require("../controllers/uploadController");

const router = express.Router();
router.get("/signature", requireAuth, createUploadSignature);
router.get("/resume-signature", requireAuth, createResumeSignature);

module.exports = router;