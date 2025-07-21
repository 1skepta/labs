import { useEffect, useState } from "react";
import API from "../utils/api";

export default function LabRequests() {
  const [patientId, setPatientId] = useState("");
  const [testIds, setTestIds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    API.get("/patients").then((res) => setPatients(res.data));
    API.get("/lab-tests").then((res) => setTests(res.data));
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await API.get("/lab-requests");
    setRequests(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/lab-requests", {
      patientId: parseInt(patientId),
      testIds,
    });
    fetchRequests();
  };

  const payNow = async (id) => {
    await API.patch(`/lab-requests/${id}/pay`);
    fetchRequests();
  };

  return (
    <div className="grid gap-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow space-y-3"
      >
        <h2 className="text-lg font-bold">New Lab Request</h2>

        <select
          className="border p-2 w-full rounded"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2">
          {tests.map((t) => (
            <label key={t.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={t.id}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTestIds((prev) =>
                    prev.includes(val)
                      ? prev.filter((id) => id !== val)
                      : [...prev, val]
                  );
                }}
              />
              {t.name} (${t.cost})
            </label>
          ))}
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Request
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Requests</h2>
        <ul>
          {requests.map((r) => (
            <li
              key={r.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>
                Request #{r.id} – {r.status} – ${r.totalCost}
              </span>
              {!r.isPaid && (
                <button
                  onClick={() => payNow(r.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Pay
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
