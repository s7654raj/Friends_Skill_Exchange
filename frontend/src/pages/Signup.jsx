import React, { useState, useContext } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/auth/signup",
        { name, email, password, role },
        { headers: { "No-Auth": true } }
      );
      console.log("Signup successful:", response.data);
      signup(response.data.user);
    } catch (err) {
      setError("User already exists or an error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-200 to-pink-200 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/60 border border-white/30">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="projectSponsor">Project Sponsor</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-lg transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-700">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
