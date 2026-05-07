"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";

interface Category { _id: string; name: string; slug: string; }
interface Product {
  _id: string; name: string; slug: string; price: number;
  discountPrice?: number; images: string[];
  ratings: { average: number; count: number }; stock: number;
}

const API = process.env.NEXT_PUBLIC_API_URL;
const SORT_OPTIONS = [
  { label: "Newest First", value: "-createdAt" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
  { label: "Most Popular", value: "-ratings.count" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "12", sort });
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    try {
      const res = await fetch(`${API}/api/products?${params}`);
      const data = await res.json();
      setProducts(data.data || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, category, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategory = (id: string) => { setCategory(id); setPage(1); };
  const handleSort = (v: string) => { setSort(v); setPage(1); };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">All Products</h1>
            {!loading && <p className="text-text-muted text-sm mt-1">{total} products found</p>}
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="border border-border rounded-lg px-4 py-2 text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 w-60"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-52 shrink-0">
            <div className="bg-surface rounded-xl border border-border p-4 mb-4">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Category</p>
              <button
                onClick={() => handleCategory("")}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg mb-1 transition-colors ${!category ? "bg-secondary text-white font-medium" : "text-text-primary hover:bg-surface-low"}`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => handleCategory(c._id)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg mb-1 transition-colors ${category === c._id ? "bg-secondary text-white font-medium" : "text-text-primary hover:bg-surface-low"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="bg-surface rounded-xl border border-border p-4">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Sort By</p>
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => handleSort(o.value)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg mb-1 transition-colors ${sort === o.value ? "bg-primary text-white font-medium" : "text-text-primary hover:bg-surface-low"}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile sort/filter */}
            <div className="flex gap-2 mb-4 md:hidden">
              <select
                value={category}
                onChange={(e) => handleCategory(e.target.value)}
                className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-surface text-text-primary"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
                className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-surface text-text-primary"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader size="lg" /></div>
            ) : products.length === 0 ? (
              <div className="bg-surface rounded-xl border border-border py-20 text-center text-text-muted">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium text-text-primary">No products found</p>
                <p className="text-sm mt-1">Try a different search or category</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-border text-sm text-text-primary hover:bg-surface-low disabled:opacity-40 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-text-secondary px-2">
                      Page {page} of {pages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={page === pages}
                      className="px-4 py-2 rounded-lg border border-border text-sm text-text-primary hover:bg-surface-low disabled:opacity-40 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
