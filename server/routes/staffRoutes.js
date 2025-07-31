const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { authMiddleware } = require("../controllers/authController");

router.get("/", authMiddleware, staffController.getAllStaff);

router.post("/", staffController.addOrUpdateStaff);

module.exports = router;
