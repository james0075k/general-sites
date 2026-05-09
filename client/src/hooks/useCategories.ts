"use client";

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!API) { setLoading(false); return; }

    fetch(`${API}/api/categories`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch categories");
        return r.json();
      })
      .then((data) => setCategories(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}
