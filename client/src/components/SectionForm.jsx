import { useState, useEffect } from "react";
import API from "../utils/api";

export default function SectionForm() {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSections = async () => {
    try {
      const res = await API.get("/sections");
      setSections(res.data);
    } catch (err) {
      console.error("Error fetching sections", err);
    }
  };

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
    setError("");
    setMessage("");

    if (!name.trim() || !departmentId) {
      setError("Section name and department are required.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/sections", { name, departmentId });
      setMessage("Section created successfully ✅");
      setName("");
      setDepartmentId("");
      fetchSections();
    } catch (err) {
      console.error(err);
      setError("Failed to create section");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchDepartments();
  }, []);

  return (
    <div className="flex flex-col justify-center p-4 bg-gray-50 ">
      <div className="max-w-md w-full mx-auto">
        <h1 className="font-black text-3xl mb-3">Create Section</h1>
        <p className="text-gray-600 mb-6 text-base">
          Add new sections under departments for better test categorization.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Section Name"
            className="w-full border rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
          />

          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full border rounded-lg py-4 px-4 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-4 text-lg font-semibold transition ${
              loading
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-[#0030f1] text-white hover:bg-blue-800"
            }`}
          >
            {loading ? "Creating..." : "Create Section"}
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

        {sections.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Existing Sections
            </h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              {sections.map((section) => (
                <li
                  key={section.id}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex items-center gap-2"
                >
                  🧩 {section.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
