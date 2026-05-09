"use client";

import { motion } from "motion/react";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

interface Props {
  products: Product[];
  className?: string;
  showAdmin?: boolean;
  onDelete?: (id: string) => void;
  onStockUpdate?: (id: string, stock: number) => void;
}

export default function AnimatedProductGrid({ products, className, showAdmin, onDelete, onStockUpdate }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className={className ?? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"}
    >
      {products.map((p) => (
        <motion.div key={p._id} variants={item} className="flex">
          <ProductCard product={p} showAdmin={showAdmin} onDelete={onDelete} onStockUpdate={onStockUpdate} />
        </motion.div>
      ))}
    </motion.div>
  );
}
