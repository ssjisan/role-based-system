const express = require("express");
const router = express.Router();
const {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
} = require("../controllers/pageController");
const { authenticate } = require("../middleware/auth.js");

// All routes require authentication
// router.use(authenticate);

// Get all pages
router.get("/pages-list", getAllPages);

// Get single page
router.get("/public", getPageById);

// Create page
router.post("/create-page", createPage);

// Update page
router.put("/:id", updatePage);

module.exports = router;
