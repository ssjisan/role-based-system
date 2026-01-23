const Role = require("../models/roleModel.js");

const checkPermission = (page, action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const role = await Role.findById(user.role);

      if (!role) {
        return res.status(403).json({
          success: false,
          message: "Role not found",
        });
      }

      const permission = role.permissions.find((p) => p.page === page);

      if (!permission || !permission.actions.includes(action)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};

module.exports = { checkPermission };
