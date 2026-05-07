"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Loader from "@/components/Loader";
import { api } from "@/lib/api";
import { BsBoxSeam, BsShop, BsCash, BsClipboardCheck, BsPeopleFill } from "react-icons/bs";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Array<{
    _id: string;
    user: { name: string; email: string };
    total: number;
    orderStatus: string;
    createdAt: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

interface StatCard {
  label: string;
  value: string;
  icon: ReactNode;
  color: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Stats }>("/api/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage />;

  const STAT_CARDS: StatCard[] = [
    { label: "Total Revenue", value: `NPR ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <BsCash size={22} />, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "Total Orders", value: String(stats?.totalOrders || 0), icon: <BsBoxSeam size={22} />, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Total Products", value: String(stats?.totalProducts || 0), icon: <BsShop size={22} />, color: "bg-purple-50 text-purple-700 border-purple-200" },
    { label: "Total Users", value: String(stats?.totalUsers || 0), icon: <BsPeopleFill size={22} />, color: "bg-orange-50 text-orange-700 border-orange-200" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Overview</h2>
        <p className="text-text-muted text-sm mt-1">Your store at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className={`rounded-xl border p-5 ${s.color}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium opacity-80">{s.label}</p>
              <span className="flex items-center justify-center opacity-80">{s.icon}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Recent Orders</h3>
        </div>
        {!stats?.recentOrders?.length ? (
          <div className="py-12 text-center text-text-muted">
            <div className="flex justify-center mb-2">
              <BsClipboardCheck size={32} />
            </div>
            <p className="text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-low text-text-muted text-left">
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-surface-low transition-colors">
                    <td className="px-5 py-3 font-mono text-text-muted">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-text-primary">{order.user?.name || "—"}</p>
                      <p className="text-text-muted text-xs">{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-3 font-semibold text-text-primary">NPR {order.total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
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
