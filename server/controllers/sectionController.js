const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "sections.json");

// Read sections from file
function readSections() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, "[]");
  }
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

// Write sections to file
function writeSections(sections) {
  fs.writeFileSync(dataPath, JSON.stringify(sections, null, 2));
}

exports.getSections = (req, res) => {
  const sections = readSections();
  res.json(sections);
};

exports.createSection = (req, res) => {
  const { name, departmentId } = req.body;

  if (!name || !departmentId) {
    return res
      .status(400)
      .json({ message: "Name and departmentId are required" });
  }

  const sections = readSections();

  // Auto-generate ID based on max existing
  const maxId = sections.reduce((max, s) => Math.max(max, s.id), 0);
  const newSection = {
    id: maxId + 1,
    name,
    departmentId: parseInt(departmentId),
  };

  sections.push(newSection);
  writeSections(sections);

  res.status(201).json(newSection);
};

exports.deleteSection = (req, res) => {
  const idToDelete = parseInt(req.params.id);
  const sections = readSections();

  const filtered = sections.filter((s) => s.id !== idToDelete);

  if (filtered.length === sections.length) {
    return res.status(404).json({ message: "Section not found" });
  }

  writeSections(filtered);
  res.json({ message: "Deleted" });
};
