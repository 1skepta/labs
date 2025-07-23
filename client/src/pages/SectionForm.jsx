import { useState, useEffect, useRef } from "react";
import API from "../utils/api";
import { Trash2 } from "lucide-react";

export default function SectionForm() {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [revealedId, setRevealedId] = useState(null);

  const containerRef = useRef(null);

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
      setMessage("Section created successfully");
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

  const handleDelete = async (id) => {
    try {
      await API.delete(`/sections/${id}`);
      setMessage("Section deleted successfully");
      fetchSections();
      setRevealedId(null);
    } catch (err) {
      console.error("Error deleting section", err);
      setError("Failed to delete section");
    }
  };

  useEffect(() => {
    fetchSections();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setRevealedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="font-black text-3xl mb-3 ">Create Section</h1>
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
                  : "bg-[#0030f1] text-white hover:bg-blue-800 cursor-pointer"
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
        </div>

        {sections.length > 0 && (
          <div className="overflow-y-auto max-h-[400px]" ref={containerRef}>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Existing Sections
            </h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              {sections.map((section) => (
                <li key={section.id} className="relative">
                  <div className="absolute inset-0 bg-red-50 rounded-lg flex justify-end items-center pr-4">
                    {revealedId === section.id && (
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="text-red-600 hover:text-red-800 transition z-10"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>

                  <div
                    onClick={() =>
                      setRevealedId((prev) =>
                        prev === section.id ? null : section.id
                      )
                    }
                    className={`relative z-20 bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                      revealedId === section.id ? "-translate-x-16" : ""
                    }`}
                  >
                    🧩 {section.name}
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
