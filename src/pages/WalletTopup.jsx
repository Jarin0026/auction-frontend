import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function WalletTopup() {
  const [amount, setAmount] = useState("");

  const addMoney = async () => {
    if (!amount || amount <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    try {
      const res = await api.post(`/api/payments/create-order?amount=${amount}`);

      const order = res.data;

      const options = {
        key: "rzp_test_SBg7pjGYuMNZQv",
        amount: order.amount,
        currency: "INR",
        name: "Auction Wallet",
        order_id: order.id,
        method: {
          upi: true,
          card: true,
          netbanking: true,
        },

        handler: async function (response) {
          await api.post("/api/payments/verify", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            userId: localStorage.getItem("userId"),
            amount: amount,
          });

          toast.success("Wallet credited.");
          setAmount("");
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      alert("Payment failed");
    }
  };

  return (
    <div className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-3 transition-colors">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full sm:w-36 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
        />

        <button
          onClick={addMoney}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 cursor-pointer"
        >
          Add Money
        </button>
      </div>
    </div>
  );
}
