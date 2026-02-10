import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await api.get("/api/admin/users");
    const filteredUsers = res.data.filter((user) => user.role != "ADMIN");
    setUsers(filteredUsers);
  };

  const toggleUser = async (user) => {
    if (!window.confirm("Are you sure?")) return;

    if (user.enabled) {
      await api.put(`/api/admin/users/${user.id}/block`);
    } else {
      await api.put(`/api/admin/users/${user.id}/unblock`);
    }

    loadUsers();
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Users
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage platform users and account access
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-4 transition-colors">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <label className="sr-only">Search users</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 transition-colors"
            />
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="overflow-x-auto">
          <div className="max-h-[440px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <table className="min-w-full text-sm text-left">
              <thead className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                    Name
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                    Email
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                    Role
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
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {u.name}
                    </td>

                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 break-all max-w-[220px] sm:max-w-none">
                      {u.email}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {u.role}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {u.enabled ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">
                          Blocked
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => toggleUser(u)}
                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-900 transition-colors cursor-pointer ${
                          u.enabled
                            ? "bg-red-600 hover:bg-red-700 focus:ring-red-300"
                            : "bg-green-600 hover:bg-green-700 focus:ring-green-300"
                        }`}
                      >
                        {u.enabled ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No users found.
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
