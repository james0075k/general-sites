"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery", short: "COD", bg: "#0f172a" },
  { value: "khalti", label: "Khalti", short: "Khalti", bg: "#5C2D91" },
  { value: "esewa", label: "eSewa", short: "eSewa", bg: "#60BB46" },
];

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, fetchCart, updateItem, removeItem, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
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
  const shipping = subtotal >= 5000 ? 0 : subtotal === 0 ? 0 : 100;
  const vat = Math.round(subtotal * 0.13 * 100) / 100;
  const total = subtotal + shipping + vat;
  const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);
  const selectedMethod = PAYMENT_METHODS.find((m) => m.value === paymentMethod)!;

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/cart"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-surface hover:bg-surface-low transition-colors text-text-secondary"
          >
            ←
          </Link>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Checkout</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5 gap-8">

            {/* ── LEFT: Products + Shipping + Notes ── */}
            <div className="lg:col-span-3 space-y-6">

              {/* Products section */}
              <div className="bg-surface rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                  <h2 className="font-bold text-text-primary text-lg">Products</h2>
                  <Link href="/products" className="text-xs text-secondary hover:text-secondary/80 font-medium transition-colors">
                    + Add product
                  </Link>
                </div>

                {cart.items.length === 0 ? (
                  <div className="px-6 pb-6 text-center text-text-muted text-sm py-8">
                    Your cart is empty.{" "}
                    <Link href="/products" className="text-secondary underline">Browse products</Link>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex items-center gap-4 px-6 py-4">
                        {/* Product image */}
                        <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-surface-low border border-border">
                          {item.product.images?.[0] ? (
                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-xl">📦</div>
                          )}
                        </div>

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-semibold text-text-primary text-sm leading-snug line-clamp-1 hover:text-secondary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wide">
                            {item.product.category ?? "Neplai"}
                          </p>
                          <p className="text-secondary font-bold text-sm mt-1">
                            NPR {item.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateItem(item.product._id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-surface-low hover:border-text-muted transition-colors text-sm font-bold"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-semibold text-text-primary text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateItem(item.product._id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-surface-low hover:border-text-muted disabled:opacity-40 transition-colors text-sm font-bold"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product._id)}
                            className="ml-1 w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Line total */}
                        <div className="text-right shrink-0 w-24">
                          <p className="font-bold text-text-primary text-sm">
                            NPR {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping address */}
              <div className="bg-surface rounded-2xl border border-border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <h2 className="font-bold text-text-primary text-lg mb-5">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Street Address *</label>
                    <input
                      name="street" value={form.street} onChange={handleChange} required
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors placeholder:text-text-muted"
                      placeholder="House no., Street, Area"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">City *</label>
                      <input
                        name="city" value={form.city} onChange={handleChange} required
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors placeholder:text-text-muted"
                        placeholder="Kathmandu"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">State / Province</label>
                      <input
                        name="state" value={form.state} onChange={handleChange}
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors placeholder:text-text-muted"
                        placeholder="Bagmati"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Postal Code</label>
                    <input
                      name="postalCode" value={form.postalCode} onChange={handleChange}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors placeholder:text-text-muted"
                      placeholder="44600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Order Notes <span className="normal-case font-normal text-text-muted">(optional)</span></label>
                    <textarea
                      name="notes" value={form.notes} onChange={handleChange} rows={2}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none placeholder:text-text-muted"
                      placeholder="Any special instructions for delivery..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Payment summary card ── */}
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-2xl border border-border overflow-hidden sticky top-20" style={{ boxShadow: "var(--shadow-lg)" }}>

                {/* Payment header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                  <h2 className="font-bold text-text-primary text-lg">Payment</h2>
                  <span className="text-xs font-semibold text-text-muted bg-surface-low px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Breakdown */}
                <div className="px-6 py-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-semibold text-text-primary">NPR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Delivery</span>
                    <span className={`font-semibold ${shipping === 0 ? "text-secondary" : "text-text-primary"}`}>
                      {shipping === 0 ? "FREE" : `NPR ${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">VAT (13%)</span>
                    <span className="font-semibold text-text-primary">NPR {vat.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between">
                    <span className="font-bold text-text-primary">Total</span>
                    <span className="font-bold text-text-primary text-lg">NPR {total.toLocaleString()}</span>
                  </div>
                  {subtotal > 0 && subtotal < 5000 && (
                    <p className="text-xs text-tertiary font-medium text-center pt-1">
                      Add NPR {(5000 - subtotal).toLocaleString()} more for free delivery!
                    </p>
                  )}
                </div>

                {/* Discount code */}
                <div className="px-6 pb-4">
                  <button
                    type="button"
                    onClick={() => setShowDiscount((s) => !s)}
                    className="w-full flex items-center justify-between py-3 px-4 rounded-xl border border-border text-sm text-text-secondary hover:border-secondary/40 hover:text-secondary transition-colors"
                  >
                    <span className="font-medium">I have a discount code</span>
                    <span className="text-lg leading-none">{showDiscount ? "−" : "+"}</span>
                  </button>
                  {showDiscount && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                      />
                      <button
                        type="button"
                        className="px-4 py-2.5 bg-secondary text-white text-sm font-semibold rounded-xl hover:bg-secondary/90 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment method */}
                <div className="px-6 pb-5">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Pay with</p>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setPaymentMethod(m.value)}
                        className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                          paymentMethod === m.value
                            ? "border-transparent text-white scale-[1.02] shadow-md"
                            : "border-border text-text-secondary hover:border-secondary/30 bg-surface"
                        }`}
                        style={paymentMethod === m.value ? { backgroundColor: m.bg } : {}}
                      >
                        {m.short}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirm button */}
                <div className="px-6 pb-6">
                  <button
                    type="submit"
                    disabled={submitting || cart.items.length === 0}
                    className="w-full flex items-center justify-between bg-primary text-white font-semibold py-4 px-5 rounded-2xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
                  >
                    <span className="text-sm">{submitting ? "Placing Order..." : "Confirm payment"}</span>
                    <span
                      className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: selectedMethod.bg === "#0f172a" ? "#1e293b" : selectedMethod.bg }}
                    >
                      <span>
                        {selectedMethod.value === "cod" ? "💵" : selectedMethod.value === "khalti" ? "🟣" : "🟢"}
                      </span>
                      <span>{selectedMethod.short}</span>
                    </span>
                  </button>
                  <p className="text-xs text-text-muted text-center mt-3 flex items-center justify-center gap-1">
                    <span>🔒</span>
                    <span>Secure &amp; encrypted checkout</span>
                  </p>
                </div>

              </div>
            </div>

          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
