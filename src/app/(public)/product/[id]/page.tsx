
import { doc, getDoc } from 'firebase/firestore';
import type { Metadata, ResolvingMetadata } from 'next';
import { initializeFirebase } from '@/firebase';
import type { Product } from '@/lib/data';
import { ProductPageContent } from "./product-client-content";
import { siteConfig } from '@/lib/config';

type Props = {
  params: { id: string }
}

// Function to fetch product data on the server
async function getProduct(id: string): Promise<Product | null> {
  // We can't use hooks on the server, so we initialize a connection to fetch data.
  const { firestore } = initializeFirebase();
  const productRef = doc(firestore, 'products', id);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    return null;
  }
  return { id: productSnap.id, ...productSnap.data() } as Product;
}

// Function to generate dynamic metadata for each product page
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch product data
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Produk tidak ditemukan',
    }
  }

  // Get parent metadata to use as a base
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
      url: `${siteConfig.url}/product/${product.id}`,
      images: [
        {
          url: product.imageAfterUrl, // Use the product's 'after' image for the preview
          width: 1200,
          height: 630,
          alt: product.name,
        },
        ...previousImages,
      ],
    },
     twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
      images: [product.imageAfterUrl],
    },
  }
}


export default function ProductPage({ params }: { params: { id: string } }) {
    return <ProductPageContent productId={params.id} />
}
