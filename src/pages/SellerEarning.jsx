import { useEffect, useState } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function SellerEarnings() {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadEarnings();
    loadMonthlyEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const res = await api.get("/api/payments/seller/earnings");
      setPayments(res.data);

      const sum = res.data.reduce((acc, p) => acc + p.amount, 0);
      setTotal(sum);
    } catch (err) {
      toast.error("Failed to load earning.");
    }
  };

  const loadMonthlyEarnings = async () => {
    const sellerId = localStorage.getItem("userId");

    const res = await api.get(`/api/transactions/seller/monthly/${sellerId}`);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formatted = Object.entries(res.data).map(([month, amount]) => ({
      month: monthNames[month - 1],
      amount: amount,
    }));

    setMonthlyData(formatted);
  };

  const filteredPayments = payments.filter((p) => {
    const txDate = new Date(p.paymentTime);

    if (fromDate && txDate < new Date(fromDate)) return false;
    if (toDate && txDate > new Date(toDate)) return false;

    return true;
  });

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Transaction History", 14, 10);

    const tableData = filteredPayments.map((p) => [
      p.auction.title,
      `Rs. ${p.amount}`,
      new Date(p.paymentTime).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [["Auction", "Amount", "Date"]],
      body: tableData,
      startY: 20,
    });

    doc.save("transactions.pdf");
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-950 min-h-screen space-y-6 transition-colors">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Seller Earnings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Track your earnings and transaction history
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-5 w-full sm:w-72 transition-colors">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total Earnings
        </p>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
          ₹ {total}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-4 sm:p-6 space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Sold Auctions
          </h2>

          <button
            onClick={downloadPDF}
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-auto"
          >
            Download PDF
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              From
            </label>
            <input
              type="date"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 transition"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              To
            </label>
            <input
              type="date"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 transition"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none cursor-pointer"
          >
            Clear filter
          </button>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                    Auction
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 break-words">
                      {p.auction.title}
                    </td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold whitespace-nowrap">
                      ₹ {p.amount}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(p.paymentTime).toLocaleString()}
                    </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5 transition-colors">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Monthly Earnings
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#16a34a"
                strokeWidth={3}
                name="Earnings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
