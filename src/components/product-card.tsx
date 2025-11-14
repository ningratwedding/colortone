
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
  hideCreator?: boolean;
  affiliateId?: string;
  settings?: UserProfile['productCardSettings'];
}

export function ProductCard({ product, className, hideCreator = false, affiliateId, settings }: ProductCardProps) {
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const firestore = useFirestore();

  const creatorRef = useMemo(() => {
    if (hideCreator || !firestore || !product.creatorId) return null;
    return doc(firestore, 'users', product.creatorId);
  }, [firestore, product.creatorId, hideCreator]);

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

  const productUrl = `/product/${product.id}${affiliateId ? `?ref=${affiliateId}`: ''}`;
  const checkoutUrl = `/checkout?productId=${product.id}${affiliateId ? `&ref=${affiliateId}`: ''}`;
  
  const cardStyle = settings?.style || 'standard';
  const textAlign = settings?.textAlign || 'left';
  const aspectRatio = settings?.imageAspectRatio === '1/1' ? 'aspect-square' 
                    : settings?.imageAspectRatio === '4/3' ? 'aspect-[4/3]' 
                    : 'aspect-[3/2]';
  const buttonStyle = settings?.buttonStyle || 'fill';


  return (
    <Card
      className={cn(
        'overflow-hidden group flex flex-col rounded-lg',
        textAlign === 'center' && 'text-center',
        className
      )}
    >
      <CardHeader className="p-0 relative">
         <Link href={productUrl} className={cn("block w-full", aspectRatio)}>
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
      <CardContent className={cn("p-3 pb-2 flex-grow flex flex-col", textAlign === 'center' && 'items-center')}>
        <Link href={productUrl} className="space-y-1">
          <CardTitle className="text-base leading-tight hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        {cardStyle === 'standard' && !hideCreator && (
            <div className="mt-2">
                {creatorLoading ? (
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ) : creator ? (
                    <Link href={`/${creator.slug}`} className={cn("flex items-center gap-2 group/creator", textAlign === 'center' && 'justify-center')}>
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={creator.avatarUrl} alt={creator.name} data-ai-hint={creator.avatarHint} />
                            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground group-hover/creator:text-primary transition-colors">{creator.name}</span>
                    </Link>
                ) : null}
            </div>
        )}
      </CardContent>
      <CardFooter className={cn("p-3 pt-0 mt-auto flex flex-col items-start gap-2", textAlign === 'center' && 'items-center')}>
        <div className="font-semibold text-base text-primary truncate">
          {formattedPrice}
        </div>
        <Button size="sm" asChild className="w-full" variant={buttonStyle === 'outline' ? 'outline' : 'default'}>
          <Link href={checkoutUrl}>
            <CreditCard className="mr-1.5 h-4 w-4" />
            Beli
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
