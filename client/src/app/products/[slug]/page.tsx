"use client";

import { use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BsBoxSeam, BsQuestionCircle, BsCart3, BsTag } from "react-icons/bs";
import { HiMinus, HiPlus, HiChevronDown } from "react-icons/hi";
import RatingStars from "@/components/RatingStars";
import StockBadge from "@/components/StockBadge";
import PriceBlock from "@/components/PriceBlock";
import { getProductBySlug } from "@/data/products";

// GET /api/products/:slug — replace getProductBySlug with API call when backend ready

const ease = [0.22, 1, 0.36, 1] as const;

interface Props { params: Promise<{ slug: string }>; }

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [showSpecs, setShowSpecs] = useState(true);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    setAdding(true);
    // POST /api/cart
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 600);
  };

  if (!product) return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center"
      >
        <BsQuestionCircle size={64} className="text-text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">Product not found</h1>
        <Link href="/products" className="text-secondary hover:underline text-sm">
          ← Back to Products
        </Link>
      </motion.main>
      <Footer />
    </>
  );

  const hasImages = product.images.length > 0 || product.thumbnail;
  const displayImages = hasImages ? product.images : [];
  const specsEntries = Object.entries(product.specifications);

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          className="text-xs text-text-muted mb-6 flex items-center gap-1 flex-wrap"
        >
          <Link href="/" className="hover:text-secondary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-secondary">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-secondary">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-text-primary line-clamp-1">{product.name}</span>
        </motion.nav>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="relative aspect-square bg-surface-low rounded-2xl overflow-hidden border border-border mb-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={imgIdx}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease }}
                  className="absolute inset-0"
                >
                  {displayImages[imgIdx] ? (
                    <Image src={displayImages[imgIdx]} alt={product.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                      <BsBoxSeam size={64} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-tertiary text-white text-sm font-bold px-2.5 py-1 rounded-lg z-10">
                  -{product.discountPercentage}%
                </span>
              )}
              {product.isNewArrival && (
                <span className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                  NEW
                </span>
              )}
            </div>
            {displayImages.length > 1 && (
              <div className="flex gap-2">
                {displayImages.map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative h-16 w-16 rounded-xl overflow-hidden border-2 transition-colors ${i === imgIdx ? "border-secondary" : "border-border"}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.08 }}
            className="flex flex-col"
          >
            {/* Brand + category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                {product.brand}
              </span>
              <span className="text-xs text-text-muted">·</span>
              <Link
                href={`/products?category=${product.category}`}
                className="text-xs text-text-muted hover:text-secondary transition-colors"
              >
                {product.category}
              </Link>
              <span className="text-xs text-text-muted">›</span>
              <span className="text-xs text-text-muted">{product.subCategory}</span>
            </div>

            <h1 className="text-2xl font-bold text-text-primary mb-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="mb-4">
              <RatingStars rating={product.rating} numReviews={product.numReviews} size={16} />
            </div>

            {/* Price */}
            <div className="mb-4">
              <PriceBlock
                price={product.price}
                oldPrice={product.oldPrice}
                discountPercentage={product.discountPercentage}
                size="lg"
              />
            </div>

            {/* Stock */}
            <div className="mb-4">
              <StockBadge stock={product.stock} showQty />
            </div>

            {/* Description */}
            <div className="bg-surface-low rounded-xl px-4 py-3 mb-5">
              <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-medium text-text-secondary">Qty:</span>
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-text-primary hover:bg-surface-low transition-colors"
                  >
                    <HiMinus size={16} />
                  </motion.button>
                  <span className="px-5 py-2 text-sm font-bold text-text-primary border-x border-border">
                    {qty}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 text-text-primary hover:bg-surface-low transition-colors"
                  >
                    <HiPlus size={16} />
                  </motion.button>
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3 mb-5">
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold rounded-2xl transition-colors
                  ${added ? "bg-emerald-500 text-white" : product.stock === 0 ? "bg-surface-low text-text-muted cursor-not-allowed" : "bg-secondary text-white hover:bg-secondary/90"}`}
              >
                <BsCart3 size={18} />
                {adding ? "Adding..." : added ? "Added to Cart ✓" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </motion.button>
              <Link
                href="/cart"
                className="px-5 py-3 border-2 border-primary text-primary font-semibold rounded-2xl hover:bg-primary hover:text-white transition-colors text-center text-sm"
              >
                View Cart
              </Link>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <BsTag size={14} className="text-text-muted mt-0.5" />
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-surface-low text-text-secondary px-3 py-1 rounded-full border border-border capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Specifications accordion */}
        {specsEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease }}
            className="bg-surface rounded-2xl border border-border overflow-hidden mb-8"
          >
            <button
              onClick={() => setShowSpecs((s) => !s)}
              className="w-full flex items-center justify-between px-6 py-4 font-bold text-text-primary hover:bg-surface-low transition-colors"
            >
              <span>Specifications</span>
              <motion.span animate={{ rotate: showSpecs ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <HiChevronDown size={20} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {showSpecs && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5">
                    <table className="w-full text-sm">
                      <tbody>
                        {specsEntries.map(([key, val], i) => (
                          <tr key={key} className={i % 2 === 0 ? "bg-surface-low" : "bg-surface"}>
                            <td className="py-2 px-3 font-medium text-text-primary rounded-l-lg w-40">{key}</td>
                            <td className="py-2 px-3 text-text-secondary rounded-r-lg">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
}
