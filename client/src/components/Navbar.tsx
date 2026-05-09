"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import {
  HiOutlineShoppingCart,
  HiChevronDown,
  HiMenu,
  HiX,
  HiOutlineSearch,
  HiOutlineUser,
} from "react-icons/hi";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, fetchCart } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // close user menu on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // focus search input when opened
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchVal.trim())}`;
      setSearchOpen(false);
      setSearchVal("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary shadow-md">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white tracking-tight shrink-0">
            Neplai
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
            {user && (
              <Link href="/orders" className="hover:text-white transition-colors">My Orders</Link>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              aria-label="Search"
            >
              <HiOutlineSearch className="h-5 w-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              aria-label="Cart"
            >
              <HiOutlineShoppingCart className="h-6 w-6" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User menu (desktop) */}
            {user ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 text-sm text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
                  <motion.span animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <HiChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border py-1 z-50 origin-top-right"
                    >
                      <div className="px-4 py-2 border-b border-border mb-1">
                        <p className="text-xs font-semibold text-text-primary truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-surface-low transition-colors">
                        <HiOutlineUser className="h-4 w-4" /> Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-text-primary hover:bg-surface-low transition-colors">My Orders</Link>
                      {user.role === "admin" && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-text-primary hover:bg-surface-low transition-colors">Admin Panel</Link>
                      )}
                      <hr className="my-1 border-border" />
                      <button
                        onClick={async () => { setUserMenuOpen(false); await logout(); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-block px-4 py-2 text-sm font-semibold text-primary bg-secondary rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Hamburger (mobile only) */}
            <motion.button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <HiX className="h-6 w-6" />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <HiMenu className="h-6 w-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>

        {/* Search bar slide */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-white/10"
            >
              <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 py-3 flex gap-2">
                <input
                  ref={searchRef}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search products, categories..."
                  className="flex-1 px-4 py-2 bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-lg text-sm focus:outline-none focus:bg-white/15 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-2 text-white/60 hover:text-white transition-colors"
                >
                  <HiX className="h-5 w-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 h-full w-72 z-50 bg-primary shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
                <span className="text-lg font-bold text-white">Neplai</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <HiX className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {user && (
                  <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-white/50 truncate">{user.email}</p>
                    </div>
                  </div>
                )}

                {NAV_LINKS.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={l.href}
                      className="block px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}

                {user && (
                  <>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                      <Link href="/orders" className="block px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        My Orders
                      </Link>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                      <Link href="/profile" className="block px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        Profile
                      </Link>
                    </motion.div>
                    {user.role === "admin" && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                        <Link href="/admin" className="block px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          Admin Panel
                        </Link>
                      </motion.div>
                    )}
                  </>
                )}

                <div className="pt-4 border-t border-white/10 mt-4">
                  <Link href="/cart" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <HiOutlineShoppingCart className="h-5 w-5" />
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </nav>

              {/* Bottom action */}
              <div className="px-4 pb-6 shrink-0 border-t border-white/10 pt-4">
                {user ? (
                  <button
                    onClick={async () => { setMobileOpen(false); await logout(); }}
                    className="w-full py-2.5 text-sm font-semibold text-red-400 border border-red-400/30 rounded-xl hover:bg-red-400/10 transition-colors"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full py-2.5 text-center text-sm font-semibold text-primary bg-secondary rounded-xl hover:bg-secondary/90 transition-colors"
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
