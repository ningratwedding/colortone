
'use client';

import Link from 'next/link';
import type { Product, UserProfile } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { CreditCard } from 'lucide-react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const firestore = useFirestore();

  const creatorRef = useMemo(() => {
    if (!firestore || !product.creatorId) return null;
    return doc(firestore, 'users', product.creatorId);
  }, [firestore, product.creatorId]);

  const { data: creator, loading: creatorLoading } = useDoc<UserProfile>(creatorRef);

  useEffect(() => {
    // This check ensures the code runs only on the client
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    };
    setFormattedPrice(formatCurrency(product.price));
  }, [product.price]);
  
  const mainImage = product.galleryImageUrls?.[0];
  const mainImageHint = product.galleryImageHints?.[0];


  return (
    <Card
      className={cn(
        'overflow-hidden group flex flex-col rounded-lg',
        className
      )}
    >
      <CardHeader className="p-0 relative">
         <Link href={`/product/${product.id}`} className="block aspect-[3/2] w-full">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={mainImageHint}
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
         </Link>
      </CardHeader>
      <CardContent className="p-3 pb-2 flex-grow flex flex-col">
        <Link href={`/product/${product.id}`} className="space-y-1">
          <CardTitle className="text-base leading-tight hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
      </CardContent>
      <CardFooter className="p-3 pt-0 mt-auto flex-col items-start gap-2">
        <div className="font-semibold text-base text-primary truncate">
          {formattedPrice}
        </div>
        <Button size="sm" asChild className="w-full">
          <Link href={`/checkout?productId=${product.id}`}>
            <CreditCard className="mr-1.5 h-4 w-4" />
            Beli
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
