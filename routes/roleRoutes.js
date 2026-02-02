const express = require("express");
const router = express.Router();
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/roleController.js");
const { authenticate } = require("../middleware/auth.js");
const { checkPermission } = require("../middleware/checkPermission");

router.post(
  "/create-role",
  authenticate,
  checkPermission("Roles", "create"),
  createRole,
);

// Get all roles
router.get(
  "/roles",
  authenticate,
  checkPermission("Roles", "view"),
  getAllRoles,
);

// Get single role
router.get("/role/:id", getRoleById);

// Update role
router.put(
  "/edit-role/:id",
  authenticate,
  checkPermission("Roles", "edit"),
  updateRole,
);

// Delete role
router.delete(
  "/roles/:id",
  authenticate,
  checkPermission("Roles", "delete"),
  deleteRole,
);

module.exports = router;
