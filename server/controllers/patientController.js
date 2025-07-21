const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "patients.json");

// Read patients from file
function readPatients() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, "[]");
  }
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

// Write patients to file
function writePatients(patients) {
  fs.writeFileSync(dataPath, JSON.stringify(patients, null, 2));
}

exports.getAllPatients = (req, res) => {
  const patients = readPatients();
  res.json(patients);
};

exports.createPatient = (req, res) => {
  const { name, dob, gender, phone } = req.body;

  if (!name || !dob || !gender || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const patients = readPatients();

  // Generate new ID
  const maxId = patients.reduce((max, p) => Math.max(max, p.id), 0);
  const newPatient = {
    id: maxId + 1,
    name,
    dob,
    gender,
    phone,
  };

  patients.push(newPatient);
  writePatients(patients);

  res.status(201).json(newPatient);
};
