import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-gray-900/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 tracking-tight whitespace-nowrap">
          Auction Platform
        </h1>

        <div className="hidden md:flex flex-1 justify-center items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
          <Link
            to="/dashboard"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Dashboard
          </Link>

          {role === "BUYER" && (
            <>
              <Link
                to="/wallet"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Wallet
              </Link>
              <Link
                to="/transactions"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Transactions
              </Link>
              <Link
                to="/mybids"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                My Bids
              </Link>
            </>
          )}

          {role === "SELLER" && (
            <>
              <Link
                to="/create-auction"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Create Auction
              </Link>
              <Link
                to="/seller-earnings"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Earnings
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/40 cursor-pointer"
            >
              {darkMode ? "☀" : "🌙"}
            </button>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-400/40 cursor-pointer"
            >
              Logout
            </button>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="md:hidden px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? "☀" : "🌙"}
          </button>

          <button
            className="md:hidden text-2xl text-gray-700 dark:text-gray-200 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-3 text-sm font-medium text-gray-700 dark:text-gray-200">
          <Link
            to="/dashboard"
            onClick={closeMenu}
            className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Dashboard
          </Link>

          {role === "BUYER" && (
            <>
              <Link
                to="/wallet"
                onClick={closeMenu}
                className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Wallet
              </Link>
              <Link
                to="/transactions"
                onClick={closeMenu}
                className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Transactions
              </Link>
              <Link
                to="/mybids"
                onClick={closeMenu}
                className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                My Bids
              </Link>
            </>
          )}

          {role === "SELLER" && (
            <>
              <Link
                to="/create-auction"
                onClick={closeMenu}
                className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Create Auction
              </Link>
              <Link
                to="/seller-earnings"
                onClick={closeMenu}
                className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Earnings
              </Link>
            </>
          )}

          <button
            onClick={() => {
              closeMenu();
              logout();
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
