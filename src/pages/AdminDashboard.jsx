import { useEffect, useState } from "react";
import api from "../services/api";
import AdminUser from "./AdminUser";
import AdminAuctions from "./AdminAuction";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    loadStats();
    loadMonthlyRevenue();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get("/api/admin/stats");
      setStats(res.data);
    } catch (err) {
      alert("Failed to load admin stats");
    }
  };

  const loadMonthlyRevenue = async () => {
    const res = await api.get("/api/admin/revenue/monthly");

    const months = [
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
      month: months[month - 1],
      revenue: amount,
    }));

    setMonthlyRevenue(formatted);
  };

  if (!stats)
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Loading admin dashboard...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 sm:px-6 py-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Platform overview and system analytics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Users" value={stats.totalUsers} />
          <StatCard title="Auctions" value={stats.totalAuctions} />
          <StatCard title="Active Auctions" value={stats.activeAuctions} />
          <StatCard title="Revenue" value={`₹ ${stats.platformRevenue}`} />
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-5 sm:p-6 transition-colors">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Monthly Platform Revenue
          </h2>

          <div className="w-full h-[260px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-5 sm:p-6 transition-colors">
            <AdminUser />
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-5 sm:p-6 transition-colors">
            <AdminAuctions />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}
