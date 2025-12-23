import { initializeServerSideFirebase } from "@/firebase/server-init";
import { doc, getDoc } from "firebase/firestore";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import type { Product, UserProfile } from "@/lib/data";
import { ProductPageContent } from "./product-client-content";


type Props = {
  params: { id: string }
}

async function getProductAndCreator(productId: string) {
    const { firestore } = initializeServerSideFirebase();
    const productRef = doc(firestore, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return { product: null, creator: null };
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
    
    return { product, creator };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product, creator } = await getProductAndCreator(params.id);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
      description: "Produk yang Anda cari tidak tersedia."
    }
  }

  const title = `${product.name} oleh ${creator?.name || 'Penjual'}`;
  const description = product.description ? product.description.substring(0, 155) : `Beli ${product.name} di ${siteConfig.name}`;
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


export default async function ProductPage({ params }: Props) {
    // Kita hanya perlu memastikan produk ada di server untuk metadata dan notFound()
    const { product } = await getProductAndCreator(params.id);

    if (!product) {
        notFound();
    }
    
    // Kirim hanya ID ke komponen klien, biarkan klien mengambil data terbaru.
    return <ProductPageContent productId={params.id} />;
}
