const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.js");
const { checkPermission } = require("../middleware/checkPermission.js");
const {
  createPageGroup,
  getAllPageGroups,
  getPageGroupById,
  updatePageGroup,
  deletePageGroup,
} = require("../controllers/pageGroupController");

router.post(
  "/create-page-group",
  authenticate,
  checkPermission("Page Group", "create"),
  createPageGroup,
);
router.get("/page-groups", getAllPageGroups);
router.get("/page-groups/:id", getPageGroupById);
router.put(
  "/edit-page-group/:id",
  authenticate,
  checkPermission("Page Group", "edit"),
  updatePageGroup,
);
router.delete(
  "/page-groups/:id",
  authenticate,
  checkPermission("Page Group", "delete"),
  deletePageGroup,
);

module.exports = router;
