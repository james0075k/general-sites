"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";
import SectionTitle from "@/components/SectionTitle";
import { PRODUCTS, getCategories, type Product } from "@/data/products";
import { motion, AnimatePresence } from "motion/react";
import { HiOutlineFilter, HiOutlineShieldCheck, HiOutlineTruck, HiX } from "react-icons/hi";
import { BsArrowDownUp, BsGem, BsGrid3X3Gap, BsSearch } from "react-icons/bs";

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Price: Low to high", value: "price_asc" },
  { label: "Price: High to low", value: "price_desc" },
  { label: "Highest rated", value: "rating_desc" },
];

const STOCK_OPTIONS = [
  { label: "All stock", value: "all" },
  { label: "In stock", value: "instock" },
  { label: "Low stock", value: "lowstock" },
  { label: "Out of stock", value: "outofstock" },
];

const QUICK_SEARCHES = ["pashmina", "chiya", "copper", "trekking", "herbal"];

function applyFilters(
  products: Product[],
  filters: {
    search: string;
    category: string;
    subCategory: string;
    sort: string;
    stockFilter: string;
  }
): Product[] {
  let result = products.filter((product) => product.isActive);

  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subCategory.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (filters.category) result = result.filter((product) => product.category === filters.category);
  if (filters.subCategory) {
    result = result.filter((product) => product.subCategory === filters.subCategory);
  }

  if (filters.stockFilter === "instock") result = result.filter((product) => product.stock > 10);
  else if (filters.stockFilter === "lowstock") {
    result = result.filter((product) => product.stock > 0 && product.stock <= 10);
  } else if (filters.stockFilter === "outofstock") {
    result = result.filter((product) => product.stock === 0);
  }

  if (filters.sort === "price_asc") return [...result].sort((a, b) => a.price - b.price);
  if (filters.sort === "price_desc") return [...result].sort((a, b) => b.price - a.price);
  if (filters.sort === "rating_desc") return [...result].sort((a, b) => b.rating - a.rating);
  return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

interface FilterPanelProps {
  categories: string[];
  subCategories: string[];
  category: string;
  subCategory: string;
  stockFilter: string;
  sort: string;
  onCategoryChange: (category: string) => void;
  onSubCategoryChange: (subCategory: string) => void;
  onStockChange: (stock: string) => void;
  onSortChange: (sort: string) => void;
  onClear: () => void;
}

function FilterPanel({
  categories,
  subCategories,
  category,
  subCategory,
  stockFilter,
  sort,
  onCategoryChange,
  onSubCategoryChange,
  onStockChange,
  onSortChange,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-text-primary">Refine products</p>
          <p className="text-xs text-text-muted">Category, stock and sorting</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer text-xs font-semibold text-secondary transition hover:text-secondary/80"
        >
          Reset
        </button>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">Category</p>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className={`block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm transition ${
              !category ? "bg-secondary text-white" : "text-text-primary hover:bg-surface-low"
            }`}
          >
            All categories
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              className={`block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm transition ${
                category === item ? "bg-secondary text-white" : "text-text-primary hover:bg-surface-low"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {subCategories.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">Sub-category</p>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onSubCategoryChange("")}
              className={`block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm transition ${
                !subCategory ? "bg-primary text-white" : "text-text-primary hover:bg-surface-low"
              }`}
            >
              All {category}
            </button>
            {subCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSubCategoryChange(item)}
                className={`block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm transition ${
                  subCategory === item ? "bg-primary text-white" : "text-text-primary hover:bg-surface-low"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">Availability</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {STOCK_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onStockChange(option.value)}
              className={`cursor-pointer rounded-xl px-3 py-2 text-left text-sm transition ${
                stockFilter === option.value
                  ? "bg-tertiary text-white"
                  : "border border-border bg-surface text-text-primary hover:bg-surface-low md:border-transparent"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">Sort by</p>
        <div className="space-y-1">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSortChange(option.value)}
              className={`block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm transition ${
                sort === option.value ? "bg-primary text-white" : "text-text-primary hover:bg-surface-low"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showAdmin] = useState(false);

  const categories = useMemo(() => getCategories(), []);
  const subCategories = useMemo(() => {
    if (!category) return [];
    return [...new Set(PRODUCTS.filter((product) => product.category === category).map((product) => product.subCategory))];
  }, [category]);

  const filtered = useMemo(
    () => applyFilters(products, { search, category, subCategory, sort, stockFilter }),
    [products, search, category, subCategory, sort, stockFilter]
  );

  const averageRating =
    filtered.length === 0
      ? "0.0"
      : (filtered.reduce((sum, product) => sum + product.rating, 0) / filtered.length).toFixed(1);
  const activeFilterCount = [search, category, subCategory, stockFilter !== "all" ? stockFilter : ""].filter(Boolean).length;

  const handleDelete = (id: string) => {
    setProducts((current) => current.filter((product) => product._id !== id));
  };

  const handleStockUpdate = (id: string, newStock: number) => {
    setProducts((current) =>
      current.map((product) => (product._id === id ? { ...product, stock: newStock } : product))
    );
  };

  const handleCategoryChange = (nextCategory: string) => {
    setCategory(nextCategory);
    setSubCategory("");
  };

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setCategory("");
    setSubCategory("");
    setStockFilter("all");
    setSort("newest");
  };

  const filterPanel = (
    <FilterPanel
      categories={categories}
      subCategories={subCategories}
      category={category}
      subCategory={subCategory}
      stockFilter={stockFilter}
      sort={sort}
      onCategoryChange={handleCategoryChange}
      onSubCategoryChange={setSubCategory}
      onStockChange={setStockFilter}
      onSortChange={setSort}
      onClear={clearFilters}
    />
  );

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border bg-primary text-white">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                  <BsGem size={15} />
                  Neplai marketplace
                </span>
                <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
                  Shop curated Nepali goods with fast filters and clear stock.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 md:text-base">
                  Search premium craft, daily essentials, electronics, homeware and mountain-ready
                  gear in one trusted marketplace.
                </p>
                <div className="mt-6 max-w-2xl">
                  <SearchBar
                    value={searchInput}
                    onChange={setSearchInput}
                    onSubmit={(value) => setSearch(value.trim())}
                    placeholder="Search pashmina, Ilam tea, copper, trekking gear..."
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {QUICK_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchInput(term);
                        setSearch(term);
                      }}
                      className="cursor-pointer rounded-full border border-white/18 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/82 transition hover:bg-white/[0.14]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-4">
                  <BsGrid3X3Gap className="text-amber-200" size={20} />
                  <p className="mt-3 text-2xl font-bold">{filtered.length}</p>
                  <p className="text-xs text-white/58">visible items</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-4">
                  <HiOutlineShieldCheck className="text-amber-200" size={21} />
                  <p className="mt-3 text-2xl font-bold">{averageRating}</p>
                  <p className="text-xs text-white/58">avg rating</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-4">
                  <HiOutlineTruck className="text-amber-200" size={21} />
                  <p className="mt-3 text-2xl font-bold">NPR 5k</p>
                  <p className="text-xs text-white/58">free delivery</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              title="All products"
              subtitle={`${filtered.length} products found${activeFilterCount ? ` with ${activeFilterCount} active filters` : ""}`}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMobileFilter(true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface-low md:hidden"
              >
                <HiOutlineFilter size={16} />
                Filters
              </button>
              <div className="hidden items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-secondary md:flex">
                <BsArrowDownUp size={15} />
                {SORT_OPTIONS.find((option) => option.value === sort)?.label}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[260px_1fr]">
            <aside className="hidden md:block">
              <div className="sticky top-20 rounded-2xl border border-border bg-surface p-5" style={{ boxShadow: "var(--shadow-card)" }}>
                {filterPanel}
              </div>
            </aside>

            <div className="min-w-0">
              <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-border bg-surface py-20 text-center text-text-muted"
                  >
                    <BsSearch size={48} className="mx-auto mb-3" />
                    <p className="font-semibold text-text-primary">No products found</p>
                    <p className="mt-1 text-sm">Try a different search, category or stock filter.</p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-5 cursor-pointer rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary/90"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${search}-${category}-${subCategory}-${sort}-${stockFilter}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductGrid
                      products={filtered}
                      showAdmin={showAdmin}
                      onDelete={handleDelete}
                      onStockUpdate={handleStockUpdate}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {showMobileFilter && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/45 md:hidden"
              onClick={() => setShowMobileFilter(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 top-0 z-50 w-[86vw] max-w-sm overflow-y-auto bg-surface p-5 shadow-xl md:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-bold text-text-primary">Filters</p>
                <button
                  type="button"
                  onClick={() => setShowMobileFilter(false)}
                  className="cursor-pointer rounded-lg p-2 text-text-muted transition hover:bg-surface-low hover:text-text-primary"
                >
                  <HiX size={20} />
                </button>
              </div>
              {filterPanel}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}
