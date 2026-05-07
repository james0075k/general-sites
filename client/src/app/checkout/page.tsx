"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery", icon: "💵" },
  { value: "khalti", label: "Khalti", icon: "🟣" },
  { value: "esewa", label: "eSewa", icon: "🟢" },
];

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, fetchCart, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState({
    street: "", city: "", state: "", postalCode: "", notes: "",
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/login");
      else fetchCart();
    }
  }, [user, authLoading, fetchCart, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) { setError("Your cart is empty"); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post<{ data: { _id: string } }>("/api/orders", {
        shippingAddress: {
          street: form.street, city: form.city, state: form.state,
          postalCode: form.postalCode, country: "Nepal",
        },
        paymentMethod,
        notes: form.notes,
      });
      await clearCart();
      router.push(`/orders?success=${res.data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return (
    <>
      <Navbar />
      <main className="flex-1"><Loader fullPage /></main>
      <Footer />
    </>
  );

  const subtotal = cart.totalPrice;
  const shipping = subtotal >= 5000 ? 0 : 100;
  const vat = Math.round(subtotal * 0.13 * 100) / 100;
  const total = subtotal + shipping + vat;

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/cart" className="text-text-muted hover:text-secondary text-sm">← Cart</Link>
          <span className="text-text-muted">/</span>
          <h1 className="text-xl font-bold text-text-primary">Checkout</h1>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-surface rounded-xl border border-border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <h2 className="font-bold text-text-primary mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Street Address *</label>
                    <input name="street" value={form.street} onChange={handleChange} required
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                      placeholder="House no., Street, Area" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">City *</label>
                      <input name="city" value={form.city} onChange={handleChange} required
                        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                        placeholder="Kathmandu" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">State</label>
                      <input name="state" value={form.state} onChange={handleChange}
                        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                        placeholder="Bagmati" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Postal Code</label>
                    <input name="postalCode" value={form.postalCode} onChange={handleChange}
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                      placeholder="44600" />
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-xl border border-border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <h2 className="font-bold text-text-primary mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === m.value ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/40"}`}
                    >
                      <input type="radio" name="paymentMethod" value={m.value}
                        checked={paymentMethod === m.value}
                        onChange={() => setPaymentMethod(m.value)} className="accent-secondary" />
                      <span className="text-lg">{m.icon}</span>
                      <span className="font-medium text-text-primary text-sm">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-xl border border-border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <h2 className="font-bold text-text-primary mb-4">Order Notes (optional)</h2>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 resize-none"
                  placeholder="Any special instructions for delivery..." />
              </div>
            </div>

            <div>
              <div className="bg-surface rounded-xl border border-border p-6 sticky top-20" style={{ boxShadow: "var(--shadow-card)" }}>
                <h2 className="font-bold text-text-primary mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm text-text-secondary">
                      <span className="line-clamp-1 flex-1">{item.product.name} × {item.quantity}</span>
                      <span className="shrink-0 ml-2 font-medium text-text-primary">NPR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <hr className="border-border mb-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span><span>NPR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-secondary" : ""}>{shipping === 0 ? "FREE" : `NPR ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>VAT (13%)</span><span>NPR {vat.toLocaleString()}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-bold text-text-primary">
                    <span>Total</span><span>NPR {total.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  type="submit" disabled={submitting || cart.items.length === 0}
                  className="mt-5 w-full bg-secondary text-white font-semibold py-3 rounded-xl hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
                <p className="text-xs text-text-muted text-center mt-2">🔒 Secure &amp; encrypted</p>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
