"use client";

import { useState, useEffect, useCallback } from "react";
import Loader from "@/components/Loader";
import { api } from "@/lib/api";

interface Category { _id: string; name: string; slug: string; }
interface Product {
  _id: string; name: string; price: number; discountPrice?: number;
  stock: number; isFeatured: boolean; isActive: boolean;
  category?: { name: string }; images: string[];
}

const API = process.env.NEXT_PUBLIC_API_URL;
const EMPTY_FORM = { name: "", slug: "", description: "", price: "", discountPrice: "", stock: "", sku: "", category: "", isFeatured: false, images: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [productsRes, catsRes] = await Promise.allSettled([
      fetch(`${API}/api/products?limit=50`).then((r) => r.json()),
      fetch(`${API}/api/categories`).then((r) => r.json()),
    ]);
    if (productsRes.status === "fulfilled") setProducts(productsRes.value.data || []);
    if (catsRes.status === "fulfilled") setCategories(catsRes.value.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setError(""); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditing(p._id);
    setForm({
      name: p.name, slug: "", description: "",
      price: String(p.price), discountPrice: String(p.discountPrice || ""),
      stock: String(p.stock), sku: "", category: p.category ? "" : "",
      isFeatured: p.isFeatured, images: p.images.join(", "),
    });
    setError(""); setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description: form.description,
        price: +form.price,
        discountPrice: form.discountPrice ? +form.discountPrice : undefined,
        stock: +form.stock,
        sku: form.sku || undefined,
        category: form.category,
        isFeatured: form.isFeatured,
        images: form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };
      if (editing) {
        await api.put(`/api/products/${editing}`, payload);
      } else {
        await api.post("/api/products", payload);
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Archive this product?")) return;
    try { await api.delete(`/api/products/${id}`); fetchAll(); }
    catch (err) { alert(err instanceof Error ? err.message : "Failed"); }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Products</h2>
          <p className="text-text-muted text-sm mt-1">{products.length} total</p>
        </div>
        <button onClick={openAdd} className="bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors">
          + Add Product
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        {products.length === 0 ? (
          <div className="py-16 text-center text-text-muted">
            <p className="text-4xl mb-2">🛍️</p>
            <p>No products yet. Add your first product!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-low text-text-muted text-left">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Featured</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-low transition-colors">
                    <td className="px-5 py-3 font-medium text-text-primary max-w-xs">
                      <span className="line-clamp-1">{p.name}</span>
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{p.category?.name || "—"}</td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-secondary">NPR {p.price.toLocaleString()}</span>
                      {p.discountPrice && (
                        <span className="ml-1 text-xs text-text-muted line-through">NPR {p.discountPrice.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={p.stock === 0 ? "text-red-500 font-medium" : "text-text-primary"}>{p.stock}</span>
                    </td>
                    <td className="px-5 py-3">
                      {p.isFeatured ? <span className="text-secondary">★ Yes</span> : <span className="text-text-muted">No</span>}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="text-xs px-3 py-1.5 border border-border rounded-lg hover:bg-surface-low transition-colors text-text-primary">Edit</button>
                        <button onClick={() => handleDelete(p._id)} className="text-xs px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-text-primary text-lg">{editing ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary text-xl">×</button>
            </div>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "name", label: "Product Name *", placeholder: "e.g. Hand-Woven Shawl", required: true },
                { name: "slug", label: "Slug (auto-generated if empty)", placeholder: "hand-woven-shawl" },
                { name: "price", label: "Price (NPR) *", placeholder: "4500", type: "number", required: true },
                { name: "discountPrice", label: "Discount Price (NPR)", placeholder: "3500", type: "number" },
                { name: "stock", label: "Stock *", placeholder: "100", type: "number", required: true },
                { name: "sku", label: "SKU", placeholder: "SKU-001" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-text-secondary mb-1">{field.label}</label>
                  <input
                    name={field.name} value={(form as Record<string, string | boolean>)[field.name] as string}
                    onChange={handleChange} required={field.required} placeholder={field.placeholder}
                    type={field.type || "text"}
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Image URLs (comma-separated)</label>
                <input name="images" value={form.images} onChange={handleChange} placeholder="https://..., https://..."
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-secondary w-4 h-4" />
                <span className="text-sm font-medium text-text-secondary">Featured product</span>
              </label>
              <button type="submit" disabled={saving}
                className="w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-secondary/90 disabled:opacity-60 transition-colors">
                {saving ? "Saving..." : editing ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
