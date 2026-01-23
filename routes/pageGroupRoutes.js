const express = require("express");
const router = express.Router();
const {
  createPageGroup,
  getAllPageGroups,
  deletePageGroup,
} = require("../controllers/pageGroupController.js");

router.post("/create-page-group", createPageGroup);
router.get("/all-page-groups", getAllPageGroups);
router.delete("/delete-page-group/:id", deletePageGroup);
module.exports = router;
