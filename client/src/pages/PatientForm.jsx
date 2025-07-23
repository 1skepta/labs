import { useState, useEffect, useRef } from "react";
import { Calendar, Phone, User2, Venus, Mars } from "lucide-react";
import patient from "../assets/patient.png";
import API from "../utils/api";

export default function PatientForm() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [patients, setPatients] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const expandedRef = useRef(null);

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
      setMessage("Patient added successfully!");
      setName("");
      setDob("");
      setGender("");
      setPhone("");
      fetchPatients();
    } catch (err) {
      setError("Failed to add patient. Please try again.");
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (expandedRef.current && !expandedRef.current.contains(e.target)) {
        setExpandedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h1 className="font-black text-3xl mb-3 ">Add a Patient</h1>
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
              className={`w-full rounded-lg py-4 text-lg font-semibold transition cursor-pointer ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#0030f1] text-white hover:bg-blue-800"
              }`}
            >
              {loading ? "Adding..." : "Add Patient"}
            </button>
          </form>
        </div>

        {patients.length > 0 && (
          <div className="overflow-y-auto max-h-[450px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Existing Patients
            </h2>
            <ul className="space-y-3 text-gray-700 text-sm">
              {patients.map((p) => (
                <li
                  key={p.id}
                  ref={expandedId === p.id ? expandedRef : null}
                  className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 transition-all duration-300 ${
                    expandedId === p.id ? "pb-5" : "pb-3"
                  }`}
                  onClick={() =>
                    setExpandedId(expandedId === p.id ? null : p.id)
                  }
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <img
                      src={patient}
                      alt="patient"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <p className="text-base font-semibold text-gray-900">
                      {p.name}
                    </p>
                  </div>

                  <div
                    className={`grid gap-2 transition-all duration-300 overflow-hidden ${
                      expandedId === p.id
                        ? "max-h-40 opacity-100 mt-3"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      DOB: {p.dob}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {p.gender === "Male" ? (
                        <Mars size={16} />
                      ) : p.gender === "Female" ? (
                        <Venus size={16} />
                      ) : (
                        <User2 size={16} />
                      )}
                      Gender: {p.gender}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} />
                      {p.phone}
                    </div>
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
