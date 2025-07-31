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
  const [resultFields, setResultFields] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const itemRefs = useRef({});

  useEffect(() => {
    fetchSections();
    fetchTests();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        expandedId !== null &&
        itemRefs.current[expandedId] &&
        !itemRefs.current[expandedId].contains(e.target)
      ) {
        setExpandedId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedId]);

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
      await API.post("/lab-tests", {
        name,
        cost,
        sectionId,
        resultFields,
      });

      setName("");
      setCost("");
      setSectionId("");
      setResultFields([]);
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

  const addField = () => {
    setResultFields([
      ...resultFields,
      { label: "", unit: "", referenceRange: "", type: "" },
    ]);
  };

  const updateField = (index, key, value) => {
    const updated = [...resultFields];
    updated[index][key] = value;
    setResultFields(updated);
  };

  const removeField = (index) => {
    const updated = [...resultFields];
    updated.splice(index, 1);
    setResultFields(updated);
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h1 className="font-black text-3xl mb-3">Lab Test Setup</h1>
          <p className="text-gray-600 mb-6 text-base">
            Add individual lab tests under each section with cost and optional
            result fields.
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
              className="w-full border rounded-lg py-4 px-4 text-lg"
            />

            <input
              type="number"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Cost (₵)"
              className="w-full border rounded-lg py-4 px-4 text-lg"
            />

            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full border rounded-lg py-4 px-4 text-lg"
            >
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/*
  <div className="space-y-3 mt-6">
    <h3 className="font-semibold text-base">Define Result Fields</h3>

    {resultFields.map((field, index) => (
      <div
        key={index}
        className="border p-4 rounded-md space-y-2 bg-white"
      >
        <input
          type="text"
          placeholder="Field Label (e.g., Hemoglobin)"
          value={field.label}
          onChange={(e) =>
            updateField(index, "label", e.target.value)
          }
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Unit (e.g., g/dL)"
          value={field.unit}
          onChange={(e) => updateField(index, "unit", e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Reference Range (e.g., 13.5 - 17.5)"
          value={field.referenceRange}
          onChange={(e) =>
            updateField(index, "referenceRange", e.target.value)
          }
          className="w-full border rounded px-3 py-2"
        />

        <select
          value={field.type}
          onChange={(e) => updateField(index, "type", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Field Type</option>
          <option value="number">Number</option>
          <option value="text">Text</option>
          <option value="select">Select (Dropdown)</option>
        </select>

        {field.type === "select" && (
          <input
            type="text"
            placeholder="Options (comma separated)"
            value={field.options?.join(",") || ""}
            onChange={(e) =>
              updateField(
                index,
                "options",
                e.target.value.split(",").map((o) => o.trim())
              )
            }
            className="w-full border rounded px-3 py-2"
          />
        )}

        <button
          type="button"
          onClick={() => removeField(index)}
          className="text-sm text-red-500 hover:underline"
        >
          Remove Field
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={addField}
      className="text-blue-600 text-sm hover:underline"
    >
      + Add Result Field
    </button>
  </div>
  */}

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

        <div>
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
                    ref={(el) => (itemRefs.current[t.id] = el)}
                    className="relative w-full overflow-hidden rounded-xl"
                  >
                    <div
                      className={`flex transition-transform duration-300 w-[calc(100%+4rem)]`}
                      style={{
                        transform: isExpanded
                          ? "translateX(-4rem)"
                          : "translateX(0)",
                      }}
                      onClick={() => setExpandedId(isExpanded ? null : t.id)}
                    >
                      <li className="flex items-start gap-4 p-4 w-full bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer">
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(t.id);
                        }}
                        className="w-16 bg-red-100 text-red-600 flex-shrink-0 flex items-center justify-center hover:bg-red-200 transition"
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
