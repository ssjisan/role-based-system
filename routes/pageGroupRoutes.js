const express = require("express");
const router = express.Router();
const {
  createPageGroup,
  getAllPageGroups,
} = require("../controllers/pageGroupController.js");

router.post("/page-group", createPageGroup);
router.get("/all-page-groups", getAllPageGroups);

module.exports = router;
