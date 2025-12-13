const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");

const { authenticate } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", getProfile);

module.exports = router;
