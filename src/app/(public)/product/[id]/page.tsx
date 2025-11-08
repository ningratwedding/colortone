
'use client';

import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CheckCircle,
  Tag,
  Download,
} from "lucide-react";
import { useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ImageCompareSlider } from "@/components/image-compare-slider";
import { ProductClientContent } from "./product-client-content";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import type { Product, UserProfile } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

function ProductPageContent({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  
  const productRef = useMemo(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'products', params.id);
  }, [firestore, params.id]);

  const { data: product, loading: productLoading } = useDoc<Product>(productRef);

  const creatorRef = useMemo(() => {
      if (!firestore || !product?.creatorId) return null;
      return doc(firestore, 'users', product.creatorId);
  }, [firestore, product?.creatorId]);

  const { data: creator, loading: creatorLoading } = useDoc<UserProfile>(creatorRef);

  if (productLoading || creatorLoading) {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                    <Skeleton className="aspect-[3/2] w-full rounded-lg" />
                </div>
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-8 w-3/4" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-28 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <ImageCompareSlider
            beforeImage={{ imageUrl: product.imageBeforeUrl, imageHint: product.imageBeforeHint, description: product.name }}
            afterImage={{ imageUrl: product.imageAfterUrl, imageHint: product.imageAfterHint, description: product.name }}
            className="aspect-[3/2] rounded-lg overflow-hidden"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
              {product.name}
            </h1>
            {creator && (
                 <div className="mt-2 flex items-center gap-3">
                    <Link href={`/creator/${creator.slug}`} className="flex items-center gap-2 group">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={creator.avatarUrl} data-ai-hint={creator.avatarHint} />
                            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">{creator.name}</span>
                    </Link>
                </div>
            )}
          </div>
          <p className="text-base text-muted-foreground">{product.description}</p>
          
          <ProductClientContent price={product.price} productId={product.id} />

          <Card className="rounded-lg">
            <CardContent className="pt-4 grid gap-3 text-sm">
                {product.compatibleSoftware && product.compatibleSoftware.length > 0 && (
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary"/>
                        <span>Kompatibel dengan: {product.compatibleSoftware.join(', ')}</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-primary"/>
                    <span>Unduhan digital instan</span>
                </div>
                {product.tags && product.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary"/>
                        <div className="flex flex-wrap gap-1">
                        {product.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


export default function ProductPage({ params }: { params: { id: string } }) {
    return <ProductPageContent params={params} />
}
