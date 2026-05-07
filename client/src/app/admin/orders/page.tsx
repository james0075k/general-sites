"use client";

import { useState, useEffect, useCallback } from "react";
import Loader from "@/components/Loader";
import { api } from "@/lib/api";

interface Order {
  _id: string;
  user?: { name: string; email: string };
  total: number;
  subtotal: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  createdAt: string;
}

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const qs = filterStatus ? `?status=${filterStatus}` : "";
    try {
      const res = await api.get<{ data: Order[] }>(`/api/admin/orders${qs}`);
      setOrders(res.data || []);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  }, [filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: string, field: "orderStatus" | "paymentStatus", value: string) => {
    setUpdating(id);
    try {
      await api.put(`/api/admin/orders/${id}/status`, { [field]: value });
      fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Orders</h2>
          <p className="text-text-muted text-sm mt-1">{orders.length} orders</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-border rounded-xl px-4 py-2 text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border py-16 text-center text-text-muted">
          <p className="text-4xl mb-2">📋</p>
          <p>No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-surface rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
              <button
                onClick={() => setExpanded((e) => e === order._id ? null : order._id)}
                className="w-full text-left px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-surface-low transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs text-text-muted">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                      {order.orderStatus}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {order.user?.name || "Unknown"} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-text-primary">NPR {order.total.toLocaleString()}</p>
                  <p className="text-xs text-text-muted capitalize">{order.paymentMethod}</p>
                </div>
              </button>

              {expanded === order._id && (
                <div className="border-t border-border px-5 py-4 bg-surface-low">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">Items</p>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm text-text-secondary">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="font-medium text-text-primary">NPR {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">Order Status</label>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order._id, "orderStatus", e.target.value)}
                        disabled={updating === order._id}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 disabled:opacity-60"
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">Payment Status</label>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updateStatus(order._id, "paymentStatus", e.target.value)}
                        disabled={updating === order._id}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 disabled:opacity-60"
                      >
                        {PAYMENT_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
