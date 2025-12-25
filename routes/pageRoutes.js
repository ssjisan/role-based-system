const express = require("express");
const router = express.Router();
const {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
  deletePage,
} = require("../controllers/pageController");
const { authenticate } = require("../middleware/auth.js");

// All routes require authentication
// router.use(authenticate);

router.get("/pages-list", getAllPages);
router.post("/create-page", createPage);
router.put("/edit-page/:id", updatePage);
router.get("/page/:id", getPageById);
router.delete("/delete-page/:id", deletePage);

module.exports = router;
