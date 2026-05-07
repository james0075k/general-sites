"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  ratings: { average: number; count: number };
  stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    setAdding(true);
    try { await addToCart(product._id); } finally { setAdding(false); }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div
        className="bg-surface rounded-xl overflow-hidden border border-border hover:border-secondary/40 transition-all duration-200"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="relative aspect-square bg-surface-low">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-muted text-4xl">
              📦
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-tertiary text-white text-xs font-bold px-2 py-1 rounded-md">
              SALE
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-gray-800/70 text-white text-xs px-2 py-1 rounded-md">
              Out of stock
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="font-medium text-text-primary line-clamp-2 leading-snug text-sm">{product.name}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-secondary font-bold text-base">NPR {displayPrice.toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-text-muted line-through text-xs">
                NPR {product.price.toLocaleString()}
              </span>
            )}
          </div>
          {product.ratings.count > 0 && (
            <div className="mt-1 flex items-center gap-1 text-xs text-text-muted">
              <span className="text-yellow-400">★</span>
              <span>{product.ratings.average.toFixed(1)}</span>
              <span>({product.ratings.count})</span>
            </div>
          )}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="mt-3 w-full py-2 text-sm font-semibold rounded-lg bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {adding ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
