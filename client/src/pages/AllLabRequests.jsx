import { useState, useEffect } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function AllLabRequests() {
  const [requests, setRequests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchRequests();
    fetchPatients();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".expandable-row")) {
        setExpandedRow(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/lab-requests");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests", err);
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

  const handleMarkAsPaid = async (id) => {
    try {
      setLoading(true);
      await API.patch(`/lab-requests/${id}/pay`, { isPaid: true });
      await fetchRequests();
    } catch (err) {
      console.error("Payment update failed", err);
      setError("Failed to mark as paid.");
    } finally {
      setLoading(false);
      setTimeout(() => setError(""), 3000);
    }
  };

  const getPatientName = (id) =>
    patients.find((p) => p.id === id)?.name || "Unknown";

  const paidRequests = requests.filter((r) => r.isPaid);
  const unpaidRequests = requests.filter((r) => !r.isPaid);
  const isMobile = window.innerWidth < 768;

  const RequestTable = ({ data, showPayButton }) => (
    <table className="w-full text-sm table-auto border-collapse">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-3">Patient</th>
          {showPayButton && <th className="p-3 text-right">Action</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <>
            <tr
              key={r.id}
              className="border-b cursor-pointer expandable-row"
              onClick={() =>
                setExpandedRow((prev) => (prev === r.id ? null : r.id))
              }
            >
              <td className="p-3 font-medium">
                👤 {getPatientName(r.patientId)}
              </td>
              {showPayButton && (
                <td className="p-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsPaid(r.id);
                    }}
                    disabled={loading}
                    className={`px-3 py-1 rounded text-sm text-white ${
                      loading
                        ? "bg-green-300 cursor-pointer opacity-75"
                        : "bg-green-600 hover:bg-green-700 cursor-pointer"
                    }`}
                  >
                    {loading ? "Processing..." : "Made Payment"}
                  </button>
                </td>
              )}
            </tr>

            <AnimatePresence>
              {expandedRow === r.id && (
                <motion.tr
                  key={`expand-${r.id}`}
                  className="bg-white text-gray-700"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <td colSpan={showPayButton ? 2 : 1} className="p-4">
                    <div className="space-y-1 text-sm">
                      <div>🧪 Tests: {r.testIds.length}</div>
                      <div>💰 Total Cost: ₵{r.totalCost.toFixed(2)}</div>
                      <div>
                        📅 Created: {new Date(r.createdAt).toLocaleString()}
                      </div>
                      <div>
                        💳 Status:{" "}
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${
                            r.isPaid
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {r.isPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-screen-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Lab Requests</h1>
          <Link
            to="/requests"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Request Form
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1.5 rounded text-sm font-medium cursor-pointer ${
              activeTab === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("paid")}
            className={`px-3 py-1.5 rounded text-sm font-medium cursor-pointer ${
              activeTab === "paid"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Paid
          </button>
        </div>

        <div className="overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ x: isMobile ? 300 : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? -300 : 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "pending" ? (
                unpaidRequests.length === 0 ? (
                  <p className="text-sm text-gray-500">No pending requests.</p>
                ) : (
                  <RequestTable data={unpaidRequests} showPayButton />
                )
              ) : paidRequests.length === 0 ? (
                <p className="text-sm text-gray-500">No paid requests.</p>
              ) : (
                <RequestTable data={paidRequests} showPayButton={false} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/activate-lab-process"
            className="text-sm text-blue-600 hover:underline"
          >
            🔧 Activate Test →
          </Link>
        </div>
      </div>
    </div>
  );
}
