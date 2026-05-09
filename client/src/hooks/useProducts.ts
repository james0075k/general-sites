"use client";

import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  ratings: { average: number; count: number };
  stock: number;
  category?: { _id: string; name: string; slug: string };
  tags?: string[];
}

interface UseProductsOptions {
  category?: string;
  search?: string;
  sort?: string;
  limit?: number;
  featured?: boolean;
  page?: number;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  pages: number;
  refetch: () => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { category = "", search = "", sort = "-createdAt", limit = 12, featured, page = 1 } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!API) return;
    const params = new URLSearchParams({ page: String(page), limit: String(limit), sort });
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (featured) params.set("featured", "true");

    setLoading(true);
    setError(null);

    fetch(`${API}/api/products?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch products");
        return r.json();
      })
      .then((data) => {
        setProducts(data.data || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, search, sort, limit, featured, page, tick]);

  return { products, loading, error, total, pages, refetch };
}
