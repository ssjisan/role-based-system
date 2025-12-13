const User = require("../models/userModel.js");

exports.getDashboardData = async (req, res) => {
  try {
    // User is already attached to req by the authenticate middleware
    const user = req.user;

    // Dashboard data
    const dashboardData = {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      stats: {
        totalUsers: await User.countDocuments(),
        activeUsers: await User.countDocuments({ isActive: true }),
        adminUsers: await User.countDocuments({ role: "admin" }),
        superAdminUsers: await User.countDocuments({ role: "super_admin" }),
      },
      recentActivity: [
        {
          id: 1,
          action: "User Login",
          description: `${user.username} logged in`,
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          action: "System Update",
          description: "Database backup completed",
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
      ],
      welcomeMessage: `Welcome back, ${user.username}!`,
    };

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData,
      permissions: {
        dashboard: "view",
        userRole: user.role,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

// Get minimal dashboard (public stats)
exports.getPublicDashboard = async (req, res) => {
  try {
    const publicData = {
      stats: {
        totalUsers: await User.countDocuments(),
        activeUsers: await User.countDocuments({ isActive: true }),
      },
      systemInfo: {
        name: "Role-Based Access Control System",
        version: "1.0.0",
        status: "Running",
      },
    };

    res.status(200).json({
      success: true,
      message: "Public dashboard data",
      data: publicData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch public dashboard",
      error: error.message,
    });
  }
};
