const fs = require("fs");
const path = require("path");

const reportPath = path.join(__dirname, "..", "data", "labReports.json");
const resultsPath = path.join(__dirname, "..", "data", "labResults.json");
const requestsPath = path.join(__dirname, "..", "data", "labRequests.json");

function readJSON(filepath) {
  if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, "[]");
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

function writeJSON(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

exports.getReports = (req, res) => {
  const reports = readJSON(reportPath);
  res.json(reports);
};

exports.uploadReport = (req, res) => {
  const requestId = parseInt(req.body.requestId);
  if (!requestId || !req.file) {
    return res
      .status(400)
      .json({ message: "Request ID and file are required" });
  }

  const requests = readJSON(requestsPath);
  const reports = readJSON(reportPath);

  const request = requests.find((r) => r.id === requestId);
  if (!request || !request.isPaid) {
    return res.status(400).json({ message: "Invalid or unpaid request" });
  }

  const newReport = {
    id: reports.length + 1,
    requestId,
    filename: req.file.filename,
    originalName: req.file.originalname,
    uploadedAt: new Date().toISOString(),
  };

  reports.push(newReport);
  writeJSON(reportPath, reports);

  res.status(201).json({ message: "Report uploaded", report: newReport });
};

exports.submitStructuredReport = (req, res) => {
  const { requestId, results } = req.body;

  if (!requestId || typeof results !== "object") {
    return res.status(400).json({ message: "Invalid request data" });
  }

  const requests = readJSON(requestsPath);
  const request = requests.find((r) => r.id === parseInt(requestId));

  if (!request || !request.isPaid) {
    return res.status(400).json({ message: "Invalid or unpaid request" });
  }

  const allResults = readJSON(resultsPath);

  const newEntry = {
    id: allResults.length + 1,
    requestId: parseInt(requestId),
    results, // object: { testId: { field1: val1, ... }, ... }
    submittedAt: new Date().toISOString(),
  };

  allResults.push(newEntry);
  writeJSON(resultsPath, allResults);

  res.status(201).json({ message: "Lab results saved", entry: newEntry });
};

exports.getStructuredResultsByRequest = (req, res) => {
  const requestId = parseInt(req.params.requestId);
  if (!requestId) {
    return res.status(400).json({ message: "Invalid request ID" });
  }

  const allResults = readJSON(resultsPath);
  const result = allResults.find((r) => r.requestId === requestId);

  if (!result) {
    return res.status(404).json({ message: "No results found for request" });
  }

  res.json(result);
};
