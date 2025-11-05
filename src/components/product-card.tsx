"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card className={cn("overflow-hidden group", className)}>
      <CardHeader className="p-0 relative">
        <Link href={`/product/${product.id}`} aria-label={product.name}>
          <div className="relative aspect-[3/2]">
            <Image
              src={product.imageBefore.imageUrl}
              alt={`${product.name} (Sebelum)`}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={product.imageBefore.imageHint}
            />
            <Image
              src={product.imageAfter.imageUrl}
              alt={`${product.name} (Sesudah)`}
              fill
              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={product.imageAfter.imageHint}
            />
          </div>
        </Link>
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 h-8 w-8 rounded-full"
          onClick={() => setIsFavorited(!isFavorited)}
          aria-label={isFavorited ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all",
              isFavorited
                ? "text-red-500 fill-red-500"
                : "text-muted-foreground"
            )}
          />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`} className="space-y-1">
          <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <div className="mt-2 flex items-center gap-2">
            <Link href="#" className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={product.creator.avatar.imageUrl} alt={product.creator.name} data-ai-hint={product.creator.avatar.imageHint} />
                    <AvatarFallback>{product.creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardDescription className="text-sm hover:text-primary transition-colors">{product.creator.name}</CardDescription>
            </Link>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="font-semibold text-lg">${product.price.toFixed(2)}</div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-xs">({product.reviewsCount})</span>
        </div>
      </CardFooter>
    </Card>
  );
}
