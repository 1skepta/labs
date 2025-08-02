import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

export default function LabRequestForm() {
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [requests, setRequests] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    fetchPatients();
    fetchTests();
    fetchRequests();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Error loading patients", err);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await API.get("/lab-tests");
      setTests(res.data);
    } catch (err) {
      console.error("Error loading tests", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await API.get("/lab-requests");
      setRequests(res.data);
    } catch (err) {
      console.error("Error loading requests", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedPatient || selectedTests.length === 0) {
      setError("Please select a patient and at least one test.");
      return;
    }

    const patientObj = patients.find((p) => p.name === selectedPatient);
    const testIds = selectedTests.map((name) => {
      const test = tests.find((t) => t.name === name);
      return test?.id;
    });

    if (!patientObj || testIds.includes(undefined)) {
      setError("Invalid patient or test selection.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/lab-requests", {
        patientId: patientObj.id,
        testIds,
      });

      setMessage("Lab request submitted");
      setSelectedPatient("");
      setSelectedTests([]);
      fetchRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to submit request.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 4000);
    }
  };

  const calculateTotal = () =>
    selectedTests.reduce((total, name) => {
      const test = tests.find((t) => t.name === name);
      return test ? total + test.cost : total;
    }, 0);

  const filteredRequests = requests
    .slice()
    .reverse()
    .filter((r) => {
      if (tab === "all") return true;
      if (tab === "pending") return !r.isPaid;
      if (tab === "paid") return r.isPaid && r.status !== "completed";
      if (tab === "completed") return r.status === "completed";
      return true;
    });

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT - Request Form */}
        <div>
          <h1 className="font-bold text-2xl mb-3">Lab Request Form</h1>
          <p className="text-gray-600 mb-4">Create a new lab test request.</p>

          {message && (
            <div className="bg-green-100 text-green-800 px-4 py-3 rounded mb-4 text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full border rounded-lg py-3 px-4 text-lg text-gray-700 cursor-pointer"
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-white">
              {tests.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                >
                  <input
                    type="checkbox"
                    value={t.name}
                    checked={selectedTests.includes(t.name)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedTests((prev) =>
                        checked
                          ? [...prev, t.name]
                          : prev.filter((name) => name !== t.name)
                      );
                    }}
                    className="mr-2"
                  />
                  <span className="flex-1">{t.name}</span>
                  <span className="text-gray-500 text-sm">₵{t.cost}</span>
                </label>
              ))}
            </div>

            <div className="text-lg font-medium text-gray-800">
              Total: ₵{calculateTotal().toFixed(2)}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer w-full py-3 rounded-lg font-semibold text-white text-lg ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-[#0030f1] hover:bg-blue-800"
              }`}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* RIGHT - Recent Requests */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Recent Requests
          </h2>

          {/* Tabs */}
          <div className="flex space-x-2 mb-4 text-sm">
            {["all", "pending", "paid", "completed"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-full border cursor-pointer ${
                  tab === t
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* List */}
          {filteredRequests.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No requests in this category.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {filteredRequests.slice(0, 5).map((r) => {
                const patient = patients.find((p) => p.id === r.patientId);

                return (
                  <li
                    key={r.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="font-semibold text-gray-800">
                      👤 {patient?.name || "Unknown Patient"}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      🧪 Tests: {r.testIds.length}
                    </div>
                    <div className="text-gray-600 text-sm">
                      💰 Total: ₵{r.totalCost.toFixed(2)}
                    </div>
                    <div
                      className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                        r.status === "completed"
                          ? "bg-gray-200 text-gray-700"
                          : r.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status === "completed"
                        ? "✅ Completed"
                        : r.isPaid
                        ? "✅ Paid"
                        : "⏳ Pending"}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/all-lab-requests"
              className="text-blue-600 text-sm font-medium underline"
            >
              View All Requests →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
