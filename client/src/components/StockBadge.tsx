"use client";

import { BsBoxSeam } from "react-icons/bs";

interface Props {
  stock: number;
  showQty?: boolean;
}

export default function StockBadge({ stock, showQty = false }: Props) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
        <BsBoxSeam size={10} />
        Out of Stock
      </span>
    );
  }
  if (stock <= 10) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
        <BsBoxSeam size={10} />
        {showQty ? `Low Stock (${stock} left)` : "Low Stock"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
      <BsBoxSeam size={10} />
      {showQty ? `In Stock (${stock})` : "In Stock"}
    </span>
  );
}
