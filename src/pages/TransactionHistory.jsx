import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TransactionHistory() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadTransactions();
    loadBalance();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await api.get(`/api/transactions/user/${userId}`);
      setTransactions(res.data);
    } catch {
      alert("Failed to load transaction.");
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async () => {
    const res = await api.get(`/api/wallet/balance/${userId}`);
    setBalance(res.data);
  };

  const filteredTransaction = transactions.filter((tx) =>
    filter === "ALL" ? true : tx.type === filter,
  );

  const buildMonthlySummary = (transactions) => {
    const map = {};

    transactions.forEach((t) => {
      const month = new Date(t.time).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!map[month]) {
        map[month] = { month, credit: 0, debit: 0 };
      }

      if (t.type === "CREDIT") map[month].credit += t.amount;
      if (t.type === "DEBIT") map[month].debit += t.amount;
    });

    return Object.values(map);
  };

  const monthlyData = buildMonthlySummary(transactions);

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Transaction History", 14, 15);

    const tableData = transactions.map((t) => [
      new Date(t.time).toLocaleDateString(),
      t.type,
      `₹${t.amount}`,
    ]);

    autoTable(doc, {
      head: [["Date", "Type", "Amount"]],
      body: tableData,
      startY: 25,
    });

    doc.save("transactions.pdf");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 overflow-x-hidden">
        <p className="text-gray-500 dark:text-gray-400">
          Loading transactions...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-900 overflow-x-hidden transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:opacity-80 transition"
          >
            ← Home
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
            Transaction History
          </h1>

          <div />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 text-white p-5 sm:p-8 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Wallet Balance</p>
          <h2 className="text-2xl sm:text-4xl font-bold mt-1">₹ {balance}</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full">
          {["ALL", "CREDIT", "DEBIT"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex-1 min-w-0 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition cursor-pointer ${
                filter === type
                  ? type === "CREDIT"
                    ? "bg-green-600 text-white"
                    : type === "DEBIT"
                      ? "bg-red-600 text-white"
                      : "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {type}
            </button>
          ))}

          <button
            onClick={exportPDF}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-medium shadow cursor-pointer"
          >
            Export PDF
          </button>
        </div>

        {/* Transactions List */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-4 sm:p-6 transition-colors">
          {filteredTransaction.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">
              No transactions found.
            </p>
          )}

          <div className="max-h-[350px] overflow-y-auto space-y-3">
            {filteredTransaction.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition p-3 sm:p-4 rounded-xl"
              >
                <div>
                  <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100">
                    {tx.type}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {new Date(tx.time).toLocaleString()}
                  </p>
                </div>

                <p
                  className={`font-bold text-base sm:text-lg ${
                    tx.type === "CREDIT"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6 rounded-2xl shadow-md transition-colors">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Monthly Summary
          </h2>

          <div className="w-full h-[240px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="credit"
                  stroke="#16a34a"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="debit"
                  stroke="#dc2626"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
