import { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);

      toast.success("Login success", { position: "top-center" });

      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Invalid password";
      toast.error(message, { position: "top-center" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6 transition-colors">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Login
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Access your account to continue
          </p>
        </div>

        <button
          onClick={() =>
            (window.location.href =
              "http://localhost:9090/oauth2/authorization/google")
          }
          className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            OR
          </span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="space-y-4">
          <input
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 transition"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 transition"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Login
        </button>

        {/* Seller Note */}
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 transition-colors">
          <p className="text-xs text-yellow-800 dark:text-yellow-300 leading-relaxed">
            <span className="font-semibold">Note:</span> To create a seller
            account, you must register manually using the standard registration
            form. Google login creates buyer accounts only.
          </p>
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Not registered?{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
