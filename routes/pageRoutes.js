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
const { checkPermission } = require("../middleware/checkPermission.js");

router.get(
  "/pages-list",
  authenticate,
  checkPermission("Pages", "view"),
  getAllPages,
);
router.post(
  "/create-page",
  authenticate,
  checkPermission("Pages", "create"),
  createPage,
);
router.put("/edit-page/:id", checkPermission("Pages", "edit"), updatePage);
router.get("/page/:id", getPageById);
router.delete(
  "/delete-page/:id",
  authenticate,
  checkPermission("Pages", "delete"),
  deletePage,
);

module.exports = router;
