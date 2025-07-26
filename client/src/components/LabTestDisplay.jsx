import { useEffect, useState } from "react";
import API from "../utils/api";

export default function LabTestDisplay() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await API.get("/lab-tests");
        setTests(res.data);
      } catch (err) {
        console.error("Failed to load lab tests", err);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="p-4">
      <h2 className=" mb-4 text-gray-800">Tests Available...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tests.slice(0, 4).map((test) => (
          <div
            key={test.id}
            className="bg-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition text-center"
          >
            <p className=" font-bold text-gray-800 mb-2">{test.name}</p>
            <p className="text-lg text-gray-900">
              ₵{parseFloat(test.cost).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
