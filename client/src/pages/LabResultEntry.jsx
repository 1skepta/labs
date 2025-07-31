import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";

export default function LabResultEntry() {
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

      // Pre-fill formData structure
      const initialData = {};
      reqRes.data.testIds.forEach((testId) => {
        const test = testRes.data.find((t) => t.id === testId);
        if (test?.resultFields?.length) {
          initialData[testId] = {};
          test.resultFields.forEach((f) => {
            initialData[testId][f.label] = "";
          });
        }
      });

      setFormData(initialData);
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  const getPatientName = (id) =>
    patients.find((p) => p.id === id)?.name || "Unknown";

  const handleChange = (testId, fieldLabel, value) => {
    setFormData((prev) => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [fieldLabel]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/lab-reports/structured", {
        requestId: parseInt(requestId),
        results: formData,
      });
      setStatus("Results submitted successfully ✅");
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

              {test.resultFields?.length > 0 ? (
                <div className="space-y-3">
                  {test.resultFields.map((field, idx) => (
                    <div key={idx} className="flex flex-col">
                      <label className="text-sm font-medium">
                        {field.label} {field.unit && `(${field.unit})`}
                      </label>
                      {field.type === "select" ? (
                        <select
                          value={formData[testId]?.[field.label] || ""}
                          onChange={(e) =>
                            handleChange(testId, field.label, e.target.value)
                          }
                          className="border rounded px-3 py-2 mt-1"
                        >
                          <option value="">-- Select --</option>
                          {(field.options || []).map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || "text"}
                          value={formData[testId]?.[field.label] || ""}
                          onChange={(e) =>
                            handleChange(testId, field.label, e.target.value)
                          }
                          placeholder={`Reference: ${
                            field.referenceRange || "N/A"
                          }`}
                          className="border rounded px-3 py-2 mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No structured fields defined.
                </p>
              )}
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
