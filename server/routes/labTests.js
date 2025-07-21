const express = require("express");
const router = express.Router();
const {
  getTests,
  createTest,
  deleteTest,
} = require("../controllers/labTestController");

router.get("/", getTests);
router.post("/", createTest);
router.delete("/:id", deleteTest);

module.exports = router;
