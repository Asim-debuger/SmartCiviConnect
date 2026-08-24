const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const jobs = require("../controllers/jobController");
const community = require("../controllers/communityController");
const chat = require("../controllers/chatController");

const router = express.Router();
router.use(authenticateUser);

router.get("/jobs", jobs.listJobs);
router.post("/jobs", authorizeRoles("Admin", "Super Admin", "Head Officer"), jobs.createJob);
router.get("/jobs/applications/mine", jobs.myApplications);
router.get("/jobs/applications/:applicationId/resume", jobs.accessApplicationResume);
router.get("/jobs/applications/:applicationId/documents/:index", jobs.accessApplicationDocument);
router.get("/jobs/applications/:applicationId", jobs.getApplication);
router.patch("/jobs/applications/:applicationId/materials", jobs.updateApplicationMaterials);
router.patch("/jobs/applications/:applicationId", authorizeRoles("Admin", "Super Admin", "Head Officer"), jobs.updateApplication);
router.get("/jobs/:id", jobs.getJob);
router.patch("/jobs/:id", authorizeRoles("Admin", "Super Admin", "Head Officer"), jobs.updateJob);
router.post("/jobs/:id/apply", jobs.apply);
router.get("/jobs/:id/applications", authorizeRoles("Admin", "Super Admin", "Head Officer"), jobs.listApplications);

router.get("/network/people", community.listDirectory);
router.get("/network/recommendations", community.recommendPeople);
router.get("/network/connections", community.listConnections);
router.post("/network/connections", community.requestConnection);
router.patch("/network/connections/:id", community.respondConnection);
router.get("/network/follows", community.listFollows);
router.post("/network/follow", community.toggleFollow);
router.get("/network/profile/:id", community.getPublicProfile);
router.delete("/network/connections/:id", community.removeConnection);

router.get("/feed/trending", community.trendingPosts);
router.get("/feed/saved", community.savedPosts);
router.get("/feed", community.listFeed);
router.post("/feed", community.createPost);
router.post("/feed/:id/like", community.likePost);
router.post("/feed/:id/comment", community.commentPost);
router.post("/feed/:id/comments/like", community.likeComment);
router.post("/feed/:id/share", community.sharePost);
router.post("/feed/:id/save", community.savePost);
router.delete("/feed/:id", community.deletePost);

router.get("/inbox", chat.listConversations);
router.post("/inbox", chat.openConversation);
router.get("/inbox/:id/messages", chat.listMessages);
router.post("/inbox/:id/messages", chat.sendMessage);

module.exports = router;
