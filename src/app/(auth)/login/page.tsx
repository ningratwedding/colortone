
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import LoginPageClient from './login-client';

const pageTitle = 'Masuk ke Akun Anda';
const pageDescription = 'Masuk untuk mengelola etalase digital dan produk UMKM Anda di LinkStore.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${siteConfig.url}/login`,
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

export default function LoginPage() {
  return <LoginPageClient />;
}
