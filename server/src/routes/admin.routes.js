const express = require("express");
const router = express.Router();
const {
  getDashboardStats, getAllUsers, getAllOrders, updateOrderStatus, toggleUserStatus,
} = require("../controllers/admin.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle", toggleUserStatus);
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;
