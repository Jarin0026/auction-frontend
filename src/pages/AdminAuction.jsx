import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    const res = await api.get("/api/admin/auctions");
    console.log(res.data);
    setAuctions(res.data);
  };

  const forceClose = async (id) => {
    if (!window.confirm("Force close this auction?")) return;
    await api.put(`/api/admin/auctions/${id}/close`);
    loadAuctions();
  };

  const filteredAuctions = [...auctions].reverse().filter((a) => {
    const term = search.toLowerCase();
    return (
      a.seller?.name?.toLowerCase().includes(term) ||
      a.seller?.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Auctions
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monitor and manage all platform auctions
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-4 transition-colors">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <label className="sr-only">Search seller</label>
            <input
              type="text"
              placeholder="Filter by seller name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 transition-colors"
            />
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Showing {filteredAuctions.length} of {auctions.length} auctions
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <table className="min-w-full text-sm text-left">
              <thead className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                    Title
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                    Seller
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                    Email
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAuctions.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 max-w-[240px] break-words">
                      {a.title}
                    </td>

                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {a.seller?.name}
                    </td>

                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 break-all max-w-[220px] sm:max-w-none">
                      {a.seller?.email}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {a.status === "ACTIVE" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">
                          CLOSED
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {a.status === "ACTIVE" && (
                        <button
                          onClick={() => forceClose(a.id)}
                          className="px-3 cursor-pointer py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 dark:focus:ring-offset-gray-900 transition-colors shadow-sm"
                        >
                          Force Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredAuctions.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No auctions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
