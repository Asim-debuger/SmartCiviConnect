const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const platform = require("../controllers/platformController");
const notifications = require("../controllers/notificationController");
const payments = require("../controllers/paymentController");

const router = express.Router();
router.use(authenticateUser);

router.get("/departments", platform.listDepartments);
router.post("/departments", authorizeRoles("Admin", "Super Admin"), platform.createDepartment);
router.patch("/departments/:id", authorizeRoles("Admin", "Super Admin"), platform.updateDepartment);
router.post("/departments/:id/officers", authorizeRoles("Admin", "Super Admin", "Head Officer"), platform.assignOfficer);

router.get("/notifications", notifications.listMine);
router.patch("/notifications/:id/read", notifications.markRead);
router.delete("/notifications/:id", notifications.remove);
router.post("/notifications/read-all", notifications.markAllRead);

router.get("/payments", authorizeRoles("Staff", "Admin", "Super Admin"), payments.listPayments);
router.get("/payments/summary", authorizeRoles("Admin", "Super Admin"), payments.summary);
router.post("/payments/verify", authorizeRoles("Admin", "Super Admin"), payments.verifyPayment);
router.post("/payments", authorizeRoles("Admin", "Super Admin"), payments.createPayment);
router.get("/payments/:id/invoice", authorizeRoles("Staff", "Admin", "Super Admin"), payments.invoice);
router.get("/payments/:id", authorizeRoles("Staff", "Admin", "Super Admin"), payments.getPayment);
router.post("/payments/:id/approve", authorizeRoles("Admin", "Super Admin"), payments.approvePayment);
router.post("/payments/:id/order", authorizeRoles("Admin", "Super Admin"), payments.createOrder);
router.post("/payments/:id/initiate", authorizeRoles("Admin", "Super Admin"), payments.initiatePayment);
router.post("/payments/:id/cancel", authorizeRoles("Admin", "Super Admin"), payments.cancelPayment);
router.post("/payments/:id/fail", authorizeRoles("Admin", "Super Admin"), payments.failPayment);
router.post("/payments/:id/refund", authorizeRoles("Admin", "Super Admin"), payments.refundPayment);

router.get("/analytics", authorizeRoles("Admin", "Super Admin", "Head Officer"), platform.analytics);
router.get("/audit-logs", authorizeRoles("Admin", "Super Admin"), platform.listAuditLogs);

module.exports = router;
