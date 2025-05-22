const express = require("express");
const router = express.Router();
const {
  addGroup,
  fetchGroups,
  soloFetchGroup,
  updateGroupById,
  deleteGroupById,
} = require("../controllers/testGroupController");

router.post("/test-case-group-add", addGroup);
router.get("/test-case-group-fetch", fetchGroups);
router.get("/test-case-group-soloFetch/:id", soloFetchGroup);
router.put("/test-case-group-update/:id", updateGroupById);
router.delete("/test-case-group-delete/:id", deleteGroupById);

module.exports = router;
