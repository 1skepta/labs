const fs = require("fs");
const path = require("path");

// File paths
const reportPath = path.join(__dirname, "..", "data", "labReports.json");
const requestsPath = path.join(__dirname, "..", "data", "labRequests.json");

// Helpers
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
