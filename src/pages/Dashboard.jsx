import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import noimage from "../assets/no image.avif";
import WalletTopup from "./WalletTopup";

import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const [auctions, setAuctions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [tick, setTick] = useState(0);

  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAuctions();
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const res = await api.get(`/api/wallet/balance/${userId}`);
      setBalance(res.data);
    } catch {
      console.log("Failed to load wallet.");
    }
  };

  const loadAuctions = async () => {
    try {
      const res = await api.get("/api/auctions/all");

      const active = res.data
        .filter((a) => a.status === "ACTIVE")
        .sort((a, b) => b.id - a.id);

      const closed = res.data
        .filter((a) => a.status === "CLOSED")
        .sort((a, b) => b.id - a.id);

      setAuctions([...active, ...closed]);
      setCurrentPage(1);
    } catch {
      alert("Failed to load auctions");
    }
  };

  const calculateTimeLeft = (endTime) => {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return null;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);

    return { days, hours, minutes };
  };

  const isEndingSoon = (endTime) => {
    const diff = new Date(endTime) - new Date();
    return diff > 0 && diff <= 10 * 60 * 1000;
  };

  const totalPages = Math.ceil(auctions.length / itemsPerPage);

  const paginatedAuctions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return auctions.slice(start, start + itemsPerPage);
  }, [auctions, currentPage]);

  if (role?.trim().toUpperCase() === "ADMIN") {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Live Auctions
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Discover and bid on active listings
            </p>
          </div>

          <div
            className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-3
          bg-green-50 dark:bg-green-900/20
          border border-green-200 dark:border-green-800
          px-4 sm:px-5 py-3 rounded-xl"
          >
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Wallet Balance
              </p>
              <p className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-400">
                ₹ {balance}
              </p>
            </div>

            <WalletTopup />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
          Available Auctions
        </h2>

        {auctions.length === 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
            No auctions available right now.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedAuctions.map((auction) => {
            const timeLeft =
              auction.status === "ACTIVE"
                ? calculateTimeLeft(auction.endTime)
                : null;

            return (
              <div
                key={auction.id}
                className={`group
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-800
                rounded-2xl shadow-sm hover:shadow-md
                transition overflow-hidden
                ${isEndingSoon(auction.endTime) ? "ring-2 ring-red-400" : ""}
              `}
              >
                <div className="overflow-hidden">
                  <img
                    src={
                      auction.imageUrls?.length > 0
                        ? `http://localhost:9090${auction.imageUrls[0]}`
                        : noimage
                    }
                    className="w-full h-44 sm:h-52 object-cover group-hover:scale-[1.02] transition"
                    alt="Auction"
                  />
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                    {auction.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {auction.description}
                  </p>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Starting
                    </span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      ₹ {auction.startPrice}
                    </span>
                  </div>

                  {auction.highestBid && (
                    <div
                      className="p-2
                    bg-green-50 dark:bg-green-900/20
                    border border-green-200 dark:border-green-800
                    rounded text-sm"
                    >
                      Highest bid:
                      <span className="font-semibold text-green-700 dark:text-green-400 ml-1">
                        ₹ {auction.highestBid}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full
                      ${
                        auction.status === "ACTIVE"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {auction.status}
                    </span>

                    {auction.status === "ACTIVE" && timeLeft && (
                      <span
                        className="text-xs
                      bg-orange-50 dark:bg-orange-900/20
                      text-orange-600 dark:text-orange-400
                      px-2 py-1 rounded"
                      >
                        ⏱ {timeLeft.hours}h {timeLeft.minutes}m
                      </span>
                    )}
                  </div>

                  {auction.status === "CLOSED" && auction.winner && (
                    <div
                      className="text-xs
                    bg-green-100 dark:bg-green-900/30
                    text-green-800 dark:text-green-300
                    p-2 rounded"
                    >
                      🏆 Winner: {auction.winner.name} ({auction.winner.email})
                    </div>
                  )}

                  {role === "BUYER" && auction.status === "ACTIVE" && (
                    <button
                      className="w-full mt-2
                      bg-indigo-600 hover:bg-indigo-700
                      dark:bg-indigo-500 dark:hover:bg-indigo-600
                      text-white py-2 rounded-lg
                      font-semibold text-sm transition cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/auction/${auction.id}`)
                      }
                    >
                      View & Bid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 pt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 text-sm
              border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-900
              text-gray-800 dark:text-gray-200
              rounded-lg disabled:opacity-40
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 text-sm rounded-lg transition
                ${
                  currentPage === i + 1
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                    : "border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 text-sm
              border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-900
              text-gray-800 dark:text-gray-200
              rounded-lg disabled:opacity-40
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
