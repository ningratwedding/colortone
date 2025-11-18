
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import CheckoutPageClient from './checkout-client';

const pageTitle = 'Checkout';
const pageDescription = 'Selesaikan pembelian Anda dengan aman dan cepat.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${siteConfig.url}/checkout`,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [siteConfig.ogImage],
  },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6">Memuat...</div>}>
      <CheckoutPageClient />
    </Suspense>
  );
}
