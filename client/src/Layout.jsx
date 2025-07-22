import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LabRequests from "./pages/LabRequests";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Header from "./components/Header";
import DepartmentForm from "./components/DepartmentForm";

export default function Layout() {
  const location = useLocation();
  const hideHeader = ["/login", "/signup", "/onboarding", "/"].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/requests" element={<LabRequests />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/departments" element={<DepartmentForm />} />
        </Routes>
      </div>
    </div>
  );
}
