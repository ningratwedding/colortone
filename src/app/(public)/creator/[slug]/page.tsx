
'use client';

import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/components/product-card';
import { Instagram, Facebook, Globe } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { UserProfile, Product } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12.528 8.001v5.25c-1.423.115-2.585.83-3.415 1.942C8.253 16.34 7.6 17.34 6.75 17.34c-1.84 0-2.5-1.72-2.5-1.72" />
            <path d="M12.528 8.001c.883-2.48 3.02-3.514 5.31-2.07C20.137 7.37 20.08 11.2 17 11.2v5.123c-1.872 0-3.352-1.33-4.472-2.37" />
            <path d="M12.528 8.001q.44-1.47.79-2.515" />
            <path d="M17.5 4.5c.31.02.62.06.94.13" />
        </svg>
    )
}

const socialLinks = {
  instagram: {
    url: 'https://instagram.com/',
    icon: <Instagram className="h-4 w-4" />,
  },
  facebook: {
    url: 'https://facebook.com/',
    icon: <Facebook className="h-4 w-4" />,
  },
  tiktok: {
    url: 'https://tiktok.com/@',
    icon: <TikTokIcon className="h-4 w-4" />,
  },
  website: {
    url: '',
    icon: <Globe className="h-4 w-4" />
  }
};


export default function CreatorProfilePage({ params }: { params: { slug: string } }) {
  const firestore = useFirestore();
  const [creator, setCreator] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorData = async () => {
      const slug = params.slug;
      if (!firestore || !slug) return;
      setLoading(true);

      // Fetch creator by slug
      const usersRef = collection(firestore, 'users');
      const qCreator = query(usersRef, where('slug', '==', slug), limit(1));
      const creatorSnapshot = await getDocs(qCreator);

      if (creatorSnapshot.empty) {
        setLoading(false);
        // This should be called on the server, but for client-side fetches,
        // we can set state to show a "not found" message or redirect.
        // For now, we'll just stop loading and let the UI handle the null creator state.
        setCreator(null); 
        return;
      }

      const creatorData = { ...creatorSnapshot.docs[0].data(), id: creatorSnapshot.docs[0].id } as UserProfile;
      setCreator(creatorData);

      // Fetch creator's products
      if (creatorData.id) {
        const productsRef = collection(firestore, 'products');
        const qProducts = query(productsRef, where('creatorId', '==', creatorData.id));
        const productsSnapshot = await getDocs(qProducts);
        const creatorProducts = productsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
        setProducts(creatorProducts);
      }
      
      setLoading(false);
    };

    fetchCreatorData();
  }, [firestore, params.slug]);

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-6">
            <header className="mb-6 flex flex-col items-center text-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-8 w-48 mt-3" />
                <Skeleton className="h-5 w-full max-w-lg mt-2" />
                <Skeleton className="h-5 w-full max-w-lg mt-1" />
                <div className="mt-3 flex items-center gap-3">
                    <Skeleton className="h-6 w-16" />
                </div>
            </header>
            <main>
                <Skeleton className="h-6 w-56 mb-4 mx-auto" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    ))}
                </div>
            </main>
        </div>
    );
  }

  if (!creator) {
    // In a real app, you might want to show a more descriptive not found page.
    // Calling notFound() in a client component after data fetching is complex.
    // A simple message is often a good approach.
    return (
        <div className="container mx-auto px-4 py-6 text-center">
            <h1 className="text-2xl font-bold">Kreator tidak ditemukan</h1>
            <p className="text-muted-foreground">Profil yang Anda cari tidak ada.</p>
            <Link href="/" className="mt-4 inline-block text-primary hover:underline">Kembali ke Beranda</Link>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6 flex flex-col items-center text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={creator.avatarUrl} alt={creator.name} data-ai-hint={creator.avatarHint} />
          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold font-headline mt-3">{creator.name}</h1>
        <p className="mt-2 text-base text-muted-foreground max-w-lg">
          {creator.bio}
        </p>
        
        <div className="mt-3 flex items-center gap-3">
          {creator.socials && Object.entries(creator.socials).map(([platform, username]) => {
              const social = socialLinks[platform as keyof typeof socialLinks];
              if (!social || !username) return null;
              
              const url = platform === 'website' ? username : `${social.url}${username}`;

              return (
                  <Link 
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                      {social.icon}
                  </Link>
              )
          })}
        </div>
      </header>

      <main>
        <h2 className="text-xl font-bold mb-4 font-headline text-center">
          Produk oleh {creator.name}
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            {creator.name} belum memiliki produk apa pun.
          </p>
        )}
      </main>
    </div>
  );
}
