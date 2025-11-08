
"use client";

import Link from "next/link";
import type { Product, UserProfile } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState, useEffect, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageCompareSlider } from "./image-compare-slider";
import { Button } from "./ui/button";
import { CreditCard } from "lucide-react";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc, getFirestore } from "firebase/firestore";
import { useFirebaseApp } from "@/firebase/provider";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const app = useFirebaseApp();
  const firestore = getFirestore(app);

  const creatorRef = useMemo(() => {
      if (!firestore || !product.creatorId) return null;
      return doc(firestore, 'users', product.creatorId);
  }, [firestore, product.creatorId]);

  const { data: creator } = useDoc<UserProfile>(creatorRef);

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
         <div className="mt-1.5 flex items-center gap-2">
            {creator && (
              <Link href={`/creator/${creator.slug}`} className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                      <AvatarImage src={creator.avatarUrl} alt={creator.name} data-ai-hint={creator.avatarHint} />
                      <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-xs text-muted-foreground hover:text-primary transition-colors">{creator.name}</div>
              </Link>
            )}
        </div>
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
