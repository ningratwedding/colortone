
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
} from '@/components/ui/card';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

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

  const sellerRef = useMemo(() => {
    if (hideCreator || !firestore || !product.creatorId) return null;
    return doc(firestore, 'users', product.creatorId);
  }, [firestore, product.creatorId, hideCreator]);

  const { data: seller, loading: sellerLoading } = useDoc<UserProfile>(sellerRef);

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
  
  const textAlignClass = {
    'left': 'text-left',
    'center': 'text-center',
  }[settings?.textAlign || 'left'];

  const aspectRatioClass = {
    '3/2': 'aspect-[3/2]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-[1/1]',
  }[settings?.imageAspectRatio || '3/2'];
  
  const simpleStyle = settings?.style === 'simple';

  if (simpleStyle) {
    return (
       <Card
        className={cn('overflow-hidden group flex flex-col', className)}
        style={{ borderRadius: settings?.borderRadius !== undefined ? `${settings.borderRadius}px` : undefined }}
    >
        <CardContent className="p-3 flex items-center gap-4">
            <Link href={productUrl} className={cn("block w-20 h-20 flex-shrink-0 relative overflow-hidden", aspectRatioClass)} style={{ borderRadius: settings?.borderRadius !== undefined ? `${settings.borderRadius}px` : undefined }}>
                 {mainImage ? (
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 30vw, 10vw"
                        className="object-cover"
                        data-ai-hint={mainImageHint}
                    />
                ) : (
                    <div className="w-full h-full bg-muted" />
                )}
            </Link>
            <div className={cn("flex-grow flex flex-col", textAlignClass)}>
                <Link href={productUrl}>
                    <p className="font-semibold leading-tight hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                    </p>
                </Link>
                 <div className="font-medium text-sm text-primary mt-1">
                    {formattedPrice}
                </div>
            </div>
            <Button
                size="sm"
                asChild
                variant={settings?.buttonStyle || 'fill'}
                style={{ borderRadius: settings?.buttonBorderRadius !== undefined ? `${settings.buttonBorderRadius}px` : undefined }}
            >
                <Link href={checkoutUrl}>Beli</Link>
            </Button>
        </CardContent>
    </Card>
    )
  }

  return (
    <Card
      className={cn(
        'overflow-hidden group flex flex-col',
        className
      )}
      style={{ borderRadius: settings?.borderRadius !== undefined ? `${settings.borderRadius}px` : undefined }}
    >
      <CardHeader className="p-0 relative">
         <Link href={productUrl} className={cn("block w-full", aspectRatioClass)}>
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
      <CardContent className={cn("p-3 pb-2 flex-grow flex flex-col", textAlignClass)}>
        <Link href={productUrl} className="space-y-1">
          <CardTitle className="text-base leading-tight hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        {!hideCreator && (
            <div className={cn("mt-2", textAlignClass === 'text-center' && 'flex justify-center')}>
                {sellerLoading ? (
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ) : seller ? (
                    <Link href={`/${seller.slug}`} className="flex items-center gap-2 group/seller">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={seller.avatarUrl} alt={seller.name} data-ai-hint={seller.avatarHint} />
                            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground group-hover/seller:text-primary transition-colors">{seller.name}</span>
                    </Link>
                ) : null}
            </div>
        )}
         <div className={cn("font-semibold text-base text-primary mt-auto pt-2", textAlignClass)}>
          {formattedPrice}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button 
            size="sm"
            asChild
            className="w-full"
            variant={settings?.buttonStyle || 'fill'}
            style={{ borderRadius: settings?.buttonBorderRadius !== undefined ? `${settings.buttonBorderRadius}px` : undefined }}
        >
          <Link href={checkoutUrl}>
            <CreditCard className="mr-1.5 h-4 w-4" />
            Beli
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

