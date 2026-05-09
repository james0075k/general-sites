"use client";

interface Props {
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { current: "text-base font-bold", old: "text-xs", badge: "text-[10px] px-1.5 py-0.5" },
  md: { current: "text-xl font-bold", old: "text-sm", badge: "text-xs px-2 py-0.5" },
  lg: { current: "text-3xl font-bold", old: "text-lg", badge: "text-sm px-2.5 py-1" },
};

export default function PriceBlock({ price, oldPrice, discountPercentage, size = "md" }: Props) {
  const s = sizes[size];
  const hasDiscount = !!discountPercentage && discountPercentage > 0;

  return (
    <div className="flex items-baseline flex-wrap gap-2">
      <span className={`${s.current} text-secondary`}>NPR {price.toLocaleString()}</span>
      {hasDiscount && oldPrice && (
        <>
          <span className={`${s.old} text-text-muted line-through`}>
            NPR {oldPrice.toLocaleString()}
          </span>
          <span className={`${s.badge} bg-tertiary text-white font-bold rounded-md`}>
            -{discountPercentage}%
          </span>
        </>
      )}
    </div>
  );
}
