const fs = require("fs");
const path = require("path");

const reportPath = path.join(__dirname, "..", "data", "labReports.json");
const resultsPath = path.join(__dirname, "..", "data", "labResults.json");
const requestsPath = path.join(__dirname, "..", "data", "labRequests.json");

function readReports() {
  if (!fs.existsSync(reportPath)) fs.writeFileSync(reportPath, "[]");
  return JSON.parse(fs.readFileSync(reportPath, "utf-8"));
}

function writeReports(data) {
  fs.writeFileSync(reportPath, JSON.stringify(data, null, 2));
}

function readRequests() {
  if (!fs.existsSync(requestsPath)) fs.writeFileSync(requestsPath, "[]");
  return JSON.parse(fs.readFileSync(requestsPath, "utf-8"));
}

function readResults() {
  if (!fs.existsSync(resultsPath)) fs.writeFileSync(resultsPath, "[]");
  return JSON.parse(fs.readFileSync(resultsPath, "utf-8"));
}

function writeResults(data) {
  fs.writeFileSync(resultsPath, JSON.stringify(data, null, 2));
}

exports.getReports = (req, res) => {
  const reports = readReports();
  res.json(reports);
};

exports.uploadReport = (req, res) => {
  const requestId = parseInt(req.body.requestId);
  if (!requestId || !req.file) {
    return res
      .status(400)
      .json({ message: "Request ID and file are required" });
  }

  const requests = readRequests();
  const reports = readReports();

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
  writeReports(reports);

  res.status(201).json({ message: "Report uploaded", report: newReport });
};

exports.submitStructuredReport = (req, res) => {
  const { requestId, testId, results } = req.body;

  if (!requestId || !testId || !Array.isArray(results)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const requests = readRequests();
  const request = requests.find((r) => r.id === parseInt(requestId));

  if (!request || !request.isPaid) {
    return res.status(400).json({ message: "Invalid or unpaid request" });
  }

  const allResults = readResults();

  const newResult = {
    id: allResults.length + 1,
    requestId: parseInt(requestId),
    testId: parseInt(testId),
    results,
    submittedAt: new Date().toISOString(),
  };

  allResults.push(newResult);
  writeResults(allResults);

  res
    .status(201)
    .json({ message: "Structured result saved", result: newResult });
};

exports.getStructuredResultsByRequest = (req, res) => {
  const requestId = parseInt(req.params.requestId);
  if (!requestId) {
    return res.status(400).json({ message: "Invalid request ID" });
  }

  const allResults = readResults();
  const results = allResults.filter((r) => r.requestId === requestId);

  res.json(results);
};
