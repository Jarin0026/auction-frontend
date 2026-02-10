import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("BUYER");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    const res = api.post("/api/users/register", {
      name,
      email,
      password,
      address,
      role,
    });

    e.preventDefault();

    try {
      toast.success("Registered successfully.");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6 transition-colors">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Register
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create your account to start using the platform
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 transition"
            type="text"
            placeholder="Full name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 transition"
            type="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 transition"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 transition"
            type="text"
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
          />

          <select
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 transition"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
          </select>

          <button
            className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
            type="submit"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already a user?{" "}
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
