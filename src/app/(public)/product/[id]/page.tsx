
import { ProductPageContent } from "./product-client-content";
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { initializeServerSideFirebase } from "@/firebase/server-init";
import { doc, getDoc } from "firebase/firestore";
import type { Product } from "@/lib/data";

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { firestore } = initializeServerSideFirebase();
  const productId = params.id;
  let productName = "Detail Produk";
  let productDescription = `Lihat detail untuk produk di ${siteConfig.name}.`;
  let imageUrl = siteConfig.ogImage;

  try {
    const productRef = doc(firestore, 'products', productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const product = productSnap.data() as Product;
      productName = product.name;
      productDescription = product.description;
      if (product.galleryImageUrls && product.galleryImageUrls.length > 0) {
        imageUrl = product.galleryImageUrls[0];
      }
    }
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
  }

  return {
    title: productName,
    description: productDescription,
    openGraph: {
      title: `${productName} | ${siteConfig.name}`,
      description: productDescription,
      url: `${siteConfig.url}/product/${productId}`,
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

export default function ProductPage({ params }: { params: { id: string } }) {
    return <ProductPageContent productId={params.id} />
}
