import { useEffect, useState } from "react";
import API from "../utils/api";
import { Trash2 } from "lucide-react"; // bin icon

export default function StaffForm() {
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    departmentId: "",
    sectionId: "",
    role: "",
    responsibilities: "",
  });
  const [message, setMessage] = useState("");
  const [activeDelete, setActiveDelete] = useState(null);

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
    fetchSections();
    fetchUsers();
  }, []);

  const fetchStaff = async () => {
    const res = await API.get("/staff");
    setStaffList(res.data);
  };

  const fetchDepartments = async () => {
    const res = await API.get("/departments");
    setDepartments(res.data);
  };

  const fetchSections = async () => {
    const res = await API.get("/sections");
    setSections(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get("/auth/users");
    setUsers(res.data);
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
    fetchStaff(); // refresh list
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDelete = async (userId) => {
    await API.delete(`/staff/${userId}`);
    setStaffList((prev) => prev.filter((s) => s.userId !== userId));
    setActiveDelete(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6">
      {/* Form Side */}
      <div className="lg:w-2/3">
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
            placeholder="Role"
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
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800 cursor-pointer"
          >
            Assign Staff
          </button>
        </form>
      </div>

      {/* Staff List Side */}
      <div className="lg:w-1/3 bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Assigned Staff</h2>
        <ul className="space-y-3">
          {staffList.map((s) => (
            <li
              key={s.userId}
              onClick={() => setActiveDelete(s.userId)}
              className={`flex justify-between items-center p-2 border rounded cursor-pointer transition-all duration-300 ${
                activeDelete === s.userId ? "translate-x-[-10px]" : ""
              }`}
            >
              <span className="text-gray-700">
                {s.name}{" "}
                <span className="text-sm italic text-gray-500">({s.role})</span>
              </span>

              {activeDelete === s.userId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(s.userId);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
