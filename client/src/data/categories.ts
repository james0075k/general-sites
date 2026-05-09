export interface StaticCategory {
  slug: string;
  name: string;
  description: string;
  emoji: string;
}

export const STATIC_CATEGORIES: StaticCategory[] = [
  { slug: "handicrafts", name: "Handicrafts", description: "Traditional Nepali handmade crafts", emoji: "🧺" },
  { slug: "electronics", name: "Electronics", description: "Gadgets and tech accessories", emoji: "💻" },
  { slug: "fashion", name: "Fashion", description: "Clothing, shoes, and accessories", emoji: "👗" },
  { slug: "home-living", name: "Home & Living", description: "Décor, furniture, and kitchenware", emoji: "🏡" },
  { slug: "food", name: "Food & Drinks", description: "Local snacks, spices, and teas", emoji: "🍵" },
  { slug: "sports", name: "Sports", description: "Outdoor and fitness gear", emoji: "🏆" },
  { slug: "books", name: "Books", description: "Nepali and international titles", emoji: "📚" },
  { slug: "beauty", name: "Beauty", description: "Skincare, cosmetics, and wellness", emoji: "✨" },
];
