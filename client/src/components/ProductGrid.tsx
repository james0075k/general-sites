"use client";

import { motion } from "motion/react";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

interface Props {
  products: Product[];
  showAdmin?: boolean;
  onDelete?: (id: string) => void;
  onStockUpdate?: (id: string, stock: number) => void;
  columns?: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export default function ProductGrid({ products, showAdmin, onDelete, onStockUpdate, columns }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-30px" }}
      className={columns ?? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"}
    >
      {products.map((p) => (
        <motion.div key={p._id} variants={item} className="flex">
          <ProductCard
            product={p}
            showAdmin={showAdmin}
            onDelete={onDelete}
            onStockUpdate={onStockUpdate}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
