import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LabRequests from "./pages/LabRequests";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Header from "./components/Header";
import DepartmentForm from "./pages/DepartmentForm";
import SectionForm from "./pages/SectionForm";
import PatientForm from "./pages/PatientForm";
import ProtectedRoute from "./utils/ProtectedRoute";
import LabTestForm from "./pages/LabTestsForm";
import AllLabRequests from "./pages/AllLabRequests";

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

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <LabRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-lab-requests"
            element={
              <ProtectedRoute>
                <AllLabRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <DepartmentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sections"
            element={
              <ProtectedRoute>
                <SectionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab-tests"
            element={
              <ProtectedRoute>
                <LabTestForm />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}
