const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "labTests.json");

function readTests() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, "[]");
  }
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

function writeTests(tests) {
  fs.writeFileSync(dataPath, JSON.stringify(tests, null, 2));
}

exports.getTests = (req, res) => {
  const tests = readTests();
  res.json(tests);
};

exports.createTest = (req, res) => {
  const { name, cost, sectionId, resultFields = [] } = req.body;

  if (!name || !cost || !sectionId) {
    return res
      .status(400)
      .json({ message: "Name, cost, and sectionId are required" });
  }

  const tests = readTests();

  const maxId = tests.reduce((max, t) => Math.max(max, t.id), 0);
  const newTest = {
    id: maxId + 1,
    name,
    cost: parseFloat(cost),
    sectionId: parseInt(sectionId),
    resultFields, // optional structure for result entries
  };

  tests.push(newTest);
  writeTests(tests);

  res.status(201).json(newTest);
};

exports.deleteTest = (req, res) => {
  const idToDelete = parseInt(req.params.id);
  const tests = readTests();

  const filtered = tests.filter((t) => t.id !== idToDelete);

  if (filtered.length === tests.length) {
    return res.status(404).json({ message: "Test not found" });
  }

  writeTests(filtered);
  res.json({ message: "Deleted" });
};
