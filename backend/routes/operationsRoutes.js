const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const operations = require("../controllers/operationsController");

const router = express.Router();
router.use(authenticateUser);

router.get("/admin/complaints", authorizeRoles("Admin", "Super Admin", "Head Officer"), operations.listComplaints);
router.get("/admin/stats", authorizeRoles("Admin", "Super Admin", "Head Officer"), operations.dashboardStats);
router.patch("/admin/complaints/:id/assign", authorizeRoles("Admin", "Super Admin", "Head Officer"), operations.assignComplaint);

router.get("/assigned", authorizeRoles("Officer", "Head Officer", "Staff"), operations.listAssigned);
router.get("/workers", authorizeRoles("Officer", "Head Officer", "Admin", "Super Admin"), operations.listWorkers);
router.get("/department/overview", authorizeRoles("Head Officer", "Admin", "Super Admin"), operations.departmentOverview);

router.post("/officer/complaints/:id/accept", authorizeRoles("Officer", "Head Officer"), operations.acceptComplaint);
router.patch("/officer/complaints/:id/staff", authorizeRoles("Officer", "Head Officer", "Admin", "Super Admin"), operations.assignStaff);
router.post("/officer/complaints/:id/reject", authorizeRoles("Officer", "Head Officer", "Admin", "Super Admin"), operations.rejectComplaint);

router.patch("/tasks/:id", authorizeRoles("Officer", "Head Officer", "Staff", "Admin", "Super Admin"), operations.updateTask);
router.post("/tasks/:id/verify", authorizeRoles("Admin", "Super Admin", "Head Officer", "Officer"), operations.verifyTask);
router.post("/tasks/:id/reject-evidence", authorizeRoles("Admin", "Super Admin", "Head Officer", "Officer"), operations.rejectEvidence);

router.get("/complaints/:id/messages", operations.listMessages);
router.post("/complaints/:id/messages", operations.sendMessage);

router.post("/location", authorizeRoles("Staff"), operations.updateLocation);
router.get("/locations", operations.listLiveLocations);

module.exports = router;
