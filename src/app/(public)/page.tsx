import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import HomeClient from './home-client';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import { doc, getDoc } from 'firebase/firestore';
import type { PlatformSettings } from '@/lib/data';

// This function generates metadata on the server.
export async function generateMetadata(): Promise<Metadata> {
  const { firestore } = initializeServerSideFirebase();
  const settingsRef = doc(firestore, 'platform_settings', 'main');
  
  let settings: PlatformSettings | null = null;
  try {
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      settings = settingsSnap.data() as PlatformSettings;
    }
  } catch (error) {
    console.error("Could not fetch platform settings for metadata:", error);
  }

  const appName = settings?.appName || siteConfig.name;
  const appDescription = settings?.appDescription || `Buat halaman link-in-bio yang bisa langsung jualan. ${siteConfig.description}`;
  const ogImage = settings?.ogImageUrl || siteConfig.ogImage;

  return {
    title: `${appName}: Etalase Digital untuk Semua UMKM`,
    description: appDescription,
    openGraph: {
      title: `${appName}: Etalase Digital untuk Semua UMKM`,
      description: appDescription,
      url: siteConfig.url,
      siteName: appName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: appName,
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
     twitter: {
      card: 'summary_large_image',
      title: `${appName}: Etalase Digital untuk Semua UMKM`,
      description: appDescription,
      images: [ogImage],
    },
  };
}


export default function Home() {
  return <HomeClient />;
}
