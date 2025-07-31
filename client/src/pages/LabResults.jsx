import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function LabResultEntry() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [labRequest, setLabRequest] = useState(null);
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [reqRes, testRes, patientRes] = await Promise.all([
        API.get(`/lab-requests/${requestId}`),
        API.get("/lab-tests"),
        API.get("/patients"),
      ]);

      setLabRequest(reqRes.data);
      setTests(testRes.data);
      setPatients(patientRes.data);

      const initialData = {};
      reqRes.data.testIds.forEach((testId) => {
        initialData[testId] = "";
      });
      setFormData(initialData);
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  const getPatientName = (id) =>
    patients.find((p) => p.id === id)?.name || "Unknown";

  const handleChange = (testId, value) => {
    setFormData((prev) => ({
      ...prev,
      [testId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/lab-reports/free-text", {
        requestId: parseInt(requestId),
        results: formData,
      });
      navigate("/dashboard");

      setStatus("Results submitted successfully ");
    } catch (err) {
      console.error("Submit error", err);
      setStatus("Failed to submit results ❌");
    }
  };

  if (!labRequest) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🧾 Lab Result Entry</h1>

      <div className="mb-4 border p-4 rounded bg-gray-50">
        <p>
          <strong>Patient:</strong> {getPatientName(labRequest.patientId)}
        </p>
        <p>
          <strong>Total Cost:</strong> ₵{labRequest.totalCost}
        </p>
        <p>
          <strong>Tests:</strong> {labRequest.testIds.length}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {labRequest.testIds.map((testId) => {
          const test = tests.find((t) => t.id === testId);
          if (!test) return null;

          return (
            <div key={testId} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">{test.name}</h2>
              <textarea
                rows={5}
                placeholder="Write the lab results for this test here..."
                value={formData[testId]}
                onChange={(e) => handleChange(testId, e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          );
        })}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Submit Results
        </button>

        {status && (
          <div className="mt-3 text-sm text-center text-blue-700 bg-blue-50 border border-blue-200 rounded p-2">
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
