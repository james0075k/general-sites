"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, loading: authLoading, refresh } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", street: "", city: "", state: "", postalCode: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (user) setForm({
      name: user.name || "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
    });
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await api.put("/api/users/profile", {
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, postalCode: form.postalCode },
      });
      await refresh();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return (
    <>
      <Navbar />
      <main className="flex-1"><Loader fullPage /></main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">My Profile</h1>

        <div className="bg-surface rounded-2xl border border-border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-text-primary">{user?.name}</p>
              <p className="text-text-muted text-sm">{user?.email}</p>
              <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
            </div>
          </div>

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">Profile updated successfully!</div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="+977 98XXXXXXXX"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40" />
            </div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest pt-2">Default Address</p>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Street</label>
              <input name="street" value={form.street} onChange={handleChange}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">City</label>
                <input name="city" value={form.city} onChange={handleChange}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">State</label>
                <input name="state" value={form.state} onChange={handleChange}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Postal Code</label>
                <input name="postalCode" value={form.postalCode} onChange={handleChange}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40" />
              </div>
            </div>
            <button
              type="submit" disabled={saving}
              className="w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-secondary/90 disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
