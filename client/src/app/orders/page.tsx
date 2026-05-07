"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { BsBoxSeam } from "react-icons/bs";
import { IoCheckmarkCircle } from "react-icons/io5";

interface OrderItem { name: string; quantity: number; price: number; }
interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function OrdersContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const successId = searchParams.get("success");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get<{ data: Order[] }>("/api/orders/my-orders");
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/login");
      else fetchOrders();
    }
  }, [user, authLoading, fetchOrders, router]);

  const cancelOrder = async (id: string) => {
    try {
      await api.put(`/api/orders/${id}/cancel`, {});
      fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel order");
    }
  };

  if (authLoading || loading) return (
    <>
      <Navbar />
      <main className="flex-1"><Loader fullPage /></main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">My Orders</h1>

        {successId && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl flex items-center gap-3">
            <IoCheckmarkCircle size={28} className="shrink-0" />
            <div>
              <p className="font-semibold">Order placed successfully!</p>
              <p className="text-sm">Order ID: {successId}</p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border py-20 text-center">
            <div className="flex justify-center mb-4 text-text-muted">
              <BsBoxSeam size={52} />
            </div>
            <p className="text-lg font-semibold text-text-primary mb-1">No orders yet</p>
            <p className="text-text-muted text-sm mb-6">Start shopping to see your orders here</p>
            <Link href="/products" className="inline-block bg-secondary text-white font-semibold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-surface rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-text-muted font-mono mb-1">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-text-secondary">{new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                      {order.orderStatus}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-text-secondary">{item.name} × {item.quantity}</span>
                        <span className="text-text-primary font-medium">NPR {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-muted capitalize">via {order.paymentMethod}</p>
                      <p className="font-bold text-text-primary">Total: NPR {order.total.toLocaleString()}</p>
                    </div>
                    {["pending", "processing"].includes(order.orderStatus) && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<><Navbar /><main className="flex-1"><Loader fullPage /></main><Footer /></>}>
      <OrdersContent />
    </Suspense>
  );
}
