// const express = require("express");
// const controller = require("../controllers/complaintController");
// const { requireAuth, requireRoles } = require("../middleware/auth");

// const router = express.Router();
// router.use(requireAuth);
// router.post("/", requireRoles("Citizen"), controller.createComplaint);
// router.get("/my", requireRoles("Citizen"), controller.getMyComplaints);
// router.get("/:id", controller.getComplaintById);
// router.put("/:id", controller.updateComplaint);
// router.patch("/:id/status", requireRoles("Admin", "Super Admin", "Head Officer"), controller.changeStatus);

// module.exports = router;









const express = require("express");
const controller = require("../controllers/complaintController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// All complaint routes require a user to be logged in.
router.use(authenticateUser);

// Specific roles are required for certain actions.
router.post("/", authorizeRoles("Citizen"), controller.createComplaint);
router.get("/my", authorizeRoles("Citizen"), controller.getMyComplaints);
router.get("/suggest", controller.suggest);
router.get("/:id", controller.getComplaintById);

// Only the citizen who created the complaint can update it (e.g., add a rating).
router.put("/:id", authorizeRoles("Citizen"), controller.updateComplaint);

// Changing a complaint's core status (e.g., verifying) is an admin/officer action.
router.patch("/:id/status", authorizeRoles("Admin", "Super Admin", "Head Officer"), controller.changeStatus);

module.exports = router;
