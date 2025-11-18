import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import HomeClient from './home-client';

export const metadata: Metadata = {
    title: `${siteConfig.name}: Etalase Digital untuk Semua UMKM`,
    description: `Buat halaman link-in-bio yang bisa langsung jualan. ${siteConfig.description}`,
}

export default function Home() {
  return <HomeClient />;
}
