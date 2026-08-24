const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const controller = require("../controllers/userController");

const router = express.Router();

router.use(authenticateUser);

router.get("/me", controller.getCurrentUser);
router.get("/me/resume", controller.getMyResume);
router.get("/me/payment-profile", authorizeRoles("Staff", "Officer", "Head Officer"), controller.getMyPaymentProfile);
router.patch("/me/payment-profile", authorizeRoles("Staff", "Officer", "Head Officer"), controller.updateMyPaymentProfile);
router.patch("/me", controller.updateMe);
router.get("/", authorizeRoles("Admin", "Super Admin", "Head Officer", "Officer"), controller.listUsers);
router.get("/:id/payment-profile", authorizeRoles("Admin", "Super Admin"), controller.getUserPaymentProfile);
router.patch("/:id/payment-profile", authorizeRoles("Admin", "Super Admin"), controller.updateUserPaymentProfile);
router.patch("/:id/role", authorizeRoles("Admin", "Super Admin"), controller.updateUserRole);

module.exports = router;
