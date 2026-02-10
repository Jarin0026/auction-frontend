import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import toast from "react-hot-toast";

import noimage from "../assets/no image.avif";

export default function AuctionDetails() {
  const { id } = useParams();
  const bottomRef = useRef(null);

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [amount, setAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    loadAuction();
    loadBids();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bids]);

  const loadAuction = async () => {
    const res = await api.get(`/api/auctions/${id}`);
    setAuction(res.data);
  };

  const loadBids = async () => {
    const res = await api.get(`/api/bids/auction/${id}`);
    setBids(res.data);
  };

  const placeBid = async () => {
    if (!auction) return;

    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);

    // ❌ Invalid config
    if (end <= start) {
      toast.error("Invalid auction configuration", {
        position: "top-center",
      });
      return;
    }

    // ⏳ Not started yet
    if (now < start) {
      toast.error("Auction has not started yet", {
        position: "top-center",
      });
      return;
    }

    // 🛑 Already ended
    if (now >= end || isEnded) {
      toast.error("Auction already ended", {
        position: "top-center",
      });
      return;
    }

    try {
      await api.post(`/api/bids/place`, {
        auctionId: id,
        amount: amount,
      });

      setAmount("");
      loadBids();
    } catch (error) {
      const message = error?.response?.data?.message || "Bid Failed";
      toast.error(message, { position: "top-center" });
    }
  };

  useEffect(() => {
    if (!auction) return;

    const interval = setInterval(() => {
      const end = new Date(auction.endTime);
      const now = new Date();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Auction ended");
        setIsEnded(true);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:9090/ws"),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/bids/${id}`, (msg) => {
          const newBid = JSON.parse(msg.body);

          setBids((prev) => {
            const exists = prev.some((b) => b.id === newBid.id);
            return exists ? prev : [newBid, ...prev];
          });
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [id]);

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading auction details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-md transition-colors">
          <div className="grid grid-cols-2 gap-4">
            {auction.imageUrls?.length > 0 ? (
              auction.imageUrls.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:9090${img}`}
                  className="w-full h-auto object-contain rounded-xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition"
                  alt="Auction"
                />
              ))
            ) : (
              <img
                src={noimage}
                className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                alt="No image"
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-md transition-colors">
            <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {auction.title}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {auction.description}
            </p>

            <div className="flex justify-between items-center">
              <p className="text-gray-500 dark:text-gray-400">Starting Price</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                ₹{auction.startPrice}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  auction.status === "ACTIVE"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {auction.status}
              </span>

              <span className="bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300 px-3 py-1 rounded font-medium">
                ⏳ {timeLeft}
              </span>
            </div>

            {auction.status === "CLOSED" && auction.winner && (
              <p className="mt-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 p-3 rounded">
                🏆 Winner: {auction.winner.name || auction.winner.email}
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-md transition-colors">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Live Bids
            </h3>

            <div className="max-h-48 overflow-y-auto space-y-2 mb-4 pr-1">
              {bids.map((b) => (
                <div
                  key={b.id}
                  className="flex justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded"
                >
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    ₹{b.amount}
                  </span>
                </div>
              ))}

              <div ref={bottomRef}></div>
            </div>

            <input
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 w-full rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter bid amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              disabled={isEnded}
              className={`w-full py-3 rounded-xl font-semibold shadow cursor-pointer transition ${
                isEnded
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              }`}
              onClick={placeBid}
            >
              Place Bid
            </button>

            {isEnded && (
              <p className="text-red-600 dark:text-red-400 mt-3 font-semibold text-center">
                Auction closed. No more bids allowed.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
