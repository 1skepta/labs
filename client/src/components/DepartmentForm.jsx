import { useState, useEffect } from "react";
import API from "../utils/api";

export default function DepartmentForm() {
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    const res = await API.get("/departments");
    setDepartments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/departments", { name });
    setName("");
    fetchDepartments();
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-bold">Create Department</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="border p-2 w-full rounded"
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>

      <ul className="pt-2 text-sm text-gray-700">
        {departments.map((d) => (
          <li key={d.id}>🧩 {d.name}</li>
        ))}
      </ul>
    </div>
  );
}
