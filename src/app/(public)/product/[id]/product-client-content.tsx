
'use client';

import Image from "next/image";
import { notFound, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Tag,
  Download,
  ShoppingCart,
  Share2,
} from "lucide-react";
import { useMemo, useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ImageCompareSlider } from "@/components/image-compare-slider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { useCollection } from "@/firebase/firestore/use-collection";
import { doc, collection, query } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import type { Product, UserProfile, Software } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase/auth/use-user";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


export function ProductPageContent({ productId }: { productId: string }) {
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState('gallery');
  const [formattedPrice, setFormattedPrice] = useState<string>("");
  
  const productRef = useMemo(() => {
    if (!firestore || !productId) return null;
    return doc(firestore, 'products', productId);
  }, [firestore, productId]);

  const { data: product, loading: productLoading } = useDoc<Product>(productRef);

  const creatorRef = useMemo(() => {
      if (!firestore || !product?.creatorId) return null;
      return doc(firestore, 'users', product.creatorId);
  }, [firestore, product?.creatorId]);

  const { data: creator, loading: creatorLoading } = useDoc<UserProfile>(creatorRef);

  const softwareQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'software'));
  }, [firestore]);

  const { data: softwareList, loading: softwareLoading } = useCollection<Software>(softwareQuery);
  
  // --- Start of logic from ProductPageClientButtons ---
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  const userProfileRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);
  
  useEffect(() => {
    if (ref) {
      sessionStorage.setItem('affiliate_ref', ref);
    }
  }, [ref]);

  const getCheckoutUrl = () => {
    if (userLoading || !product) return "#";
    
    const storedRef = sessionStorage.getItem('affiliate_ref');
    const refQueryParam = storedRef ? `&ref=${storedRef}` : '';
    
    let url = `/checkout?productId=${product.id}${refQueryParam}`;
    
    if (user) {
      return url;
    }
    
    return `/login?redirect=${encodeURIComponent(url)}`;
  };

  const copyAffiliateLink = () => {
    if (!userProfile?.isAffiliate || !user || !product) {
       toast({
        variant: "destructive",
        title: "Akses Ditolak",
        description: "Anda harus menjadi mitra afiliasi untuk membuat tautan.",
      });
      return;
    }
    const link = `${window.location.origin}/product/${product.id}?ref=${user.uid}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Tautan Afiliasi Disalin",
      description: `Bagikan tautan untuk produk "${product.name}" dan dapatkan komisi!`,
    });
  };

  const buttonLoading = userLoading || profileLoading;
  // --- End of logic from ProductPageClientButtons ---


  const compatibleSoftwareDetails = useMemo(() => {
    if (!product?.compatibleSoftware || !softwareList) return [];
    return product.compatibleSoftware
        .map(name => softwareList.find(s => s.name === name))
        .filter((s): s is Software => !!s);
  }, [product, softwareList]);

  useEffect(() => {
    if (product) {
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount);
      };
      setFormattedPrice(formatCurrency(product.price));
    }
  }, [product]);


  if (productLoading || creatorLoading || softwareLoading) {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                    <Skeleton className="aspect-[3/2] w-full rounded-lg" />
                    <div className="flex gap-2 mt-2">
                        <Skeleton className="h-16 w-24 rounded-md" />
                        <Skeleton className="h-16 w-24 rounded-md" />
                    </div>
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
  
  const hasComparison = product.imageBeforeUrl && product.imageAfterUrl;
  const galleryImage = product.galleryImageUrls?.[0];
  const comparisonImage = product.imageAfterUrl;

  return (
    <div className="container mx-auto px-4 py-6 pb-28 md:pb-6">
       <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
        <div>
           {activeTab === 'gallery' && (
              <Carousel className="w-full">
                 <CarouselContent>
                    {Array.isArray(product.galleryImageUrls) && product.galleryImageUrls.map((url, index) => (
                      <CarouselItem key={index}>
                          <div className="aspect-[3/2] w-full rounded-lg overflow-hidden relative bg-muted">
                          <Image
                              src={url}
                              alt={`${product.name} - Gambar Galeri ${index + 1}`}
                              fill
                              className="object-cover"
                              data-ai-hint={product.galleryImageHints?.[index] || 'product image'}
                              priority={index === 0}
                          />
                          </div>
                      </CarouselItem>
                    ))}
                 </CarouselContent>
                 {(product.galleryImageUrls?.length ?? 0) > 1 && (
                    <>
                    <CarouselPrevious className="ml-14" />
                    <CarouselNext className="mr-14" />
                    </>
                 )}
                </Carousel>
           )}
            {activeTab === 'comparison' && hasComparison && (
                <div className="aspect-[3/2] w-full rounded-lg overflow-hidden relative bg-muted">
                    <ImageCompareSlider
                        beforeImage={{ imageUrl: product.imageBeforeUrl!, imageHint: product.imageBeforeHint!, description: `Before - ${product.name}` }}
                        afterImage={{ imageUrl: product.imageAfterUrl!, imageHint: product.imageAfterHint!, description: `After - ${product.name}` }}
                        className="w-full h-full"
                    />
                </div>
            )}
            <div className="mt-2 grid grid-cols-5 gap-2 bg-transparent p-0 h-auto">
                {galleryImage && (
                    <button onClick={() => setActiveTab('gallery')} className="p-0 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:ring-2 data-[state=active]:ring-primary" data-state={activeTab === 'gallery' ? 'active' : 'inactive'}>
                        <div className="aspect-[3/2] w-full rounded-md overflow-hidden relative">
                            <Image src={galleryImage} alt="Galeri" fill className="object-cover" />
                        </div>
                    </button>
                )}
                 {hasComparison && comparisonImage && (
                    <button onClick={() => setActiveTab('comparison')} className="p-0 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:ring-2 data-[state=active]:ring-primary" data-state={activeTab === 'comparison' ? 'active' : 'inactive'}>
                       <div className="aspect-[3/2] w-full rounded-md overflow-hidden relative">
                           <Image src={comparisonImage} alt="Perbandingan" fill className="object-cover" />
                        </div>
                    </button>
                )}
            </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
              {product.name}
            </h1>
            {creator && (
                 <div className="mt-2 flex items-center gap-3">
                    <Link href={`/kreator/${creator.slug}`} className="flex items-center gap-2 group">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={creator.avatarUrl || undefined} alt={creator.name} data-ai-hint={creator.avatarHint || undefined} />
                            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">{creator.name}</span>
                    </Link>
                </div>
            )}
          </div>
          <div className="text-3xl font-bold text-primary">{formattedPrice}</div>
            
            {product.type === 'digital' && compatibleSoftwareDetails && compatibleSoftwareDetails.length > 0 && (
                <TooltipProvider>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {compatibleSoftwareDetails.map(s => (
                        <Tooltip key={s.id}>
                            <TooltipTrigger>
                                {s.icon ? (
                                    <img src={s.icon} alt={`${s.name} icon`} className="h-5 w-5 object-contain" />
                                ) : <div className="h-5 w-5 bg-muted rounded-sm" />}
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{s.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
            )}
          
           {/* Buttons - displayed statically on desktop */}
           <div className="hidden md:flex flex-grow items-center">
            <Button size="lg" className="w-full max-w-xs" asChild disabled={buttonLoading}>
                <Link href={getCheckoutUrl()}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> 
                    {buttonLoading ? "Memuat..." : "Beli Sekarang"}
                </Link>
            </Button>
             {userProfile?.isAffiliate && (
                <Button size="lg" variant="outline" className="w-auto ml-2" onClick={copyAffiliateLink} disabled={buttonLoading}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Bagikan
                </Button>
             )}
            </div>

          <Card>
            <CardContent className="pt-4">
              <p className="text-base text-foreground">{product.description}</p>
            </CardContent>
          </Card>
        </div>
       </div>

       {/* Sticky bottom bar for mobile */}
       <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-20 px-4">
            <div className="flex-grow flex justify-end items-center gap-2">
                <Button size="lg" className="w-full max-w-xs" asChild disabled={buttonLoading}>
                    <Link href={getCheckoutUrl()}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> 
                        {buttonLoading ? "Memuat..." : "Beli Sekarang"}
                    </Link>
                </Button>
                {userProfile?.isAffiliate && (
                    <Button size="icon" variant="outline" className="w-12 h-12" onClick={copyAffiliateLink} disabled={buttonLoading}>
                        <Share2 className="h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
