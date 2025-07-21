import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LabRequests from "./pages/LabRequests";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";

function Layout() {
  const location = useLocation();
  const hideHeader = ["/login", "/signup", "/onboarding"].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && (
        <nav className="bg-blue-600 text-white p-4 flex gap-4">
          <Link to="/">Dashboard</Link>
          <Link to="/requests">Lab Requests</Link>
        </nav>
      )}
      <div className="">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requests" element={<LabRequests />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
