import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Log in to continue
        </p>

        <form className="space-y-5">
          <div className="flex items-center gap-2 border rounded-lg px-4 py-2 focus-within:ring-2 ring-blue-500">
            <Mail className="text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 border rounded-lg px-4 py-2 focus-within:ring-2 ring-blue-500">
            <Lock className="text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
