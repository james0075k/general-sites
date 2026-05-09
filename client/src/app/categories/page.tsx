import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import { BsBasket2, BsLaptop, BsBagHeart, BsHouseDoor, BsCupHot, BsTrophy, BsBook, BsStars, BsShop } from "react-icons/bs";

const CATEGORY_META: Record<string, { icon: React.ReactNode; desc: string }> = {
  handicrafts:  { icon: <BsBasket2 size={36} />,  desc: "Traditional Nepali handmade crafts" },
  electronics:  { icon: <BsLaptop size={36} />,   desc: "Gadgets and tech accessories" },
  fashion:      { icon: <BsBagHeart size={36} />, desc: "Clothing, shoes, and accessories" },
  "home-living":{ icon: <BsHouseDoor size={36} />,desc: "Décor, furniture, and kitchenware" },
  food:         { icon: <BsCupHot size={36} />,   desc: "Local snacks, spices, and teas" },
  sports:       { icon: <BsTrophy size={36} />,   desc: "Outdoor and fitness gear" },
  books:        { icon: <BsBook size={36} />,      desc: "Nepali and international titles" },
  beauty:       { icon: <BsStars size={36} />,    desc: "Skincare, cosmetics, and wellness" },
};

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
        <FadeIn>
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-text-primary mb-2">All Categories</h1>
            <p className="text-text-muted">Browse Nepal&apos;s widest product selection by category</p>
          </div>
        </FadeIn>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((cat: { _id: string; name: string; slug: string }, i: number) => {
              const meta = CATEGORY_META[cat.slug];
              return (
                <FadeIn key={cat._id} delay={i * 0.06} direction="up">
                  <Link
                    href={`/products?category=${cat._id}`}
                    className="bg-surface border border-border rounded-2xl p-6 text-center hover:border-secondary/50 hover:shadow-lg transition-all duration-200 group block"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="flex justify-center mb-3 text-text-secondary group-hover:text-secondary transition-colors">
                      {meta?.icon ?? <BsShop size={36} />}
                    </div>
                    <h2 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
                      {cat.name}
                    </h2>
                    {meta?.desc && (
                      <p className="text-xs text-text-muted mt-1 leading-snug">{meta.desc}</p>
                    )}
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        ) : (
          <FadeIn>
            <div className="bg-surface rounded-2xl border border-border py-20 text-center text-text-muted">
              <div className="flex justify-center mb-4">
                <BsShop size={52} />
              </div>
              <p className="font-medium text-text-primary">Categories coming soon</p>
              <p className="text-sm mt-1">Check back once the store is stocked</p>
              <Link
                href="/products"
                className="inline-block mt-6 bg-secondary text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-secondary/90 transition-colors text-sm"
              >
                Browse All Products
              </Link>
            </div>
          </FadeIn>
        )}
      </main>
      <Footer />
    </>
  );
}
