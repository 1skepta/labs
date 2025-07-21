const fs = require("fs");
const path = require("path");

// Paths
const requestsPath = path.join(__dirname, "..", "data", "labRequests.json");
const testsPath = path.join(__dirname, "..", "data", "labTests.json");

// File helpers
function readRequests() {
  if (!fs.existsSync(requestsPath)) fs.writeFileSync(requestsPath, "[]");
  return JSON.parse(fs.readFileSync(requestsPath, "utf-8"));
}

function writeRequests(data) {
  fs.writeFileSync(requestsPath, JSON.stringify(data, null, 2));
}

function readTests() {
  if (!fs.existsSync(testsPath)) fs.writeFileSync(testsPath, "[]");
  return JSON.parse(fs.readFileSync(testsPath, "utf-8"));
}

exports.getRequests = (req, res) => {
  const requests = readRequests();
  res.json(requests);
};

exports.getRequestById = (req, res) => {
  const id = parseInt(req.params.id);
  const requests = readRequests();
  const found = requests.find((r) => r.id === id);
  if (!found) return res.status(404).json({ message: "Request not found" });
  res.json(found);
};

exports.createRequest = (req, res) => {
  const { patientId, testIds } = req.body;

  if (!patientId || !Array.isArray(testIds)) {
    return res
      .status(400)
      .json({ message: "Patient ID and test IDs are required" });
  }

  const requests = readRequests();
  const tests = readTests();

  let total = 0;
  let missing = [];

  testIds.forEach((tid) => {
    const test = tests.find((t) => t.id === tid);
    if (test) total += test.cost;
    else missing.push(tid);
  });

  if (missing.length > 0) {
    return res.status(400).json({
      message: `Invalid test IDs: ${missing.join(", ")}`,
    });
  }

  const maxId = requests.reduce((max, r) => Math.max(max, r.id), 0);

  const newRequest = {
    id: maxId + 1,
    patientId: parseInt(patientId),
    testIds: testIds.map((id) => parseInt(id)),
    totalCost: total,
    isPaid: false,
    status: "pending",
  };

  requests.push(newRequest);
  writeRequests(requests);

  res.status(201).json(newRequest);
};

exports.markAsPaid = (req, res) => {
  const reqId = parseInt(req.params.id);
  const requests = readRequests();

  const request = requests.find((r) => r.id === reqId);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.isPaid = true;
  request.status = "active";

  writeRequests(requests);

  res.json({ message: "Payment successful", request });
};
