"use client";

import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

interface Props {
  rating: number;
  numReviews?: number;
  size?: number;
  showCount?: boolean;
}

export default function RatingStars({ rating, numReviews, size = 14, showCount = true }: Props) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const val = i + 1;
    if (rating >= val) return "full";
    if (rating >= val - 0.5) return "half";
    return "empty";
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <span key={i} className="text-yellow-400">
            {type === "full" ? (
              <IoStar size={size} />
            ) : type === "half" ? (
              <IoStarHalf size={size} />
            ) : (
              <IoStarOutline size={size} className="text-gray-300" />
            )}
          </span>
        ))}
      </div>
      <span className="text-xs text-text-secondary font-medium">{rating.toFixed(1)}</span>
      {showCount && numReviews !== undefined && (
        <span className="text-xs text-text-muted">({numReviews.toLocaleString()})</span>
      )}
    </div>
  );
}
