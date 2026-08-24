const express = require("express");
const { submitContact, contactLimiter, listPublicJobs, listPublicProfessionals, getPublicProfessional, getPublicJob, platformStats, featured, listPublicPosts, getPublicPost } = require("../controllers/publicController");

const router = express.Router();
router.post("/contact", contactLimiter, submitContact);
router.get("/stats", platformStats);
router.get("/featured", featured);
router.get("/jobs", listPublicJobs);
router.get("/jobs/:id", getPublicJob);
router.get("/posts", listPublicPosts);
router.get("/posts/:id", getPublicPost);
router.get("/professionals", listPublicProfessionals);
router.get("/professionals/:id", getPublicProfessional);

module.exports = router;
