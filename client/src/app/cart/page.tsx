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
import { BsCart3, BsBoxSeam } from "react-icons/bs";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoLockClosed } from "react-icons/io5";

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

  if (authLoading) return (
    <>
      <Navbar />
      <main className="flex-1"><Loader fullPage /></main>
      <Footer />
    </>
  );

  const VAT_RATE = 0.13;
  const subtotal = cart.totalPrice;
  const shipping = subtotal >= 5000 ? 0 : subtotal === 0 ? 0 : 100;
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = subtotal + shipping + vat;

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border py-20 text-center">
            <div className="flex justify-center mb-4 text-text-muted">
              <BsCart3 size={52} />
            </div>
            <p className="text-lg font-semibold text-text-primary mb-1">Your cart is empty</p>
            <p className="text-text-muted text-sm mb-6">Add some products to get started</p>
            <Link
              href="/products"
              className="inline-block bg-secondary text-white font-semibold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-surface rounded-xl border border-border p-4 flex gap-4"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-surface-low border border-border">
                    {item.product.images?.[0] ? (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                        <BsBoxSeam size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.slug}`} className="font-medium text-text-primary hover:text-secondary transition-colors line-clamp-1">
                      {item.product.name}
                    </Link>
                    <p className="text-secondary font-semibold mt-1">NPR {item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateItem(item.product._id, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-text-primary hover:bg-surface-low transition-colors flex items-center"
                        >
                          <HiMinus size={14} />
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold border-x border-border">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2.5 py-1.5 text-text-primary hover:bg-surface-low disabled:opacity-40 transition-colors flex items-center"
                        >
                          <HiPlus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >Remove</button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-text-primary">
                      NPR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div
                className="bg-surface rounded-xl border border-border p-6 sticky top-20"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <h2 className="font-bold text-text-primary mb-4 text-lg">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-medium text-text-primary">NPR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-secondary font-medium" : "font-medium text-text-primary"}>
                      {shipping === 0 ? "FREE" : `NPR ${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>VAT (13%)</span>
                    <span className="font-medium text-text-primary">NPR {vat.toLocaleString()}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-bold text-text-primary text-base">
                    <span>Total</span>
                    <span>NPR {total.toLocaleString()}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="mt-6 block w-full bg-secondary text-white text-center font-semibold py-3 rounded-xl hover:bg-secondary/90 transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <p className="text-xs text-text-muted text-center mt-3 flex items-center justify-center gap-1">
                  <IoLockClosed size={12} />
                  <span>Secure checkout — your data is protected</span>
                </p>
                {subtotal < 5000 && subtotal > 0 && (
                  <p className="text-xs text-center mt-2 text-tertiary">
                    Add NPR {(5000 - subtotal).toLocaleString()} more for free shipping!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
