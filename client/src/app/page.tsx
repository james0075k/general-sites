import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?featured=true&limit=8`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

const CATEGORY_ICONS: Record<string, string> = {
  handicrafts: "🏺",
  electronics: "💻",
  fashion: "👗",
  "home-living": "🏠",
  food: "🍵",
  sports: "⚽",
};

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative py-24 px-4 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-secondary/20 text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
              Seasonal Festival Sale — Up to 40% Off
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
              Nepal&apos;s Modern<br />Marketplace
            </h1>
            <p className="text-white/60 text-lg mb-8">
              Authentic local handicrafts, electronics, fashion and more — delivered across Nepal.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="inline-block bg-secondary text-white font-semibold px-8 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/products?category=handicrafts"
                className="inline-block bg-white/10 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                Local Handicrafts
              </Link>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[
              { icon: "🚚", title: "Fast Delivery", desc: "Across all major cities in Nepal" },
              { icon: "🔒", title: "Secure Payments", desc: "Khalti, eSewa, COD supported" },
              { icon: "↩️", title: "Easy Returns", desc: "Hassle-free 7-day return policy" },
            ].map((f) => (
              <div key={f.title} className="flex items-center justify-center gap-3 py-2">
                <span className="text-2xl">{f.icon}</span>
                <div className="text-left">
                  <p className="font-semibold text-text-primary text-sm">{f.title}</p>
                  <p className="text-text-muted text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Shop by Category</h2>
              <Link href="/products" className="text-sm text-secondary font-medium hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {categories.map((cat: { _id: string; name: string; slug: string }) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat._id}`}
                  className="bg-surface rounded-xl border border-border p-4 text-center hover:border-secondary/50 hover:shadow-md transition-all group"
                >
                  <div className="text-3xl mb-2">
                    {CATEGORY_ICONS[cat.slug] || "🛍️"}
                  </div>
                  <p className="text-sm font-medium text-text-primary group-hover:text-secondary transition-colors">
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Featured Products</h2>
            <Link href="/products" className="text-sm text-secondary font-medium hover:underline">
              View all →
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((p: Parameters<typeof ProductCard>[0]["product"]) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-surface rounded-xl border border-border py-16 text-center text-text-muted">
              <p className="text-4xl mb-3">🛍️</p>
              <p className="font-medium">Products coming soon</p>
              <p className="text-sm mt-1">Check back later for new arrivals</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
