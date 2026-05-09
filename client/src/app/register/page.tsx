"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-md"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary">Neplai</Link>
          <p className="text-text-muted text-sm mt-1">Nepal&apos;s Modern Marketplace</p>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-surface rounded-2xl border border-border p-8"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <h1 className="text-2xl font-bold text-text-primary mb-1">Create account</h1>
          <p className="text-text-muted text-sm mb-6">Join Neplai and start shopping</p>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={item}>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange} required
                placeholder="Ram Sharma"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </motion.div>
            <motion.div variants={item}>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </motion.div>
            <motion.div variants={item}>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange} required
                placeholder="Min. 6 characters" minLength={6}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </motion.div>
            <motion.div variants={item}>
              <motion.button
                type="submit" disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-secondary/90 disabled:opacity-60 transition-colors mt-2"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </motion.button>
            </motion.div>
          </form>

          <motion.p variants={item} className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-secondary font-medium hover:underline">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
