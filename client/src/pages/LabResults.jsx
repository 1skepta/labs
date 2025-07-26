import { useEffect, useState } from "react";
import API from "../utils/api";

export default function LabResultEntry() {
  const [requests, setRequests] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [resultInputs, setResultInputs] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPaidRequests();
    fetchTests();
  }, []);

  const fetchPaidRequests = async () => {
    try {
      const res = await API.get("/lab-requests");
      const paid = res.data.filter((r) => r.isPaid);
      setRequests(paid);
    } catch (err) {
      console.error("Error fetching paid requests:", err);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await API.get("/lab-tests");
      setTests(res.data);
    } catch (err) {
      console.error("Error fetching tests:", err);
    }
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);

    const inputs = {};
    request.testIds.forEach((testId) => {
      const test = tests.find((t) => t.id === testId);
      if (test?.fields) {
        inputs[testId] = {};
        test.fields.forEach((field) => {
          inputs[testId][field.label] = "";
        });
      }
    });
    setResultInputs(inputs);
  };

  const handleChange = (testId, fieldLabel, value) => {
    setResultInputs((prev) => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [fieldLabel]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedRequest) return;

    try {
      await API.post("/lab-reports/manual", {
        requestId: selectedRequest.id,
        results: resultInputs,
      });

      setMessage("Lab results saved successfully");
      setSelectedRequest(null);
      setResultInputs({});
      fetchPaidRequests();
    } catch (err) {
      console.error("Error saving results:", err);
      setMessage("Failed to save lab results ❌");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manual Lab Result Entry</h1>

      {message && (
        <div className="mb-4 text-sm text-center bg-blue-100 text-blue-800 py-2 rounded">
          {message}
        </div>
      )}

      {!selectedRequest ? (
        <>
          <h2 className="text-lg font-semibold mb-2">Select Paid Request</h2>
          <ul className="space-y-2">
            {requests.map((req) => (
              <li
                key={req.id}
                onClick={() => handleSelectRequest(req)}
                className="p-3 border rounded hover:bg-blue-50 cursor-pointer"
              >
                Patient: <strong>{req.patientName || "Unnamed"}</strong> —
                Tests: {req.testIds.length}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Enter Results for: {selectedRequest.patientName}
          </h2>

          {selectedRequest.testIds.map((testId) => {
            const test = tests.find((t) => t.id === testId);
            if (!test) return null;

            return (
              <div key={testId} className="mb-6 border p-4 rounded-lg bg-white">
                <h3 className="font-bold text-base mb-2">{test.name}</h3>

                {test.fields?.map((field, idx) => (
                  <div className="mb-3" key={idx}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                    </label>

                    {field.type === "select" ? (
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={resultInputs[testId]?.[field.label] || ""}
                        onChange={(e) =>
                          handleChange(testId, field.label, e.target.value)
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
                        type={field.type || "text"}
                        className="w-full border rounded px-3 py-2"
                        value={resultInputs[testId]?.[field.label] || ""}
                        onChange={(e) =>
                          handleChange(testId, field.label, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            );
          })}

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Submit Results
            </button>
            <button
              onClick={() => setSelectedRequest(null)}
              className="bg-gray-200 px-6 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
