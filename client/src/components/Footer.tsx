import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-primary text-white/60 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-white font-bold text-lg mb-3">Neplai</p>
          <p className="leading-relaxed text-white/50">Nepal&apos;s modern online marketplace. Global Quality, Local Heart.</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Shop</p>
          <ul className="space-y-2">
            <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Account</p>
          <ul className="space-y-2">
            <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
            <li><Link href="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Payments</p>
          <ul className="space-y-2">
            <li>Cash on Delivery</li>
            <li>Khalti</li>
            <li>eSewa</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/30">
        &copy; {new Date().getFullYear()} Neplai. All rights reserved.
      </div>
    </footer>
  );
}
