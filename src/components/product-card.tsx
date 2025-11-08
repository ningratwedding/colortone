
"use client";

import Link from "next/link";
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
import { ImageCompareSlider } from "./image-compare-slider";
import { Button } from "./ui/button";
import { CreditCard } from "lucide-react";

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
    <Card className={cn("overflow-hidden group flex flex-col rounded-lg", className)}>
      <CardHeader className="p-0 relative">
        <ImageCompareSlider
            beforeImage={{ imageUrl: product.imageBeforeUrl, imageHint: product.imageBeforeHint, description: product.name }}
            afterImage={{ imageUrl: product.imageAfterUrl, imageHint: product.imageAfterHint, description: product.name }}
            className="aspect-[3/2]"
        />
      </CardHeader>
      <CardContent className="p-3 pb-2 flex-grow">
        <Link href={`/product/${product.id}`} className="space-y-1">
          <CardTitle className="text-base leading-tight hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
      </CardContent>
      <CardFooter className="p-3 pt-0 mt-auto">
        <div className="flex w-full items-center justify-between">
          <div className="font-semibold text-base text-primary truncate">{formattedPrice}</div>
          <Button size="sm" asChild>
            <Link href={`/checkout?productId=${product.id}`}>
              <CreditCard className="mr-1.5 h-4 w-4"/>
              Beli
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
