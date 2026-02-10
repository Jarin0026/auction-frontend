import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateAuction() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!title || !description || !startPrice || !startTime || !endTime) {
      toast.error("Please fill all fields", { position: "top-center" });
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      toast.error("End time must be greater than start time", {
        position: "top-center",
      });
      return;
    }

    if (Number(startPrice) <= 0) {
      toast.error("Start price must be greater than 0", {
        position: "top-center",
      });
      return;
    }
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("startPrice", startPrice);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);

      images.forEach((img) => {
        formData.append("images", img);
      });

      await api.post("/api/auctions/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Auction created", { position: "top-center" });
      navigate("/dashboard");
    } catch (err) {
      toast.error("Upload failed. Provide all details.", {
        position: "top-center",
      });
    }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 py-8 flex justify-center transition-colors">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6 sm:p-8 space-y-6 transition-colors">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Create Auction
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add details and images to publish a new auction
          </p>
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload Images
          </label>

          <input
            type="file"
            required
            multiple
            accept="image/*"
            onChange={handleImages}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-gray-200 dark:file:bg-gray-700 file:text-gray-800 dark:file:text-gray-200 hover:file:bg-gray-300 dark:hover:file:bg-gray-600 cursor-pointer transition"
          />

          {preview.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {preview.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0 hover:opacity-90 transition"
                  alt="Preview"
                />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            type="text"
            placeholder="Enter auction title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="Describe the item"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Price & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Price
            </label>
            <input
              required
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              type="number"
              placeholder="₹ Amount"
              onChange={(e) => setStartPrice(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Time
            </label>
            <input
              required
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              type="datetime-local"
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Time
            </label>
            <input
              required
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              type="datetime-local"
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Button */}
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition shadow-sm cursor-pointer"
          onClick={handleCreate}
        >
          Create Auction
        </button>
      </div>
    </div>
  );
}
