"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, fetchCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold text-white tracking-tight shrink-0">
          Neplai
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          {user && (
            <Link href="/orders" className="hover:text-white transition-colors">My Orders</Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border py-1 z-50">
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-text-primary hover:bg-surface-low transition-colors">Profile</Link>
                  <Link href="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-text-primary hover:bg-surface-low transition-colors">My Orders</Link>
                  {user.role === "admin" && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-text-primary hover:bg-surface-low transition-colors">Admin Panel</Link>
                  )}
                  <hr className="my-1 border-border" />
                  <button
                    onClick={async () => { setMenuOpen(false); await logout(); }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-primary bg-secondary rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
