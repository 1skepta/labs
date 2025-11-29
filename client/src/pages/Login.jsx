import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Facebook, Twitter, Github } from "lucide-react";
import API from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isWarming, setIsWarming] = useState(true);
  const [isServerReady, setIsServerReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // ---- PROACTIVE BACKEND WARM-UP ON PAGE LOAD ----
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    const warmUpBackend = async () => {
      try {
        await API.get("/ping", { timeout: 35000 });
        setIsServerReady(true);

        setTimeout(() => {
          setIsWarming(false);
        }, 2000);
      } catch (err) {
        setIsWarming(false);
        setIsServerReady(false);
      }
    };

    warmUpBackend();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        username: email.trim(),
        password,
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.name);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen px-7 bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <h1 className="font-black text-4xl mb-3">Log In</h1>
        <p className="text-lg text-gray-600 mb-6">
          Please log in to your Labs Account
        </p>

        {/* WARMING UP BANNER */}
        {isWarming && !isServerReady && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-4 rounded-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <div>
              <p className="font-semibold">Warming up the server...</p>
              <p className="text-sm text-blue-600">
                This may take 20–30 seconds on first load
              </p>
            </div>
          </div>
        )}

        {/* SERVER READY TOAST */}
        {isWarming && isServerReady && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="text-xl">✅</span>
            <p className="font-semibold">Server ready! You can now log in.</p>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="relative mb-4">
            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="pl-11 w-full border rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="relative mb-6">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="pl-11 pr-11 w-full border rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0030f1] text-white rounded-lg py-4 text-lg font-semibold hover:bg-blue-800 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Logging In...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="mt-6 text-base text-gray-500 text-center">
          Don't have an account?
          <Link
            to="/signup"
            className="text-[#0030f1] underline ml-2 font-medium"
          >
            Create One
          </Link>
        </p>

        <div className="mt-10">
          <p className="text-center text-sm text-gray-400 mb-4">
            Social login not yet available
          </p>
          <div className="flex justify-center gap-5">
            {[Facebook, Twitter, Github].map((Icon, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center cursor-not-allowed opacity-50"
              >
                <Icon size={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
