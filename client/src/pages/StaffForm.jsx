import { useEffect, useState } from "react";
import API from "../utils/api";

export default function StaffForm() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    departmentId: "",
    sectionId: "",
    role: "",
    responsibilities: "",
  });
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchSections();
  }, []);

  const fetchUsers = async () => {
    const res = await API.get("/auth/users"); // You’ll need to build this endpoint if you don’t have it
    setUsers(res.data);
  };

  const fetchDepartments = async () => {
    const res = await API.get("/departments");
    setDepartments(res.data);
  };

  const fetchSections = async () => {
    const res = await API.get("/sections");
    setSections(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post("/staff", form);
    setMessage(res.data.message);
    setForm({
      userId: "",
      departmentId: "",
      sectionId: "",
      role: "",
      responsibilities: "",
    });
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Assign Staff to Department</h1>

      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="userId"
          value={form.userId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.username})
            </option>
          ))}
        </select>

        <select
          name="departmentId"
          value={form.departmentId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          name="sectionId"
          value={form.sectionId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Role (e.g. Lab Tech, Admin)"
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="responsibilities"
          value={form.responsibilities}
          onChange={handleChange}
          placeholder="Responsibilities"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800"
        >
          Assign Staff
        </button>
      </form>
    </div>
  );
}
