import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Facebook, Twitter, Github } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="flex flex-col justify-center min-h-screen px-7 bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <h1 className="font-black text-4xl mb-3">Join Us</h1>
        <p className="text-lg text-gray-600 mb-8">
          It only takes a minute to join
        </p>

        <div className="relative mb-6">
          <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer pl-11 w-full border rounded-lg py-4 px-4 text-lg placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
            placeholder="Email address"
          />
          <label
            htmlFor="email"
            className="absolute left-11 top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#0030f1]"
          >
            Email address
          </label>
        </div>

        <div className="relative mb-6">
          <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type={showPass ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer pl-11 pr-11 w-full border rounded-lg py-4 px-4 text-lg placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#0030f1]"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          ></button>
          <label
            htmlFor="password"
            className="absolute left-11 top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#0030f1]"
          >
            Password
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0030f1] text-white rounded-lg py-4 text-lg font-semibold hover:bg-blue-800 transition"
        >
          Create Account
        </button>

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
            <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center cursor-not-allowed opacity-50">
              <Facebook size={20} />
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center cursor-not-allowed opacity-50">
              <Twitter size={20} />
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center cursor-not-allowed opacity-50">
              <Github size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
