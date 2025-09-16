import { useState, useEffect, useRef } from "react";
import API from "../utils/api";
import { Trash2 } from "lucide-react";

export default function DepartmentForm() {
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [revealedId, setRevealedId] = useState(null);

  const containerRef = useRef(null);

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Department name is required");
      return;
    }

    setLoading(true);
    try {
      await API.post("/departments", { name });
      setMessage("Department created successfully");
      setName("");
      fetchDepartments();
    } catch (err) {
      setError("Something went wrong while creating department");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setMessage("");
    try {
      await API.delete(`/departments/${id}`);
      setMessage("Department deleted successfully");
      fetchDepartments();
      setRevealedId(null);
    } catch (err) {
      setError("Error deleting department");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setRevealedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="font-black text-3xl mb-3 ">Create Department</h1>
          <p className="text-gray-600 mb-6 text-base">
            Add new departments to your Lab Management System.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Department Name"
              className="w-full border rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg py-4 text-lg font-semibold transition ${
                loading
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-[#0030f1] text-white hover:bg-blue-800 cursor-pointer"
              }`}
            >
              {loading ? "Creating..." : "Create Department"}
            </button>
          </form>

          {message && (
            <div className="mt-4 text-green-600 text-sm font-medium">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-500 text-sm font-medium">{error}</div>
          )}
        </div>

        {departments.length > 0 && (
          <div className="overflow-y-auto max-h-[400px]" ref={containerRef}>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Existing Departments
            </h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              {departments.map((d) => (
                <li key={d.id} className="relative">
                  <div className="absolute inset-0 bg-red-50 rounded-lg flex justify-end items-center pr-4">
                    {revealedId === d.id && (
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-red-600 hover:text-red-800 transition z-10 cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>

                  <div
                    onClick={() =>
                      setRevealedId((prev) => (prev === d.id ? null : d.id))
                    }
                    className={`relative z-20 bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                      revealedId === d.id ? "-translate-x-16" : ""
                    }`}
                  >
                    🧩 {d.name}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
