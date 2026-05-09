import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import CategoryCard from "@/components/CategoryCard";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/FadeIn";
import {
  getFeaturedProducts,
  getNewArrivals,
  getLowStockProducts,
  getDealsOfDay,
  getCategories,
  PRODUCTS,
} from "@/data/products";
import {
  HiOutlineLockClosed,
  HiOutlineRefresh,
  HiOutlineShieldCheck,
  HiOutlineTruck,
} from "react-icons/hi";
import { BsArrowRight, BsBoxSeam, BsFire, BsGem, BsShop } from "react-icons/bs";

const TRUST_BADGES = [
  {
    icon: <HiOutlineShieldCheck size={24} />,
    title: "Seller-vetted",
    desc: "Curated local brands and trusted merchants",
  },
  {
    icon: <HiOutlineTruck size={24} />,
    title: "Nepal-wide delivery",
    desc: "Reliable dispatch across major routes",
  },
  {
    icon: <HiOutlineLockClosed size={24} />,
    title: "Secure checkout",
    desc: "Khalti, eSewa, Fonepay and COD ready",
  },
  {
    icon: <HiOutlineRefresh size={24} />,
    title: "Easy returns",
    desc: "Clear 7-day support on eligible orders",
  },
];

const MARKET_STATS = [
  { value: "14", label: "curated products" },
  { value: "7", label: "Nepali categories" },
  { value: "4.7", label: "average rating" },
];

const CURATION_STEPS = [
  {
    title: "Craft and culture",
    desc: "Pashmina, Dhaka, copperware, herbal care, Ilam tea and mountain staples.",
  },
  {
    title: "Modern essentials",
    desc: "Electronics, home tools and active gear selected for everyday Nepali life.",
  },
  {
    title: "Clear marketplace standards",
    desc: "Stock visibility, fair offers, secure payments and practical delivery promises.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts();
  const newArrivals = getNewArrivals();
  const lowStock = getLowStockProducts();
  const deals = getDealsOfDay();
  const categories = getCategories();
  const bestSellers = [...PRODUCTS]
    .filter((product) => product.isActive)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4);

  const categoryProductCounts = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = PRODUCTS.filter((product) => product.category === cat && product.isActive).length;
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <HeroSection />

        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_BADGES.map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 0.06} direction="up">
                <div className="flex h-full items-start gap-3 px-2 py-3">
                  <span className="mt-0.5 text-secondary">{feature.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{feature.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-text-secondary">{feature.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <FadeIn>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                  The Nepal edit
                </span>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
                  Premium finds from Kathmandu workshops, Himalayan farms and modern Nepali brands.
                </h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="grid grid-cols-3 gap-3">
                {MARKET_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border bg-surface px-4 py-5 text-center"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium leading-4 text-text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((cat, index) => (
              <CategoryCard
                key={cat}
                name={cat}
                count={categoryProductCounts[cat]}
                delay={index * 0.04}
              />
            ))}
          </div>
        </section>

        <section className="bg-primary py-16 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <FadeIn>
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                    <BsGem size={15} />
                    Marketplace standard
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                    Built for shoppers who care about origin, quality and speed.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/68">
                    Neplai brings traditional goods and modern essentials into one polished
                    storefront, so customers can shop by trust, price and availability.
                  </p>
                  <Link
                    href="/products"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary/90"
                  >
                    Browse the marketplace
                    <BsArrowRight size={16} />
                  </Link>
                </div>
              </FadeIn>

              <div className="grid gap-4 sm:grid-cols-3">
                {CURATION_STEPS.map((step, index) => (
                  <FadeIn key={step.title} delay={index * 0.08} direction="up">
                    <div className="h-full rounded-2xl border border-white/12 bg-white/[0.06] p-5">
                      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-200">
                        {index + 1}
                      </div>
                      <h3 className="text-base font-bold text-white">{step.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-white/62">{step.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16">
            <SectionTitle
              title="Featured by Neplai"
              accent="Top picks"
              subtitle="High-rated products with a strong local story and clear value."
              viewAllHref="/products?featured=true"
              viewAllLabel="View featured"
            />
            <ProductGrid products={featured.slice(0, 8)} />
          </section>
        )}

        {bestSellers.length > 0 && (
          <section className="border-y border-border bg-surface-low/70 py-16">
            <div className="mx-auto max-w-7xl px-4">
              <SectionTitle
                title="Most loved across Nepal"
                accent="Customer favorites"
                subtitle="Best-selling items with strong ratings and repeat demand."
                viewAllHref="/products"
                viewAllLabel="Shop best sellers"
              />
              <ProductGrid products={bestSellers} columns="grid grid-cols-2 sm:grid-cols-4 gap-4" />
            </div>
          </section>
        )}

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-2">
          {deals.length > 0 && (
            <div>
              <SectionTitle
                title="Premium deals"
                accent="Limited offers"
                subtitle="Sharp prices on products worth discovering."
                viewAllHref="/products"
                viewAllLabel="View deals"
              />
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
                <BsFire size={17} />
                {deals.length} curated offers are live today.
              </div>
              <ProductGrid products={deals.slice(0, 2)} columns="grid grid-cols-2 gap-4" />
            </div>
          )}

          {newArrivals.length > 0 && (
            <div>
              <SectionTitle
                title="New to the shelf"
                accent="Fresh arrivals"
                subtitle="Recently added goods for the season ahead."
                viewAllHref="/products"
                viewAllLabel="See arrivals"
              />
              <ProductGrid products={newArrivals.slice(0, 2)} columns="grid grid-cols-2 gap-4" />
            </div>
          )}
        </section>

        {lowStock.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pb-16">
            <SectionTitle
              title="Almost gone"
              accent="Low stock"
              subtitle="Small-batch products with limited quantity remaining."
              viewAllHref="/products"
              viewAllLabel="Shop low stock"
            />
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
              <BsBoxSeam size={17} />
              These products are down to the final few units.
            </div>
            <ProductGrid
              products={lowStock.slice(0, 4)}
              columns="grid grid-cols-2 sm:grid-cols-4 gap-4"
            />
          </section>
        )}

        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn>
              <div className="grid gap-8 rounded-3xl border border-border bg-background p-6 md:grid-cols-[1fr_auto] md:items-center md:p-10">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                    <BsShop size={15} />
                    Shop with confidence
                  </span>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                    Discover Nepal&apos;s best products in one premium marketplace.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
                    Explore trusted sellers, local craft, practical essentials and festival-ready
                    finds without losing the polish of a modern ecommerce experience.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary/92"
                >
                  Start shopping
                  <BsArrowRight size={16} />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
