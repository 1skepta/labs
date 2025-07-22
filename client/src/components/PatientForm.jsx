import { useState, useEffect } from "react";
import API from "../utils/api";

export default function PatientForm() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [patients, setPatients] = useState([]);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      await API.post("/patients", { name, dob, gender, phone });
      setMessage("✅ Patient added successfully!");
      setName("");
      setDob("");
      setGender("");
      setPhone("");
      fetchPatients();
    } catch (err) {
      setError("❌ Failed to add patient. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 4000);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="flex flex-col justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <h1 className="font-black text-3xl mb-3">Add a Patient</h1>
        <p className="text-gray-600 mb-6 text-base">
          Fill out the form to register a new patient.
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
            placeholder="Full Name"
            className="w-full border rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
          />

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="Date of Birth"
            className="w-full border rounded-lg py-4 px-4 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded-lg py-4 px-4 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full border rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-4 text-lg font-semibold transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#0030f1] text-white hover:bg-blue-800"
            }`}
          >
            {loading ? "Adding..." : "Add Patient"}
          </button>
        </form>

        {patients.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Existing Patients
            </h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              {patients.map((p) => (
                <li
                  key={p.id}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex flex-col gap-0.5"
                >
                  🧩 <strong>{p.name}</strong>
                  <span className="text-gray-500 text-xs">
                    {p.gender}, DOB: {p.dob}, 📞 {p.phone}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
