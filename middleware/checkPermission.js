const User = require("../models/userModel.js");
const Role = require("../models/roleModel.js");

const checkPermission = (page, action) => {
  return async (req, res, next) => {
    try {
      // Get user from request (assuming user is attached via auth middleware)
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Get user's role with permissions
      const role = await Role.findById(user.role);

      if (!role) {
        return res.status(403).json({
          success: false,
          message: "Role not found",
        });
      }

      // Find permission for the requested page
      const permission = role.permissions.find((p) => p.page === page);

      // Check if permission exists and includes the action
      if (!permission || !permission.actions.includes(action)) {
        return res.status(403).json({
          success: false,
          message: `Access denied: No ${action} permission for ${page}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
        error: error.message,
      });
    }
  };
};

module.exports = {
  checkPermission,
};
