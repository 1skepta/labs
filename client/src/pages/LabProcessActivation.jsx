import { useState, useEffect } from "react";
import API from "../utils/api";

export default function LabProcessActivation() {
  const [paidRequests, setPaidRequests] = useState([]);

  useEffect(() => {
    fetchPaidRequests();
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

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Activate Lab Process</h1>

      {paidRequests.length === 0 ? (
        <p>No paid requests found.</p>
      ) : (
        <ul className="space-y-4">
          {paidRequests.map((r) => (
            <li key={r.id} className="bg-white p-4 border rounded shadow">
              <div className="font-semibold">Patient ID: {r.patientId}</div>
              <div>Tests: {r.testIds.length}</div>
              <div>Total: ₵{r.totalCost}</div>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
                Start Processing
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
