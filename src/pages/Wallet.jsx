import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import WalletTopup from "./WalletTopup";


export default function Wallet() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    loadTransaction();
    loadWallet();
  }, []);

  const loadWallet = async () => {
    const userId = localStorage.getItem("userId");
    const res = await api.get(`/api/wallet/summary/${userId}`);
    setWallet(res.data);
  };

  const loadTransaction = async () => {
    const userId = localStorage.getItem("userId");
    const res = await api.get(`/api/transactions/user/${userId}`);

    const recent = res.data.slice(0, 10);
    setTransactions(recent);
  };

  const available = wallet ? wallet.balance - wallet.lockBalance : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-900 overflow-x-hidden transition-colors">
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:opacity-80 transition"
          >
            ← Home
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
            My Wallet
          </h1>

          <div />
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div
          className="
          bg-gradient-to-r from-indigo-600 to-blue-600
          dark:from-indigo-700 dark:to-blue-700
          text-white rounded-2xl shadow-lg
          p-5 sm:p-8
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          gap-6 items-center
        "
        >
          <div>
            <p className="text-sm opacity-80">Total Balance</p>
            <p className="text-2xl sm:text-4xl font-bold mt-1">
              ₹ {wallet?.balance ?? 0}
            </p>
          </div>

          <div className="space-y-1 text-sm sm:text-base">
            <p>🔒 Locked: ₹ {wallet?.lockBalance ?? 0}</p>
            <p className="font-semibold">✅ Available: ₹ {available}</p>
          </div>

          <div className="flex sm:justify-start lg:justify-end">
            <WalletTopup />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-4 sm:p-6 transition-colors">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Recent Transactions
          </h2>

          {transactions.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-6">
              No recent transactions.
            </p>
          )}

          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="
                flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2
                bg-gray-50 dark:bg-gray-800/60
                hover:bg-gray-100 dark:hover:bg-gray-800
                border border-transparent dark:border-gray-700
                transition p-3 sm:p-4 rounded-xl
              "
              >
                <div>
                  <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-100">
                    {t.type === "CREDIT" ? "Wallet Topup" : "Bid Payment"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Transaction ID: {t.id}
                  </p>
                </div>

                <p
                  className={`font-bold text-base sm:text-lg ${
                    t.type === "CREDIT"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {t.type === "CREDIT" ? "+" : "-"} ₹{t.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
