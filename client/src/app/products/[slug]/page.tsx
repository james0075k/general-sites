"use client";

import { useState, useEffect, use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { BsBoxSeam, BsQuestionCircle } from "react-icons/bs";
import { IoStar } from "react-icons/io5";
import { HiMinus, HiPlus } from "react-icons/hi";

interface Product {
  _id: string; name: string; slug: string; description: string;
  price: number; discountPrice?: number; images: string[];
  ratings: { average: number; count: number }; stock: number;
  category?: { name: string; slug: string }; tags?: string[];
}

const API = process.env.NEXT_PUBLIC_API_URL;

interface Props { params: Promise<{ slug: string }>; }

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API}/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.data || null))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) { router.push("/login"); return; }
    setAdding(true);
    try { await addToCart(product!._id, qty); } finally { setAdding(false); }
  };

  if (loading) return (
    <>
      <Navbar />
      <main className="flex-1"><Loader fullPage size="lg" /></main>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-4 text-text-muted">
          <BsQuestionCircle size={64} />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Product not found</h1>
        <Link href="/products" className="text-secondary hover:underline text-sm">Back to Products</Link>
      </main>
      <Footer />
    </>
  );

  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const discount = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-muted mb-6 flex items-center gap-1">
          <Link href="/" className="hover:text-secondary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-secondary">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-secondary capitalize">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-text-primary line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-surface-low rounded-2xl overflow-hidden border border-border mb-3">
              {product.images[imgIdx] ? (
                <Image src={product.images[imgIdx]} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                  <BsBoxSeam size={64} />
                </div>
              )}
              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-tertiary text-white text-sm font-bold px-2.5 py-1 rounded-lg">
                  -{discount}%
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`relative h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? "border-secondary" : "border-border"}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <span className="text-xs font-semibold text-secondary uppercase tracking-widest">{product.category.name}</span>
            )}
            <h1 className="text-2xl font-bold text-text-primary mt-1 mb-3">{product.name}</h1>

            {product.ratings.count > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400 text-sm gap-0.5">
                  {Array.from({ length: Math.round(product.ratings.average) }).map((_, i) => (
                    <IoStar key={i} />
                  ))}
                </div>
                <span className="text-sm text-text-secondary">{product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-secondary">NPR {displayPrice.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-lg text-text-muted line-through">NPR {product.price.toLocaleString()}</span>
              )}
            </div>

            <div className="bg-surface-low rounded-lg px-4 py-3 mb-6">
              <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>
            </div>

            <div className="mb-2 text-sm font-medium text-text-secondary">
              Status:{" "}
              <span className={product.stock > 0 ? "text-secondary font-semibold" : "text-red-500 font-semibold"}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-text-secondary">Qty:</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-text-primary hover:bg-surface-low transition-colors flex items-center"
                  >
                    <HiMinus size={16} />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-text-primary border-x border-border">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 text-text-primary hover:bg-surface-low transition-colors flex items-center"
                  >
                    <HiPlus size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                className="flex-1 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {adding ? "Adding to Cart..." : "Add to Cart"}
              </button>
              <Link
                href="/cart"
                className="px-5 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors text-center"
              >
                View Cart
              </Link>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-surface-low text-text-secondary px-3 py-1 rounded-full border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
