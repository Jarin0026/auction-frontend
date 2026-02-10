import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function MyBids() {
  const userId = Number(localStorage.getItem("userId"));
  const navigate = useNavigate();

  const [bids, setBids] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadBids();
  }, []);

  const loadBids = async () => {
    const res = await api.get(`/api/bids/user/${userId}`);
    setBids(res.data);
  };

  const filteredBids = bids.filter((b) => {
    if (filter === "ALL") return true;

    if (filter === "RUNNING") {
      return b.auction.status === "ACTIVE";
    }

    if (filter === "WON") {
      return b.auction.status === "CLOSED" && b.auction.winner?.id === userId;
    }

    if (filter === "LOST") {
      return b.auction.status === "CLOSED" && b.auction.winner?.id !== userId;
    }

    return true;
  });

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
            My Bids
          </h1>

          <div />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {["ALL", "RUNNING", "WON", "LOST"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition cursor-pointer
                ${
                  filter === f
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredBids.length === 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-8 text-center text-gray-500 dark:text-gray-400 transition-colors">
            No bids found for this filter.
          </div>
        )}

        {/* Bid list */}
        <div className="max-h-[500px] overflow-y-auto space-y-3">
          {filteredBids.map((b) => {
            const isWon =
              b.auction.status === "CLOSED" && b.auction.winner?.id === userId;

            const isLost =
              b.auction.status === "CLOSED" && b.auction.winner?.id !== userId;

            return (
              <div
                key={b.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-5 rounded-2xl shadow hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
              >
                <div>
                  <p className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">
                    {b.auction.title}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {new Date(b.bidTime).toLocaleString()}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                  <p className="text-green-600 dark:text-green-400 font-bold text-base sm:text-lg">
                    ₹ {b.amount}
                  </p>

                  {b.auction.status === "ACTIVE" && (
                    <span className="bg-yellow-500 dark:bg-yellow-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Running
                    </span>
                  )}

                  {isWon && (
                    <span className="bg-green-600 dark:bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Won
                    </span>
                  )}

                  {isLost && (
                    <span className="bg-red-600 dark:bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Lost
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
