"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: "default" | "large";
}

export function StarRating({
  value,
  onChange,
  disabled = false,
  size = "default",
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const stars = [0, 1, 2, 3, 4, 5]; // Include 0 as a valid rating

  const handleMouseEnter = (star: number) => {
    if (!disabled) {
      setHoverValue(star);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const handleClick = (star: number) => {
    if (!disabled) {
      onChange(star);
    }
  };

  const starSize = size === "large" ? "w-10 h-10" : "w-6 h-6";

  return (
    <div className="flex items-center gap-2" onMouseLeave={handleMouseLeave}>
      {stars.map((star) => (
        <motion.div
          key={star}
          whileHover={{ scale: star !== 0 ? 1.2 : 1 }}
          whileTap={{ scale: star !== 0 ? 0.9 : 1 }}
        >
          {star === 0 ? (
            <motion.button
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md cursor-pointer transition-transform duration-300 hover:scale-110",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleClick(star)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ✖
            </motion.button>
          ) : (
            <Star
              className={cn(
                starSize,
                "cursor-pointer transition-colors duration-200",
                (hoverValue !== null ? star <= hoverValue : star <= value)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-600",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onMouseEnter={() => handleMouseEnter(star)}
              onClick={() => handleClick(star)}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
