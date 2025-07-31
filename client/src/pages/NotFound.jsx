import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-700">
        Redirecting you to the dashboard...
      </p>
    </div>
  );
}
export default NotFound;
