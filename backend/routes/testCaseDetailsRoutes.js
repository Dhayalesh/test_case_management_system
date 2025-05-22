const express = require("express");
const router = express.Router();

const {
  addTestCaseDetail,
  getAllTestCaseDetails,
  getSingleTestCaseDetail,
  updateTestCaseDetail,
  deleteTestCaseDetail,
} = require("../controllers/testCaseDetailsController");

router.post("/test-case-detail-add", addTestCaseDetail);
router.get("/test-case-detail-fetch", getAllTestCaseDetails);
router.get("/test-case-detail-soloFetch/:id", getSingleTestCaseDetail);
router.put("/test-case-detail-update/:id", updateTestCaseDetail);
router.delete("/test-case-detail-delete/:id", deleteTestCaseDetail);

module.exports = router;
