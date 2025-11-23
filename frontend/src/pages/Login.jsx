import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "../utils/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/auth/login",
        { email, password, role },
        { headers: { "No-Auth": true } }
      );
      login(response.data.user);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-xl rounded-2xl overflow-hidden bg-white">
        {/* Left Side: Branding */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-10 text-white flex items-center justify-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back 👋</h2>
            <p className="text-lg">Log in to access your dashboard</p>
            <p className="text-sm mt-4 opacity-80 italic">
              "Empower your skills with the right connection."
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Login to Your Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="projectSponsor">Project Sponsor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-200 ease-in-out focus:outline-none"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
