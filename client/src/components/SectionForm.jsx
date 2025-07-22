import { useState, useEffect } from "react";
import API from "../utils/api";

export default function SectionForm() {
  const [name, setName] = useState("");
  const [sections, setSections] = useState([]);

  const fetchSections = async () => {
    const res = await API.get("/sections");
    setSections(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/sections", { name });
    setName("");
    fetchSections();
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="flex flex-col justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <h1 className="font-black text-3xl mb-3">Create Section</h1>
        <p className="text-gray-600 mb-6 text-base">
          Add new sections under departments for better test categorization.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              id="sectionName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="peer w-full border rounded-lg py-4 px-4 text-lg placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
              placeholder="Section Name"
            />
            <label
              htmlFor="sectionName"
              className="absolute left-4 top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#0030f1]"
            >
              Section Name
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0030f1] text-white rounded-lg py-4 text-lg font-semibold hover:bg-blue-800 transition"
          >
            Create Section
          </button>
        </form>

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
