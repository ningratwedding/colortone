import { initializeServerSideFirebase } from "@/firebase/server-init";
import { doc, getDoc, getDocs, collection, query, where, documentId } from "firebase/firestore";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import type { Product, UserProfile, Software } from "@/lib/data";

import Image from "next/image";
import { ShoppingCart, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ImageCompareSlider } from "@/components/image-compare-slider";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from "@/components/ui/separator";

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getProductData(productId: string) {
    const { firestore } = initializeServerSideFirebase();
    const productRef = doc(firestore, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return { product: null, creator: null, compatibleSoftwareDetails: [] };
    }

    const product = { id: productSnap.id, ...productSnap.data() } as Product;
    
    let creator: UserProfile | null = null;
    if (product.creatorId) {
        const creatorRef = doc(firestore, 'users', product.creatorId);
        const creatorSnap = await getDoc(creatorRef);
        if (creatorSnap.exists()) {
            creator = { id: creatorSnap.id, ...creatorSnap.data() } as UserProfile;
        }
    }
    
    let compatibleSoftwareDetails: Software[] = [];
    if (product.type === 'digital' && product.compatibleSoftware && product.compatibleSoftware.length > 0) {
        const softwareQuery = query(collection(firestore, 'software'), where('name', 'in', product.compatibleSoftware));
        const softwareSnapshot = await getDocs(softwareQuery);
        compatibleSoftwareDetails = softwareSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Software));
    }


    return { product, creator, compatibleSoftwareDetails };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product, creator } = await getProductData(params.id);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
      description: "Produk yang Anda cari tidak tersedia."
    }
  }

  const title = `${product.name} oleh ${creator?.name || 'Penjual'}`;
  const description = product.description.substring(0, 155);
  const imageUrl = product.galleryImageUrls?.[0] || siteConfig.ogImage;

  return {
    title: product.name,
    description: description,
    openGraph: {
        title: title,
        description: description,
        url: `${siteConfig.url}/product/${product.id}`,
        images: [
            {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: product.name,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [imageUrl],
    },
  }
}


export default async function ProductPage({ params, searchParams }: Props) {
    const { product, creator, compatibleSoftwareDetails } = await getProductData(params.id);

    if (!product) {
        notFound();
    }
    
    const formattedPrice = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(product.price);
    
    const ref = searchParams?.ref || '';
    const checkoutUrl = `/checkout?productId=${product.id}${ref ? `&ref=${ref}`: ''}`;
    const loginUrl = `/login?redirect=${encodeURIComponent(checkoutUrl)}`;
    
    const hasComparison = product.imageBeforeUrl && product.imageAfterUrl;
    const galleryImage = product.galleryImageUrls?.[0];
    const comparisonImage = product.imageAfterUrl;

    // We can't use `use-client` hooks here, so we create a simple button for share
    const copyLinkButton = (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="lg" variant="outline" className="w-auto"
                        onClick={() => navigator.clipboard.writeText(`${siteConfig.url}/product/${product.id}`)}
                    >
                        <Share2 className="mr-2 h-4 w-4" />
                        Bagikan
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Salin Tautan Produk</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
    
    return (
        <div className="container mx-auto px-2 py-6">
            <div className="grid md:grid-cols-2 gap-2 md:gap-4 lg:gap-6">
            <div>
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
                         {hasComparison && (
                             <CarouselItem>
                                 <div className="aspect-[3/2] w-full rounded-lg overflow-hidden relative bg-muted">
                                    <ImageCompareSlider
                                        beforeImage={{ imageUrl: product.imageBeforeUrl!, imageHint: product.imageBeforeHint!, description: `Before - ${product.name}` }}
                                        afterImage={{ imageUrl: product.imageAfterUrl!, imageHint: product.imageAfterHint!, description: `After - ${product.name}` }}
                                        className="w-full h-full"
                                    />
                                </div>
                             </CarouselItem>
                         )}
                    </CarouselContent>
                    {(product.galleryImageUrls?.length ?? 0) > 1 && (
                        <>
                        <CarouselPrevious className="ml-14" />
                        <CarouselNext className="mr-14" />
                        </>
                    )}
                </Carousel>
            </div>

            <div className="flex flex-col gap-1 md:gap-3">
                <div className="text-3xl font-bold text-primary">{formattedPrice}</div>
                
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
                    {product.name}
                </h1>

                <div className="flex items-center gap-2 pt-2 mb-2">
                    <Button size="lg" className="flex-grow" asChild>
                        <Link href={checkoutUrl}>
                            <ShoppingCart className="mr-2 h-4 w-4" /> 
                            Beli Sekarang
                        </Link>
                    </Button>
                </div>
                
                <div className="flex flex-col gap-3">
                    <p className="text-base text-foreground">{product.description}</p>
                    <Separator />
                    {creator && (
                        <div className="flex items-center gap-3">
                        <Link href={`/${creator.slug}`} className="flex items-center gap-2 group">
                            <Avatar className="h-8 w-8">
                            <AvatarImage src={creator.avatarUrl || undefined} alt={creator.name} data-ai-hint={creator.avatarHint || undefined} />
                            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm group-hover:text-primary transition-colors">{creator.name}</span>
                        </Link>
                        </div>
                    )}
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
                </div>
            </div>
            </div>
        </div>
    );
}
