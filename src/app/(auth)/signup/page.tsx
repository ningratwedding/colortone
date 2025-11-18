
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import SignupPageClient from './signup-client';

const pageTitle = 'Buat Akun Baru';
const pageDescription = 'Bergabunglah dengan LinkStore dan mulailah membangun etalase digital untuk bisnis UMKM Anda.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${siteConfig.url}/signup`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
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


export default function SignupPage() {
    return <SignupPageClient />;
}
