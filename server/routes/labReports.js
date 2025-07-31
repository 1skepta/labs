const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  uploadReport,
  getReports,
  submitStructuredReport,
  getStructuredResultsByRequest,
} = require("../controllers/labReportController");

// Optional file upload route
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", getReports);
router.post("/", upload.single("file"), uploadReport);

// Structured report routes
router.post("/structured", submitStructuredReport);
router.get("/structured/:requestId", getStructuredResultsByRequest);

module.exports = router;
