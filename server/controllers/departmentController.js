const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "departments.json");

// Helper: Read departments from file
function readDepartments() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, "[]"); // create empty file if not exists
  }
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

// Helper: Write departments to file
function writeDepartments(departments) {
  fs.writeFileSync(dataPath, JSON.stringify(departments, null, 2));
}

// Temporary in-memory ID tracker
let idCounter = 1;

exports.getDepartments = (req, res) => {
  const departments = readDepartments();
  res.json(departments);
};

exports.createDepartment = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const departments = readDepartments();

  // Generate next ID based on highest current ID in file
  const maxId = departments.reduce((max, dept) => Math.max(max, dept.id), 0);
  const newDept = { id: maxId + 1, name };

  departments.push(newDept);
  writeDepartments(departments);

  res.status(201).json(newDept);
};

exports.deleteDepartment = (req, res) => {
  const deptId = parseInt(req.params.id);
  let departments = readDepartments();

  const filtered = departments.filter((d) => d.id !== deptId);
  if (filtered.length === departments.length) {
    return res.status(404).json({ message: "Department not found" });
  }

  writeDepartments(filtered);
  res.json({ message: "Deleted" });
};
