const express = require("express");
const router = express.Router();
const {
  getDashboardData,
  getPublicDashboard,
} = require("../controllers/dashboardController.js");
const { authenticate } = require("../middleware/auth.js");
const { checkPermission } = require("../middleware/checkPermission.js");

// Public dashboard (no authentication required)
router.get("/dashboard", getPublicDashboard);

// Protected dashboard (requires authentication and view permission)
router.get(
  "/",
  authenticate, // First check if user is authenticated
  checkPermission("dashboard", "view"), // Then check if user has view permission
  getDashboardData
);

// Admin dashboard (requires admin role)
router.get(
  "/admin",
  authenticate,
  checkPermission("dashboard", "view"),
  (req, res) => {
    // Additional admin-only data
    const adminData = {
      user: req.user,
      adminStats: {
        systemUptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
      },
      message: "Welcome to Admin Dashboard",
    };

    res.status(200).json({
      success: true,
      message: "Admin dashboard accessed",
      data: adminData,
    });
  }
);

module.exports = router;
