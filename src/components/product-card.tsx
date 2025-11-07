"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageCompareSlider } from "./image-compare-slider";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [formattedPrice, setFormattedPrice] = useState<string>('');

  useEffect(() => {
    // This check ensures the code runs only on the client
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };
    setFormattedPrice(formatCurrency(product.price));
  }, [product.price]);


  return (
    <Card className={cn("overflow-hidden group", className)}>
      <CardHeader className="p-0 relative">
        <ImageCompareSlider
            beforeImage={product.imageBefore}
            afterImage={product.imageAfter}
            className="aspect-[3/2]"
        />
      </CardHeader>
      <CardContent className="p-4 pb-2">
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
                <div className="text-sm text-muted-foreground hover:text-primary transition-colors">{product.creator.name}</div>
            </Link>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <div className="font-semibold text-lg">{formattedPrice}</div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-xs">({product.reviewsCount})</span>
        </div>
      </CardFooter>
    </Card>
  );
}
