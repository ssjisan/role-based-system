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

// All routes require authentication
// router.use(authenticate);

// Create role (requires permission)
router.post("/create-role", createRole);

// Get all roles
router.get("/roles", getAllRoles);

// Get single role
router.get("/role/:id", getRoleById);

// Update role
router.put("/:id", checkPermission("role", "edit"), updateRole);

// Delete role
router.delete("/:id", checkPermission("role", "delete"), deleteRole);

module.exports = router;
