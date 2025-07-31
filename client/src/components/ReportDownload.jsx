import { useEffect, useState } from "react";
import API from "../utils/api";

export default function ReportDownload() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get("/lab-reports");
        const freeTextReports = res.data.filter(
          (r) => !r.testName && r.results && typeof r.results === "object"
        );
        setReports(freeTextReports);
      } catch (err) {
        console.error("Failed to load reports", err);
      }
    };

    fetchReports();
  }, []);

  const downloadReport = (report, index) => {
    const lines = [];

    lines.push(`Request ID: ${report.requestId}`);
    lines.push(
      `Submitted At: ${new Date(report.submittedAt).toLocaleString()}`
    );
    lines.push("\nResults:");

    for (const [testId, result] of Object.entries(report.results)) {
      lines.push(`- Test ID ${testId}: ${result}`);
    }

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${report.requestId}-${index + 1}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Download Free-Text Lab Reports
      </h2>

      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        reports.map((report, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p>
                <strong>Request ID:</strong> {report.requestId}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#666" }}>
                {new Date(report.submittedAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => downloadReport(report, index)}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Download
            </button>
          </div>
        ))
      )}
    </div>
  );
}
