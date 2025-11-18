
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import PurchasesPageClient from './purchases-client';

const pageTitle = 'Riwayat Pembelian Saya';
const pageDescription = 'Lihat dan kelola riwayat pembelian produk Anda di LinkStore.';

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
    url: `${siteConfig.url}/account/purchases`,
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


export default function PurchasesPage() {
    return <PurchasesPageClient />;
}
