const express = require("express");
const router = express.Router();
const controller = require("../controllers/labReportController");

// ✅ Get all lab reports (free-text & structured)
router.get("/", controller.getReports);

// Save free-text report
router.post("/free-text", controller.submitFreeTextReport);

// (Optional: if you use file uploads or structured submissions, add these too)
// router.post("/upload", controller.uploadReport);
// router.post("/structured", controller.submitStructuredReport);

module.exports = router;
