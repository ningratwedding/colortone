
'use client';

import { notFound, redirect } from 'next/navigation';
import { Globe, Instagram, Facebook } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit, getDocs, documentId } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Product, UserProfile } from '@/lib/data';
import { ProductCard } from '@/components/product-card';

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.528 8.001v5.25c-1.423.115-2.585.83-3.415 1.942C8.253 16.34 7.6 17.34 6.75 17.34c-1.84 0-2.5-1.72-2.5-1.72" />
      <path d="M12.528 8.001c.883-2.48 3.02-3.514 5.31-2.07C20.137 7.37 20.08 11.2 17 11.2v5.123c-1.872 0-3.352-1.33-4.472-2.37" />
      <path d="M12.528 8.001q.44-1.47.79-2.515" />
      <path d="M17.5 4.5c.31.02.62.06.94.13" />
    </svg>
  );
}

const socialIcons = {
  instagram: <Instagram className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  tiktok: <TikTokIcon className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />
};

type SocialPlatform = keyof typeof socialIcons;

export function AffiliateProfileContent({ slug }: { slug: string }) {
  const firestore = useFirestore();
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const userQuery = useMemo(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, 'users'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userQuery) return;
      setLoading(true);
      try {
        const querySnapshot = await getDocs(userQuery);
        if (querySnapshot.empty) {
          setProfileUser(null);
        } else {
          const user = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as UserProfile;
          
          if (user.role === 'kreator') {
            redirect(`/kreator/${user.slug}`);
          } else if (user.role === 'affiliator') {
            setProfileUser(user);
          } else {
            // Not a public profile
            setProfileUser(null);
          }
        }
      } catch (e) {
        console.error("Error fetching user profile:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userQuery]);


  const productsQuery = useMemo(() => {
    if (!firestore || !profileUser || !profileUser.featuredProductIds || profileUser.featuredProductIds.length === 0) {
        return null;
    }
    // Firestore 'in' queries are limited to 30 items.
    return query(collection(firestore, "products"), where(documentId(), 'in', profileUser.featuredProductIds.slice(0, 30)));
  }, [firestore, profileUser]);

  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!profileUser) {
    notFound();
  }
  
  // This check is now redundant because of the user fetch logic, but good for safety
  if (profileUser.role !== 'affiliator') {
      notFound();
  }

  const hasFeaturedProducts = profileUser.featuredProductIds && profileUser.featuredProductIds.length > 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col items-center gap-6 mb-8 text-center">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background ring-2 ring-primary">
          <AvatarImage src={profileUser.avatarUrl || undefined} alt={profileUser.name} />
          <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline">{profileUser.name}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl mx-auto">{profileUser.bio || `Rekomendasi produk dari ${profileUser.name}`}</p>
          {profileUser.socials && (
             <div className="flex justify-center items-center gap-4 mt-3">
              {Object.entries(profileUser.socials).map(([platform, username]) => (
                <Link key={platform} href={platform === 'website' ? username as string : `https://www.${platform}.com/${username}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  {socialIcons[platform as SocialPlatform]}
                  <span className="sr-only">{platform}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <main>
        <h2 className="text-2xl font-bold font-headline mb-4 text-center">Rekomendasi Produk Unggulan</h2>
        {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : hasFeaturedProducts && products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} affiliateId={profileUser.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Afiliator ini belum memilih produk unggulan.</p>
          </div>
        )}
      </main>
    </div>
  );
}
