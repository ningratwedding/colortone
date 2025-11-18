import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/config";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { FirebaseErrorListener } from "@/firebase/FirebaseErrorListener";
import { initializeServerSideFirebase } from "@/firebase/server-init";
import { doc, getDoc } from "firebase/firestore";
import type { PlatformSettings } from "@/lib/data";


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
  const ogImage = settings?.ogImageUrl || siteConfig.ogImage;
  
  return {
    title: {
      default: appName,
      template: `%s | ${appName}`,
    },
    description: siteConfig.description,
    openGraph: {
      title: appName,
      description: siteConfig.description,
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
      title: appName,
      description: siteConfig.description,
      images: [ogImage],
    },
    icons: {
      icon: '/favicon.ico',
    }
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cutive+Mono&family=Exo+2:ital,wght@0,100..900;1,100..900&family=Jost:ital,wght@0,100..900;1,100..900&family=Inter:wght@400;500;600;700&family=Lato:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,700;1,400&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Oswald:wght@200..700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Quicksand:wght@300..700&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,400;0,700;1,400&family=Slabo+27px&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Zilla+Slab:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <div className="flex flex-col flex-1">
            {children}
          </div>
          <FirebaseErrorListener />
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
