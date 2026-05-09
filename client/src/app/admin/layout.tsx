"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import {
  HiOutlineArrowLeft,
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineShoppingBag,
  HiOutlineUsers,
} from "react-icons/hi";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: HiOutlineChartBar },
  { href: "/admin/products", label: "Products", icon: HiOutlineShoppingBag },
  { href: "/admin/orders", label: "Orders", icon: HiOutlineCube },
  { href: "/admin/users", label: "Users", icon: HiOutlineUsers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const activeItem = NAV.find((item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)));

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "admin") router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-primary text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/" className="text-lg font-bold tracking-tight text-white">
            Neplai
          </Link>
          <p className="mt-1 text-xs font-medium text-white/48">Commerce operations</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-secondary text-white" : "text-white/62 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/58 transition hover:bg-white/10 hover:text-white"
          >
            <HiOutlineArrowLeft size={17} />
            Back to store
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Admin</p>
              <h1 className="text-lg font-bold text-text-primary">{activeItem?.label ?? "Dashboard"}</h1>
            </div>
            <div className="flex items-center gap-3">
              <nav className="hidden items-center gap-1 rounded-full border border-border bg-background p-1 md:flex lg:hidden">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={item.label}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                        active ? "bg-primary text-white" : "text-text-secondary hover:bg-surface hover:text-text-primary"
                      }`}
                    >
                      <Icon size={17} />
                    </Link>
                  );
                })}
              </nav>
              <div className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {user.name[0].toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-text-primary">{user.name}</p>
                  <p className="text-[11px] text-text-muted">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
