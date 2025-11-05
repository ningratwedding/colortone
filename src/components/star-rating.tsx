"use client"

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
  starClassName?: string;
}

export function StarRating({ rating, totalStars = 5, className, starClassName }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={cn("w-5 h-5 text-yellow-400 fill-yellow-400", starClassName)} />
      ))}
      {halfStar && (
        <div className="relative">
            <Star key="half" className={cn("w-5 h-5 text-yellow-400", starClassName)} />
            <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
                <Star className={cn("w-5 h-5 text-yellow-400 fill-yellow-400", starClassName)} />
            </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={cn("w-5 h-5 text-muted-foreground/50", starClassName)} />
      ))}
    </div>
  );
}
