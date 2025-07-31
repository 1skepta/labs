const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { authMiddleware } = require("../controllers/authController");

router.get("/", staffController.getAllStaff);
router.post("/", staffController.addOrUpdateStaff);
router.delete("/:userId", staffController.deleteStaff);

module.exports = router;
