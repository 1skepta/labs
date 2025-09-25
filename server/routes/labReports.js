const express = require("express");
const router = express.Router();
const controller = require("../controllers/labReportController");

router.get("/", controller.getReports);

// Save free-text report
router.post("/free-text", controller.submitFreeTextReport);

// router.post("/upload", controller.uploadReport);
// router.post("/structured", controller.submitStructuredReport);

module.exports = router;
