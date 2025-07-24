const express = require("express");
const router = express.Router();
const {
  getRequests,
  createRequest,
  markAsPaid,
  getRequestById,
} = require("../controllers/labRequestController");

router.get("/", getRequests);
router.get("/:id", getRequestById);
router.post("/", createRequest);
router.patch("/:id/pay", markAsPaid);

module.exports = router;
