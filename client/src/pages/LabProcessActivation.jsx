import { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function LabProcessActivation() {
  const navigate = useNavigate();
  const [paidRequests, setPaidRequests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPaidRequests();
    fetchPatients();
  }, []);

  const fetchPaidRequests = async () => {
    try {
      const res = await API.get("/lab-requests");
      const onlyPaid = res.data.filter((req) => req.isPaid === true);
      setPaidRequests(onlyPaid);
    } catch (err) {
      console.error("Error fetching paid requests", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };

  const getPatientName = (id) =>
    patients.find((p) => p.id === id)?.name || "Unknown";

  const handleStartProcessing = async (id) => {
    try {
      setLoadingId(id);
      await API.patch(`/lab-requests/${id}/process`);
      await fetchPaidRequests();
    } catch (err) {
      console.error("Error starting processing", err);
      setError("Failed to start processing.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Activate Lab Process</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">
          {error}
        </div>
      )}

      {paidRequests.length === 0 ? (
        <p>No paid requests found.</p>
      ) : (
        <ul className="space-y-4">
          {paidRequests.map((r) => {
            const isProcessing = r.status === "processing";
            const isLoading = loadingId === r.id;

            return (
              <li key={r.id} className="bg-white p-4 border rounded shadow">
                <div className="font-semibold">
                  👤 Patient: {getPatientName(r.patientId)}
                </div>
                <div>🧪 Tests: {r.testIds.length}</div>
                <div>💰 Total: ₵{r.totalCost}</div>

                <button
                  onClick={() => handleStartProcessing(r.id)}
                  disabled={isProcessing || isLoading}
                  className={`mt-2 px-4 py-2 rounded text-white text-sm ${
                    isProcessing || isLoading
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  {isProcessing
                    ? "Processing"
                    : isLoading
                    ? "Processing..."
                    : "Start Process"}
                </button>

                {isProcessing && (
                  <button
                    onClick={() => navigate(`/lab-results/${r.id}`)}
                    className="mt-2 ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                  >
                    Enter Results
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
