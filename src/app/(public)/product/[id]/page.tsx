
import { ProductPageContent } from "./product-client-content";
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { initializeServerSideFirebase } from "@/firebase/server-init";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import type { Product, UserProfile, Software } from "@/lib/data";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string }
}

async function getProductAndCreator(productId: string) {
    const { firestore } = initializeServerSideFirebase();
    const productRef = doc(firestore, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return { product: null, creator: null, softwareList: [] };
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
    
    let softwareList: Software[] = [];
    if (product.compatibleSoftware && product.compatibleSoftware.length > 0) {
        const softwareQuery = query(collection(firestore, 'software'), where('name', 'in', product.compatibleSoftware));
        const softwareSnapshot = await getDocs(softwareQuery);
        softwareList = softwareSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Software));
    }

    return { product, creator, softwareList };
}


export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { product } = await getProductAndCreator(params.id);
  
  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    }
  }

  const productName = product.name;
  const productDescription = product.description;
  const imageUrl = product.galleryImageUrls?.[0] || siteConfig.ogImage;

  return {
    title: productName,
    description: productDescription,
    openGraph: {
      title: `${productName} | ${siteConfig.name}`,
      description: productDescription,
      url: `${siteConfig.url}/product/${params.id}`,
      images: [{ url: imageUrl }],
    },
     twitter: {
      card: 'summary_large_image',
      title: `${productName} | ${siteConfig.name}`,
      description: productDescription,
      images: [imageUrl],
    },
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { product, creator, softwareList } = await getProductAndCreator(params.id);

    if (!product) {
        notFound();
    }
    
    return <ProductPageContent product={product} creator={creator} softwareList={softwareList} />
}

