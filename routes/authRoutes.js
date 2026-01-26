const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  getUsers,
} = require("../controllers/authController");
const { checkPermission } = require("../middleware/checkPermission.js");
const { authenticate } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", getProfile);
router.get("/users", authenticate, checkPermission("User", "view"), getUsers);

module.exports = router;
