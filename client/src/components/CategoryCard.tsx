"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  BsLaptop, BsBagHeart, BsBasket2, BsFlower1, BsHouseDoor, BsTrophy,
  BsCupHot, BsBook, BsShop,
} from "react-icons/bs";

const ICONS: Record<string, React.ReactNode> = {
  Electronics: <BsLaptop size={28} />,
  Fashion: <BsBagHeart size={28} />,
  Groceries: <BsBasket2 size={28} />,
  Beauty: <BsFlower1 size={28} />,
  "Home & Kitchen": <BsHouseDoor size={28} />,
  Sports: <BsTrophy size={28} />,
  "Food & Drinks": <BsCupHot size={28} />,
  Books: <BsBook size={28} />,
};

interface Props {
  name: string;
  count?: number;
  href?: string;
  delay?: number;
}

export default function CategoryCard({ name, count, href, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href ?? `/products?category=${encodeURIComponent(name)}`}
        className="group block"
      >
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(15,23,42,0.1)" }}
          transition={{ duration: 0.2 }}
          className="bg-surface border border-border rounded-2xl p-5 text-center cursor-pointer hover:border-secondary/40 transition-colors"
        >
          <div className="flex justify-center mb-3 text-text-secondary group-hover:text-secondary transition-colors">
            {ICONS[name] ?? <BsShop size={28} />}
          </div>
          <p className="text-sm font-semibold text-text-primary group-hover:text-secondary transition-colors">
            {name}
          </p>
          {count !== undefined && (
            <p className="text-xs text-text-muted mt-0.5">{count} items</p>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
