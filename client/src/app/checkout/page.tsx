"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { IoArrowBack, IoClose, IoLockClosed } from "react-icons/io5";
import {
  BsArrowRight,
  BsBoxSeam,
  BsCash,
  BsCheck2,
  BsCreditCard2Front,
  BsShieldCheck,
  BsWallet2,
} from "react-icons/bs";
import { HiMinus, HiOutlineTruck, HiPlus } from "react-icons/hi";

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on delivery", short: "COD", bg: "#0b1f1a" },
  { value: "khalti", label: "Khalti wallet", short: "Khalti", bg: "#5C2D91" },
  { value: "esewa", label: "eSewa wallet", short: "eSewa", bg: "#60BB46" },
];

const CHECKOUT_STEPS = ["Cart", "Delivery", "Payment"];
const FREE_SHIPPING_THRESHOLD = 5000;

function PaymentMethodIcon({ method, size = 14 }: { method: string; size?: number }) {
  if (method === "cod") return <BsCash size={size} />;
  if (method === "khalti") return <BsWallet2 size={size} />;
  return <BsCreditCard2Front size={size} />;
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, fetchCart, updateItem, removeItem, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/login");
      else fetchCart();
    }
  }, [user, authLoading, fetchCart, router]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await api.post<{ data: { _id: string } }>("/api/orders", {
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: "Nepal",
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

  if (authLoading) {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <Loader fullPage />
        </main>
        <Footer />
      </>
    );
  }

  const subtotal = cart.totalPrice;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : subtotal === 0 ? 0 : 100;
  const vat = Math.round(subtotal * 0.13 * 100) / 100;
  const total = subtotal + shipping + vat;
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const selectedMethod = PAYMENT_METHODS.find((method) => method.value === paymentMethod)!;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border bg-primary text-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/72 transition hover:text-white"
            >
              <IoArrowBack size={17} />
              Back to cart
            </Link>
            <div className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">Checkout</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Finish your order securely.</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/68">
                  Confirm delivery, payment method and final totals before placing your Neplai order.
                </p>
              </div>
              <div className="flex gap-2">
                {CHECKOUT_STEPS.map((step, index) => (
                  <div
                    key={step}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${
                      index < 2
                        ? "border-secondary/30 bg-secondary/15 text-white"
                        : "border-white/16 bg-white/[0.06] text-white/62"
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/12">
                      {index < 2 ? <BsCheck2 size={13} /> : index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {cart.items.length === 0 ? (
            <div className="rounded-3xl border border-border bg-surface px-6 py-20 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-low text-text-muted">
                <BsBoxSeam size={34} />
              </div>
              <p className="text-xl font-bold text-text-primary">Your cart is empty</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
                Add products before checkout so we can calculate delivery and payment totals.
              </p>
              <Link
                href="/products"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-white transition hover:bg-secondary/90"
              >
                Browse products
                <BsArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                <div className="space-y-6">
                  <section className="overflow-hidden rounded-2xl border border-border bg-surface" style={{ boxShadow: "var(--shadow-card)" }}>
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                      <div>
                        <h2 className="font-bold text-text-primary">Order items</h2>
                        <p className="text-xs text-text-muted">{itemCount} items ready for checkout</p>
                      </div>
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-1 text-xs font-bold text-secondary transition hover:text-secondary/80"
                      >
                        <HiPlus size={13} />
                        Add more
                      </Link>
                    </div>

                    <div className="divide-y divide-border">
                      {cart.items.map((item) => (
                        <div key={item._id} className="grid gap-4 px-5 py-4 sm:grid-cols-[64px_1fr_auto] sm:items-center">
                          <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-border bg-surface-low">
                            {item.product.images?.[0] ? (
                              <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                                <BsBoxSeam size={22} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="line-clamp-1 text-sm font-bold text-text-primary transition hover:text-secondary"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-1 text-sm font-bold text-secondary">NPR {item.price.toLocaleString()}</p>
                            <div className="mt-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateItem(item.product._id, item.quantity - 1)}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border text-text-secondary transition hover:bg-surface-low"
                                aria-label="Decrease quantity"
                              >
                                <HiMinus size={13} />
                              </button>
                              <span className="w-7 text-center text-sm font-bold text-text-primary">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateItem(item.product._id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border text-text-secondary transition hover:bg-surface-low disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Increase quantity"
                              >
                                <HiPlus size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(item.product._id)}
                                className="ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted transition hover:bg-red-50 hover:text-red-600"
                                title="Remove"
                              >
                                <IoClose size={15} />
                              </button>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Line total</p>
                            <p className="mt-1 font-bold text-text-primary">
                              NPR {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-border bg-surface p-5" style={{ boxShadow: "var(--shadow-card)" }}>
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <h2 className="font-bold text-text-primary">Delivery address</h2>
                        <p className="text-xs text-text-muted">Nepal delivery details</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        Step 2
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-muted">
                          Street address *
                        </label>
                        <input
                          name="street"
                          value={form.street}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                          placeholder="House number, street, area"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-muted">
                            City *
                          </label>
                          <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                            placeholder="Kathmandu"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-muted">
                            Province
                          </label>
                          <input
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                            placeholder="Bagmati"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-muted">
                            Postal code
                          </label>
                          <input
                            name="postalCode"
                            value={form.postalCode}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                            placeholder="44600"
                          />
                        </div>
                        <div className="rounded-xl border border-border bg-surface-low px-4 py-3 text-sm text-text-secondary">
                          <p className="flex items-center gap-2 font-semibold text-text-primary">
                            <HiOutlineTruck className="text-secondary" size={16} />
                            Delivery estimate
                          </p>
                          <p className="mt-1 text-xs">Major cities: 2-4 business days</p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-muted">
                          Order notes
                        </label>
                        <textarea
                          name="notes"
                          value={form.notes}
                          onChange={handleChange}
                          rows={3}
                          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                          placeholder="Delivery landmark, preferred time or special instruction"
                        />
                      </div>
                    </div>
                  </section>
                </div>

                <aside>
                  <div className="sticky top-20 overflow-hidden rounded-2xl border border-border bg-surface" style={{ boxShadow: "var(--shadow-lg)" }}>
                    <div className="border-b border-border px-6 py-5">
                      <h2 className="font-bold text-text-primary">Payment summary</h2>
                      <p className="mt-1 text-xs text-text-muted">Choose a method and place the order.</p>
                    </div>

                    <div className="px-6 py-5">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">Pay with</p>
                      <div className="grid grid-cols-3 gap-2">
                        {PAYMENT_METHODS.map((method) => (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => setPaymentMethod(method.value)}
                            className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 py-3 text-xs font-bold transition ${
                              paymentMethod === method.value
                                ? "scale-[1.02] border-transparent text-white shadow-md"
                                : "border-border bg-surface text-text-secondary hover:border-secondary/35"
                            }`}
                            style={paymentMethod === method.value ? { backgroundColor: method.bg } : undefined}
                          >
                            <PaymentMethodIcon method={method.value} size={17} />
                            {method.short}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 border-y border-border px-6 py-5 text-sm">
                      <div className="flex justify-between text-text-secondary">
                        <span>Subtotal</span>
                        <span className="font-bold text-text-primary">NPR {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>Delivery</span>
                        <span className={`font-bold ${shipping === 0 ? "text-secondary" : "text-text-primary"}`}>
                          {shipping === 0 ? "Free" : `NPR ${shipping}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>VAT (13%)</span>
                        <span className="font-bold text-text-primary">NPR {vat.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-text-primary">
                        <span>Total</span>
                        <span>NPR {total.toLocaleString()}</span>
                      </div>
                      {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                        <p className="rounded-xl bg-amber-50 px-3 py-2 text-center text-xs font-semibold text-amber-800">
                          Add NPR {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free delivery.
                        </p>
                      )}
                    </div>

                    <div className="px-6 py-5">
                      <button
                        type="submit"
                        disabled={submitting || cart.items.length === 0}
                        className="flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span>{submitting ? "Placing order..." : "Place order"}</span>
                        <span
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold"
                          style={{ backgroundColor: selectedMethod.bg === "#0b1f1a" ? "#173a31" : selectedMethod.bg }}
                        >
                          <PaymentMethodIcon method={selectedMethod.value} size={13} />
                          {selectedMethod.short}
                        </span>
                      </button>

                      <div className="mt-4 space-y-2 text-xs text-text-muted">
                        <p className="flex items-center gap-2">
                          <IoLockClosed className="text-secondary" size={13} />
                          Secure and encrypted checkout
                        </p>
                        <p className="flex items-center gap-2">
                          <BsShieldCheck className="text-secondary" size={13} />
                          Seller-vetted products and return support
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
