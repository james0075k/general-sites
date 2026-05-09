"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { BsBoxSeam, BsCart3, BsEye } from "react-icons/bs";
import RatingStars from "./RatingStars";
import StockBadge from "./StockBadge";
import PriceBlock from "./PriceBlock";
import AdminProductActions from "./AdminProductActions";
import type { Product } from "@/data/products";

interface Props {
  product: Product;
  showAdmin?: boolean;
  onDelete?: (id: string) => void;
  onStockUpdate?: (id: string, stock: number) => void;
}

const categoryBackdrops: Record<string, string> = {
  Electronics: "linear-gradient(135deg, #dbeafe 0%, #f8fafc 48%, #ccfbf1 100%)",
  Fashion: "linear-gradient(135deg, #fdf2f8 0%, #fff7ed 50%, #fef3c7 100%)",
  Groceries: "linear-gradient(135deg, #ecfdf5 0%, #f7fee7 52%, #fef9c3 100%)",
  Beauty: "linear-gradient(135deg, #fae8ff 0%, #fff1f2 52%, #fef3c7 100%)",
  "Home & Kitchen": "linear-gradient(135deg, #fef3c7 0%, #f8fafc 50%, #dcfce7 100%)",
  Sports: "linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 52%, #fef9c3 100%)",
};

export default function ProductCard({ product, showAdmin = false, onDelete, onStockUpdate }: Props) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    if (product.stock === 0) return;
    setAdding(true);
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }, 500);
  };

  const btnLabel = adding
    ? "Adding..."
    : added
      ? "Added"
      : product.stock === 0
        ? "Out of Stock"
        : "Add to Cart";

  return (
    <motion.div
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface"
      style={{ boxShadow: "var(--shadow-card)" }}
      whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(15,23,42,0.12)" }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group relative block aspect-[4/3] overflow-hidden bg-surface-low"
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col justify-between p-4"
            style={{
              background:
                categoryBackdrops[product.category] ??
                "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-text-secondary">
                {product.category}
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 text-secondary shadow-sm">
                <BsBoxSeam size={18} />
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted">
                {product.brand}
              </p>
              <p className="mt-1 line-clamp-2 text-lg font-bold leading-tight text-text-primary">
                {product.subCategory}
              </p>
            </div>
          </div>
        )}

        {product.discountPercentage > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-tertiary px-2 py-0.5 text-xs font-bold text-white">
            -{product.discountPercentage}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="absolute right-2 top-2 z-10 rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-white">
            NEW
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-bold uppercase tracking-wide text-secondary">
            {product.brand}
          </span>
          <span className="truncate text-[10px] text-text-muted">{product.subCategory}</span>
        </div>

        <Link href={`/products/${product.slug}`}>
          <p className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-text-primary transition-colors hover:text-secondary">
            {product.name}
          </p>
        </Link>

        <RatingStars rating={product.rating} numReviews={product.numReviews} size={12} />

        <div className="mb-2 mt-2">
          <PriceBlock
            price={product.price}
            oldPrice={product.oldPrice}
            discountPercentage={product.discountPercentage}
            size="sm"
          />
        </div>

        <div className="mb-3">
          <StockBadge stock={product.stock} />
        </div>

        <div className="mt-auto flex gap-2">
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors ${
              added
                ? "bg-emerald-500 text-white"
                : product.stock === 0
                  ? "cursor-not-allowed bg-surface-low text-text-muted"
                  : "cursor-pointer bg-secondary text-white hover:bg-secondary/90"
            }`}
          >
            <BsCart3 size={13} />
            {btnLabel}
          </motion.button>
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center justify-center rounded-xl border border-border px-2.5 py-2 text-text-secondary transition-colors hover:border-secondary/50 hover:text-secondary"
            title="View details"
          >
            <BsEye size={14} />
          </Link>
        </div>

        {showAdmin && (
          <AdminProductActions
            productId={product._id}
            productName={product.name}
            currentStock={product.stock}
            onDelete={onDelete ?? (() => {})}
            onStockUpdate={onStockUpdate ?? (() => {})}
          />
        )}
      </div>
    </motion.div>
  );
}
