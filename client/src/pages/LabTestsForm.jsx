import { useState, useEffect, useRef } from "react";
import API from "../utils/api";
import testIcon from "../assets/test.png";
import { Trash2 } from "lucide-react";

export default function LabTestForm() {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [sections, setSections] = useState([]);
  const [tests, setTests] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const containerRef = useRef();

  useEffect(() => {
    fetchSections();
    fetchTests();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setExpandedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSections = async () => {
    try {
      const res = await API.get("/sections");
      setSections(res.data);
    } catch (err) {
      console.error("Failed to load sections", err);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await API.get("/lab-tests");
      setTests(res.data);
    } catch (err) {
      console.error("Failed to load lab tests", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim() || !cost.trim() || !sectionId) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/lab-tests", { name, cost, sectionId });
      setName("");
      setCost("");
      setSectionId("");
      setMessage("Lab test added successfully");
      fetchTests();
    } catch (err) {
      console.error(err);
      setError("Failed to add lab test");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 4000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/lab-tests/${id}`);
      fetchTests();
      setExpandedId(null);
    } catch (err) {
      console.error("Failed to delete test", err);
    }
  };

  const getSectionName = (id) => {
    const section = sections.find((s) => s.id === parseInt(id));
    return section ? section.name : "Unknown Section";
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* FORM SIDE */}
        <div>
          <h1 className="font-black text-3xl mb-3">Lab Test Setup</h1>
          <p className="text-gray-600 mb-6 text-base">
            Add individual lab tests under each section with a cost.
          </p>

          {message && (
            <div className="mb-4 text-green-700 bg-green-100 px-4 py-3 rounded-md text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 text-red-700 bg-red-100 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Test Name"
              className="w-full border rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
            />

            <input
              type="number"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Cost (₵)"
              className="w-full border rounded-lg py-4 px-4 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
            />

            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full border rounded-lg py-4 px-4 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
            >
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg py-4 text-lg font-semibold transition cursor-pointer ${
                loading
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-[#0030f1] text-white hover:bg-blue-800"
              }`}
            >
              {loading ? "Creating..." : "Add Test"}
            </button>
          </form>
        </div>

        {/* LIST SIDE */}
        <div ref={containerRef}>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Existing Lab Tests
          </h2>

          {tests.length === 0 ? (
            <p className="text-gray-500 text-sm">No lab tests found.</p>
          ) : (
            <ul className="space-y-3 text-sm text-gray-800">
              {tests.map((t) => {
                const isExpanded = expandedId === t.id;
                return (
                  <div
                    key={t.id}
                    className="relative w-full overflow-hidden rounded-xl"
                  >
                    {/* Wrapper to control swipe */}
                    <div className="relative w-full h-full">
                      {/* Actual row content */}
                      <div
                        className={`flex transition-transform duration-300 ${
                          isExpanded ? "-translate-x-16" : "translate-x-0"
                        }`}
                        onClick={() => setExpandedId(isExpanded ? null : t.id)}
                      >
                        <li className="flex items-start gap-4 p-4 w-full bg-white border border-gray-200 rounded-xl shadow-sm">
                          <img
                            src={testIcon}
                            alt="lab"
                            className="w-10 h-10 object-contain"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-base">{t.name}</p>
                            <p className="text-gray-500 text-sm mt-1">
                              ₵{parseFloat(t.cost).toFixed(2)} —{" "}
                              <span className="italic">
                                {getSectionName(t.sectionId)}
                              </span>
                            </p>
                          </div>
                        </li>
                      </div>

                      {/* Hidden delete zone (positioned behind) */}
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="absolute top-0 right-0 h-full w-16 bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
