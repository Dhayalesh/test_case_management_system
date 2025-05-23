const express = require("express");
const router = express.Router();
const { addExecution, fetchExecutions } = require("../controllers/runTestCaseControllers");

router.post("/test-execution-add", addExecution);
router.get("/test-execution-fetch", fetchExecutions);

module.exports = router;
