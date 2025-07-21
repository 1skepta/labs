const express = require("express");
const router = express.Router();
const {
  getAllPatients,
  createPatient,
} = require("../controllers/patientController");

router.get("/", getAllPatients);
router.post("/", createPatient);

module.exports = router;
