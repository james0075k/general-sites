export interface SampleProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  ratings: { average: number; count: number };
  stock: number;
  category: string;
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    _id: "p1",
    name: "Handmade Dhaka Fabric Scarf",
    slug: "handmade-dhaka-fabric-scarf",
    price: 1200,
    discountPrice: 950,
    images: [],
    ratings: { average: 4.7, count: 38 },
    stock: 15,
    category: "handicrafts",
  },
  {
    _id: "p2",
    name: "Singing Bowl Set — Meditation",
    slug: "singing-bowl-set-meditation",
    price: 2500,
    images: [],
    ratings: { average: 4.9, count: 62 },
    stock: 8,
    category: "handicrafts",
  },
  {
    _id: "p3",
    name: "Thangka Painting — Buddha",
    slug: "thangka-painting-buddha",
    price: 8500,
    discountPrice: 7200,
    images: [],
    ratings: { average: 5.0, count: 14 },
    stock: 3,
    category: "handicrafts",
  },
  {
    _id: "p4",
    name: "Himalayan Honey (500g)",
    slug: "himalayan-honey-500g",
    price: 850,
    images: [],
    ratings: { average: 4.6, count: 120 },
    stock: 50,
    category: "food",
  },
  {
    _id: "p5",
    name: "Masala Chiya Mix (200g)",
    slug: "masala-chiya-mix-200g",
    price: 400,
    discountPrice: 320,
    images: [],
    ratings: { average: 4.8, count: 95 },
    stock: 100,
    category: "food",
  },
  {
    _id: "p6",
    name: "Lokta Paper Notebook",
    slug: "lokta-paper-notebook",
    price: 600,
    images: [],
    ratings: { average: 4.4, count: 27 },
    stock: 40,
    category: "handicrafts",
  },
  {
    _id: "p7",
    name: "Pashmina Shawl — Natural Grey",
    slug: "pashmina-shawl-natural-grey",
    price: 4500,
    discountPrice: 3800,
    images: [],
    ratings: { average: 4.9, count: 53 },
    stock: 12,
    category: "fashion",
  },
  {
    _id: "p8",
    name: "Bamboo Water Bottle 750ml",
    slug: "bamboo-water-bottle-750ml",
    price: 750,
    images: [],
    ratings: { average: 4.3, count: 18 },
    stock: 0,
    category: "home-living",
  },
];
