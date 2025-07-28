import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil } from "lucide-react";
import patient from "../assets/patient.png";
import API from "../utils/api";

export default function PatientDisplay() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="bg-gray-50 flex items-center justify-center md:px-4 py-10 md:w-1/2">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-9">
          <h2 className=" text-gray-800">Your Patients</h2>
          <button
            onClick={() => navigate("/patients")}
            className="bg-gray-200 p-2 rounded-full cursor-pointer"
          >
            <Plus size={18} className="text-gray-700" />
          </button>
        </div>

        {patients.length === 0 ? (
          <p className="text-gray-600">No patients found.</p>
        ) : (
          <ul className="space-y-4">
            {patients.slice(0, 3).map((p) => (
              <li key={p.id} className="flex justify-between items-start pb-3">
                <div className="flex items-start gap-3">
                  <img
                    src={patient}
                    alt="patient"
                    className="w-10 h-10 object-cover rounded-full mt-1"
                  />
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {p.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {p.gender} {calculateAge(p.dob)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/patients")}
                  className="bg-gray-200 p-2 rounded-full cursor-pointer"
                >
                  <Pencil size={16} className="text-gray-700" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
