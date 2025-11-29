import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Facebook, Twitter, Github, User } from "lucide-react";
import API from "../utils/api";

export default function Signup() {
  const [name, setName] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!nameRegex.test(name.trim())) {
      setError(
        "Please enter a valid full name (only letters and spaces, at least 2 characters)."
      );
      setIsSubmitting(false);
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, and a number."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        username: email.trim(),
        password,
        name: name.trim(),
      });

      if (res.status === 201) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen px-7 bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <h1 className="font-black text-4xl mb-3">Join Us</h1>
        <p className="text-lg text-gray-600 mb-6">
          It only takes a minute to join
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
            <p className="font-semibold">Server ready! You can now sign up.</p>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <User className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="pl-11 w-full border rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
              required
              disabled={isSubmitting}
            />
          </div>

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
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              disabled={isSubmitting}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full bg-[#0030f1] text-white rounded-lg py-4 text-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-base text-gray-500 text-center">
          Already have an account?
          <Link
            to="/login"
            className="text-[#0030f1] underline ml-2 font-medium"
          >
            Sign In
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
