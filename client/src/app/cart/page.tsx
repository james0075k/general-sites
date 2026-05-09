"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { BsArrowRight, BsBoxSeam, BsCart3, BsShieldCheck } from "react-icons/bs";
import { HiMinus, HiOutlineRefresh, HiOutlineTruck, HiPlus } from "react-icons/hi";
import { IoLockClosed } from "react-icons/io5";
import { motion, AnimatePresence } from "motion/react";

const VAT_RATE = 0.13;
const FREE_SHIPPING_THRESHOLD = 5000;

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, fetchCart, updateItem, removeItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/login");
      else fetchCart();
    }
  }, [user, authLoading, fetchCart, router]);

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
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = subtotal + shipping + vat;
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border bg-primary text-white">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">Secure cart</p>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Review your cart</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/68">
                  Confirm quantities, delivery value and payment-ready totals before checkout.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3">
                  <p className="text-xl font-bold">{itemCount}</p>
                  <p className="text-[11px] text-white/58">items</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3">
                  <p className="text-xl font-bold">{shipping === 0 && subtotal > 0 ? "Free" : "NPR 100"}</p>
                  <p className="text-[11px] text-white/58">delivery</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3">
                  <p className="text-xl font-bold">7d</p>
                  <p className="text-[11px] text-white/58">returns</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          <AnimatePresence mode="wait">
            {cart.items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-border bg-surface px-6 py-20 text-center"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-low text-text-muted">
                  <BsCart3 size={34} />
                </div>
                <p className="text-xl font-bold text-text-primary">Your cart is empty</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
                  Start with curated Nepali products, then return here to review your order.
                </p>
                <Link
                  href="/products"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-white transition hover:bg-secondary/90"
                >
                  Browse products
                  <BsArrowRight size={16} />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="cart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-6 lg:grid-cols-[1fr_380px]"
              >
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-surface p-4" style={{ boxShadow: "var(--shadow-card)" }}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-bold text-text-primary">Delivery progress</p>
                        <p className="text-sm text-text-muted">
                          {freeShippingRemaining === 0
                            ? "Your cart qualifies for free delivery."
                            : `Add NPR ${freeShippingRemaining.toLocaleString()} more for free delivery.`}
                        </p>
                      </div>
                      <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-text-primary transition hover:bg-surface-low"
                      >
                        Continue shopping
                      </Link>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-low">
                      <div
                        className="h-full rounded-full bg-secondary transition-all"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {cart.items.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0, padding: 0, overflow: "hidden" }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-2xl border border-border bg-surface p-4"
                        style={{ boxShadow: "var(--shadow-card)" }}
                      >
                        <div className="flex gap-4">
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-low">
                            {item.product.images?.[0] ? (
                              <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                                <BsBoxSeam size={28} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="line-clamp-2 font-bold leading-snug text-text-primary transition hover:text-secondary"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-1 text-sm font-bold text-secondary">NPR {item.price.toLocaleString()}</p>
                            <p className="mt-1 text-xs text-text-muted">{item.product.stock} units available</p>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              <div className="flex items-center overflow-hidden rounded-xl border border-border">
                                <motion.button
                                  type="button"
                                  whileTap={{ scale: 0.88 }}
                                  onClick={() => updateItem(item.product._id, item.quantity - 1)}
                                  className="flex cursor-pointer items-center px-3 py-2 text-text-primary transition hover:bg-surface-low"
                                  aria-label="Decrease quantity"
                                >
                                  <HiMinus size={14} />
                                </motion.button>
                                <span className="border-x border-border px-4 py-2 text-sm font-bold">{item.quantity}</span>
                                <motion.button
                                  type="button"
                                  whileTap={{ scale: 0.88 }}
                                  onClick={() => updateItem(item.product._id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product.stock}
                                  className="flex cursor-pointer items-center px-3 py-2 text-text-primary transition hover:bg-surface-low disabled:cursor-not-allowed disabled:opacity-40"
                                  aria-label="Increase quantity"
                                >
                                  <HiPlus size={14} />
                                </motion.button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.product._id)}
                                className="cursor-pointer text-sm font-semibold text-red-600 transition hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Line total</p>
                            <p className="mt-1 font-bold text-text-primary">
                              NPR {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <aside>
                  <div className="sticky top-20 rounded-2xl border border-border bg-surface p-6" style={{ boxShadow: "var(--shadow-lg)" }}>
                    <h2 className="text-lg font-bold text-text-primary">Order summary</h2>
                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex justify-between text-text-secondary">
                        <span>Subtotal ({itemCount} items)</span>
                        <span className="font-bold text-text-primary">NPR {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>Delivery</span>
                        <span className={shipping === 0 ? "font-bold text-secondary" : "font-bold text-text-primary"}>
                          {shipping === 0 ? "Free" : `NPR ${shipping}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>VAT (13%)</span>
                        <span className="font-bold text-text-primary">NPR {vat.toLocaleString()}</span>
                      </div>
                      <hr className="border-border" />
                      <div className="flex justify-between text-base font-bold text-text-primary">
                        <span>Total</span>
                        <span>NPR {total.toLocaleString()}</span>
                      </div>
                    </div>

                    <Link
                      href="/checkout"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-bold text-white transition hover:bg-secondary/90"
                    >
                      Proceed to checkout
                      <BsArrowRight size={16} />
                    </Link>

                    <div className="mt-5 space-y-3 rounded-2xl bg-surface-low p-4 text-sm text-text-secondary">
                      <p className="flex items-center gap-2">
                        <IoLockClosed className="text-secondary" size={15} />
                        Secure checkout with protected customer data
                      </p>
                      <p className="flex items-center gap-2">
                        <HiOutlineTruck className="text-secondary" size={16} />
                        Free delivery from NPR {FREE_SHIPPING_THRESHOLD.toLocaleString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <HiOutlineRefresh className="text-secondary" size={16} />
                        7-day return support on eligible products
                      </p>
                      <p className="flex items-center gap-2">
                        <BsShieldCheck className="text-secondary" size={15} />
                        Seller-vetted marketplace catalog
                      </p>
                    </div>
                  </div>
                </aside>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      <Footer />
    </>
  );
}
