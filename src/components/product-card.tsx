
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageCompareSlider } from "./image-compare-slider";
import { Button } from "./ui/button";
import { CreditCard } from "lucide-react";
import { Separator } from "./ui/separator";

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
            beforeImage={product.imageBefore}
            afterImage={product.imageAfter}
            className="aspect-[3/2]"
        />
      </CardHeader>
      <CardContent className="p-4 pb-2 flex-grow">
        <Link href={`/product/${product.id}`} className="space-y-1">
          <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
         <div className="mt-2 flex items-center gap-2">
            <Link href={`/creator/${product.creator.id}`} className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={product.creator.avatar.imageUrl} alt={product.creator.name} data-ai-hint={product.creator.avatar.imageHint} />
                    <AvatarFallback>{product.creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm text-muted-foreground hover:text-primary transition-colors">{product.creator.name}</div>
            </Link>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 mt-auto">
        <div className="flex w-full items-center justify-between">
          <div className="font-semibold text-lg text-primary truncate">{formattedPrice}</div>
          <Button>
              <CreditCard className="mr-2 h-4 w-4"/>
              Beli
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
