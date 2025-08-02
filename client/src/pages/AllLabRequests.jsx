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
      await API.patch(`/lab-requests/${id}/pay`);
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

  const pendingRequests = requests.filter((r) => !r.isPaid);
  const paidRequests = requests.filter(
    (r) => r.isPaid && r.status !== "completed"
  );
  const completedRequests = requests.filter((r) => r.status === "completed");

  const isMobile = window.innerWidth < 768;

  const statusTag = (r) => {
    if (r.status === "completed") {
      return "✅ Completed";
    } else if (r.status === "processing") {
      return "⚙️ Processing";
    } else if (r.isPaid) {
      return "💳 Paid";
    } else {
      return "⏳ Pending";
    }
  };

  const statusColor = (r) => {
    if (r.status === "completed") return "bg-blue-100 text-blue-700";
    if (r.status === "processing") return "bg-purple-100 text-purple-700";
    if (r.isPaid) return "bg-green-100 text-green-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const RequestTable = ({ data, showPayButton }) => (
    <table className="w-full text-sm table-auto border-collapse">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-3">Patient</th>
          <th className="p-3">Status</th>
          {showPayButton && <th className="p-3 text-right">Action</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr
            key={r.id}
            className="border-b cursor-pointer expandable-row hover:bg-gray-50"
            onClick={() =>
              setExpandedRow((prev) => (prev === r.id ? null : r.id))
            }
          >
            <td className="p-3 font-medium">
              👤 {getPatientName(r.patientId)}
            </td>
            <td className="p-3">
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs ${statusColor(
                  r
                )}`}
              >
                {statusTag(r)}
              </span>
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
                      ? "bg-green-300 opacity-75"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? "Processing..." : "Mark as Paid"}
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const TabButton = ({ label, value, color }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-3 py-1.5 rounded text-sm font-medium cursor-pointer ${
        activeTab === value
          ? `${color} text-white`
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-screen-md mx-auto">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Lab Requests</h1>
          <Link
            to="/requests"
            className="text-sm text-blue-600 hover:underline self-start"
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
          <TabButton label="Pending" value="pending" color="bg-yellow-500" />
          <TabButton label="Paid" value="paid" color="bg-green-600" />
          <TabButton label="Completed" value="completed" color="bg-blue-600" />
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
              {activeTab === "pending" &&
                (pendingRequests.length === 0 ? (
                  <p className="text-sm text-gray-500">No pending requests.</p>
                ) : (
                  <RequestTable data={pendingRequests} showPayButton />
                ))}

              {activeTab === "paid" &&
                (paidRequests.length === 0 ? (
                  <p className="text-sm text-gray-500">No paid requests.</p>
                ) : (
                  <>
                    <RequestTable data={paidRequests} showPayButton={false} />
                    <div className="mt-6 text-center">
                      <Link
                        to="/activate-lab-process"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        ⚙️ Activate Processing →
                      </Link>
                    </div>
                  </>
                ))}

              {activeTab === "completed" &&
                (completedRequests.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No completed requests.
                  </p>
                ) : (
                  <RequestTable
                    data={completedRequests}
                    showPayButton={false}
                  />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
