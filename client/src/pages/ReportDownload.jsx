import { useEffect, useState } from "react";
import API from "../utils/api";
import { jsPDF } from "jspdf";

export default function FreeTextReportsDownload() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    API.get("/lab-reports")
      .then((res) => setReports(res.data))
      .catch((err) => console.error("Failed to fetch reports", err));
  }, []);

  const downloadAsPDF = (report) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Laboratory Report", 105, 20, { align: "center" });

    // Separator line
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    // Patient Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Patient Name: ${report.patientName}`, 10, 35);
    doc.text(`Test Name: ${report.testName}`, 10, 45);
    doc.text(
      `Submitted: ${new Date(report.submittedAt).toLocaleString()}`,
      10,
      55
    );

    // Result Section
    doc.setFont("helvetica", "bold");
    doc.text("Result:", 10, 70);
    doc.setFont("helvetica", "normal");
    doc.text(report.result || "No result provided", 10, 80, { maxWidth: 190 });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Confidential - For Medical Use Only", 105, 290, {
      align: "center",
    });

    const fileName = `${report.patientName}_${report.testName}_report.pdf`;
    doc.save(fileName.replace(/\s+/g, "_"));
  };

  if (!reports.length) {
    return <p className="text-center text-gray-600 mt-10">No reports found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Patient Reports</h2>

      {reports.map((report) => (
        <div
          key={report.id}
          className="flex justify-between items-center bg-gray-100 rounded-lg p-4 shadow-sm"
        >
          <div>
            <p className="font-semibold text-gray-800">
              {report.patientName} - {report.testName}
            </p>
            <p className="text-sm text-gray-600">
              Submitted: {new Date(report.submittedAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => downloadAsPDF(report)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
          >
            Download PDF
          </button>
        </div>
      ))}
    </div>
  );
}
