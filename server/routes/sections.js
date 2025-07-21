const express = require("express");
const router = express.Router();
const {
  getSections,
  createSection,
  deleteSection,
} = require("../controllers/sectionController");

router.get("/", getSections);
router.post("/", createSection);
router.delete("/:id", deleteSection);

module.exports = router;
