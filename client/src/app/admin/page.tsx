"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Loader from "@/components/Loader";
import { api } from "@/lib/api";
import {
  BsArrowRight,
  BsBoxSeam,
  BsCash,
  BsClipboardCheck,
  BsPeopleFill,
  BsShop,
} from "react-icons/bs";

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
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

interface StatCard {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  color: string;
}

function formatCurrency(value: number) {
  return `NPR ${value.toLocaleString()}`;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: Stats }>("/api/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const statCards: StatCard[] = useMemo(
    () => [
      {
        label: "Revenue",
        value: formatCurrency(stats?.totalRevenue || 0),
        hint: "Paid order value",
        icon: <BsCash size={21} />,
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      },
      {
        label: "Orders",
        value: String(stats?.totalOrders || 0),
        hint: "All-time orders",
        icon: <BsBoxSeam size={21} />,
        color: "text-blue-700 bg-blue-50 border-blue-200",
      },
      {
        label: "Products",
        value: String(stats?.totalProducts || 0),
        hint: "Active catalog",
        icon: <BsShop size={21} />,
        color: "text-violet-700 bg-violet-50 border-violet-200",
      },
      {
        label: "Customers",
        value: String(stats?.totalUsers || 0),
        hint: "Registered users",
        icon: <BsPeopleFill size={21} />,
        color: "text-orange-700 bg-orange-50 border-orange-200",
      },
    ],
    [stats]
  );

  const recentOrders = stats?.recentOrders ?? [];
  const pendingCount = recentOrders.filter((order) => order.orderStatus === "pending").length;
  const deliveredCount = recentOrders.filter((order) => order.orderStatus === "delivered").length;

  if (loading) return <Loader fullPage />;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-surface p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Operations overview</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
              Clean view of orders, revenue and catalog health.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Monitor marketplace activity, review recent orders and jump into the highest-impact
              admin tasks without extra navigation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
            >
              Manage products
              <BsArrowRight size={15} />
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-text-primary transition hover:bg-surface-low"
            >
              View orders
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-surface p-5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-text-secondary">{card.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{card.value}</p>
                <p className="mt-1 text-xs text-text-muted">{card.hint}</p>
              </div>
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${card.color}`}>
                {card.icon}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <h3 className="font-bold text-text-primary">Recent orders</h3>
              <p className="text-xs text-text-muted">Latest marketplace activity</p>
            </div>
            <Link href="/admin/orders" className="text-sm font-bold text-secondary transition hover:text-secondary/80">
              Open all
            </Link>
          </div>

          {!recentOrders.length ? (
            <div className="py-14 text-center text-text-muted">
              <div className="mb-3 flex justify-center">
                <BsClipboardCheck size={34} />
              </div>
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-low text-left text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-5 py-3 font-bold">Order</th>
                    <th className="px-5 py-3 font-bold">Customer</th>
                    <th className="px-5 py-3 font-bold">Total</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="transition hover:bg-surface-low/70">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-text-secondary">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-text-primary">{order.user?.name || "Unknown customer"}</p>
                        <p className="text-xs text-text-muted">{order.user?.email || "No email"}</p>
                      </td>
                      <td className="px-5 py-4 font-bold text-text-primary">{formatCurrency(order.total)}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
                            STATUS_COLORS[order.orderStatus] || "border-gray-200 bg-gray-50 text-gray-600"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-bold text-text-primary">Order pulse</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 text-sm">
                <span className="font-semibold text-amber-800">Pending review</span>
                <span className="font-bold text-amber-800">{pendingCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm">
                <span className="font-semibold text-emerald-800">Delivered recently</span>
                <span className="font-bold text-emerald-800">{deliveredCount}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-primary p-5 text-white" style={{ boxShadow: "var(--shadow-lg)" }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">Next action</p>
            <h3 className="mt-3 text-lg font-bold">Keep product stock fresh</h3>
            <p className="mt-2 text-sm leading-6 text-white/64">
              Low-stock products should be updated before campaigns to avoid checkout friction.
            </p>
            <Link
              href="/admin/products"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-secondary/90"
            >
              Review catalog
              <BsArrowRight size={15} />
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
