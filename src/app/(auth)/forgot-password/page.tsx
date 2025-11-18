
import type { Metadata } from 'next';
import ForgotPasswordPageClient from './forgot-password-client';
import { siteConfig } from '@/lib/config';

const pageTitle = 'Lupa Kata Sandi';
const pageDescription = 'Atur ulang kata sandi Anda untuk mendapatkan kembali akses ke akun LinkStore Anda.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${siteConfig.url}/forgot-password`,
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

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}
