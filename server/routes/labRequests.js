const express = require("express");
const router = express.Router();

const {
  getRequests,
  createRequest,
  markAsPaid,
  getRequestById,
  startProcessing,
  markAsCompleted,
} = require("../controllers/labRequestController");

router.get("/", getRequests);
router.get("/:id", getRequestById);
router.post("/", createRequest);
router.patch("/:id/pay", markAsPaid);
router.patch("/:id/process", startProcessing);
router.patch("/:id/complete", markAsCompleted);

module.exports = router;
