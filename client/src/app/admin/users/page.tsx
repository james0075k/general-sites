"use client";

import { useState, useEffect, useCallback } from "react";
import Loader from "@/components/Loader";
import { api } from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: User[] }>("/api/admin/users");
      setUsers(res.data || []);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleStatus = async (id: string) => {
    setToggling(id);
    try {
      await api.put(`/api/admin/users/${id}/toggle`, {});
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setToggling(null);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Users</h2>
        <p className="text-text-muted text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        {users.length === 0 ? (
          <div className="py-16 text-center text-text-muted">
            <p className="text-4xl mb-2">👥</p>
            <p>No users yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-low text-text-muted text-left">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-surface-low transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{user.name}</p>
                          <p className="text-text-muted text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-surface-low text-text-secondary"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-muted text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => toggleStatus(user._id)}
                          disabled={toggling === user._id}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${user.isActive
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-green-200 text-green-600 hover:bg-green-50"}`}
                        >
                          {toggling === user._id ? "..." : user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
