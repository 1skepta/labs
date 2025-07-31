import { useEffect, useState } from "react";
import API from "../utils/api";
import { useParams } from "react-router-dom";

export default function LabReportForm() {
  const { requestId } = useParams(); 
  const [request, setRequest] = useState(null);
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState({});
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, testRes, patientRes] = await Promise.all([
        API.get(`/lab-requests/${requestId}`),
        API.get("/lab-tests"),
        API.get("/patients"),
      ]);

      const req = reqRes.data;
      setRequest(req);
      setTests(
        req.testIds
          .map((id) => testRes.data.find((t) => t.id === id))
          .filter(Boolean)
      );
      setPatients(patientRes.data);
    } catch (err) {
      console.error("Failed to load lab request", err);
      setError("Failed to load lab request.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (testId, fieldLabel, value) => {
    setResults((prev) => ({
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
      await API.post(`/lab-reports`, {
        requestId,
        results,
      });

      setMessage("Lab report submitted successfully");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error("Failed to submit report", err);
      setError("Failed to submit lab report.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!request) return <div className="p-4 text-red-500">{error}</div>;

  const patient = patients.find((p) => p.id === request.patientId);

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Enter Lab Results</h1>
      <p className="text-gray-600 mb-6">
        Patient:{" "}
        <span className="font-medium">{patient?.name || "Unknown"}</span>
      </p>

      {message && (
        <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded-md">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {tests.map((test) => (
          <div key={test.id} className="border p-4 rounded-lg bg-white shadow">
            <h2 className="text-lg font-semibold mb-2">{test.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {test.resultFields?.map((field, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label} {field.unit && `(${field.unit})`}
                  </label>

                  {field.type === "select" ? (
                    <select
                      className="w-full border rounded px-3 py-2"
                      onChange={(e) =>
                        handleChange(test.id, field.label, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      step="any"
                      className="w-full border rounded px-3 py-2"
                      placeholder={`Enter ${field.label}`}
                      onChange={(e) =>
                        handleChange(test.id, field.label, e.target.value)
                      }
                    />
                  )}
                  {field.referenceRange && (
                    <p className="text-xs text-gray-500">
                      Ref: {field.referenceRange}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}
