
import { ProductPageContent } from "./product-client-content";
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Since we can't fetch dynamic data on the server without a proper admin setup,
  // we'll use a generic title and description for now.
  // The specific product details will be loaded on the client.
  const productName = "Detail Produk"; // Generic name

  return {
    title: productName,
    description: `Lihat detail untuk produk di ${siteConfig.name}.`,
    openGraph: {
      title: `${productName} | ${siteConfig.name}`,
      description: `Temukan preset dan LUT berkualitas tinggi di ${siteConfig.name}.`,
      url: `${siteConfig.url}/product/${params.id}`,
    },
     twitter: {
      card: 'summary_large_image',
      title: `${productName} | ${siteConfig.name}`,
      description: `Temukan preset dan LUT berkualitas tinggi di ${siteConfig.name}.`,
    },
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
    return <ProductPageContent productId={params.id} />
}
