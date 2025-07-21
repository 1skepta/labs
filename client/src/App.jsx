import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LabRequests from "./pages/LabRequests";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white p-4 flex gap-4">
          <Link to="/">Dashboard</Link>
          <Link to="/requests">Lab Requests</Link>
        </nav>
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requests" element={<LabRequests />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
