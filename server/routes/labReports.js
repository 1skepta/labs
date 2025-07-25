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

// File upload storage config
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

// Existing file upload routes
router.get("/", getReports);
router.post("/", upload.single("file"), uploadReport);

// NEW: Manual structured result submission
router.post("/structured", submitStructuredReport);

// NEW: Fetch all structured results for a specific request
router.get("/structured/:requestId", getStructuredResultsByRequest);

module.exports = router;
