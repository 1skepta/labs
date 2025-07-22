import { useState, useEffect } from "react";
import API from "../utils/api";

export default function DepartmentForm() {
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setMessage("Department created successfully ✅");
      setName("");
      fetchDepartments();
    } catch (err) {
      setError("Something went wrong while creating department");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="flex flex-col justify-center p-4 bg-gray-50 ">
      <div className="max-w-md w-full mx-auto">
        <h1 className="font-black text-3xl mb-3">Create Department</h1>
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
                : "bg-[#0030f1] text-white hover:bg-blue-800"
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

        {departments.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Existing Departments
            </h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              {departments.map((d) => (
                <li
                  key={d.id}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex items-center gap-2"
                >
                  🧩 {d.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
