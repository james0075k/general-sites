"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/Loader";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "🛍️" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/users", label: "Users", icon: "👥" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "admin") router.push("/");
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader size="lg" /></div>;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-56 bg-primary text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="text-white font-bold text-lg">Neplai</Link>
          <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? "bg-secondary text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors px-3 py-2">
            <span>←</span> Back to Store
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-text-primary">Admin Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {user.name[0].toUpperCase()}
            </div>
            <span>{user.name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
