

'use client';

import { notFound } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit, getDocs, documentId } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Product, UserProfile } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { hexToRgba } from '@/lib/hex-to-rgba';


function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
    )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
    )
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
      <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
    </svg>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
    )
}

const socialIcons = {
  instagram: <InstagramIcon className="h-5 w-5" />,
  facebook: <FacebookIcon className="h-5 w-5" />,
  tiktok: <TikTokIcon className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />,
  whatsapp: <WhatsAppIcon className="h-5 w-5" />,
};

type SocialPlatform = keyof typeof socialIcons;

function CreatorProfileView({ user, products, loading }: { user: UserProfile; products?: Product[] | null; loading: boolean }) {
  const displayName = user.fullName || user.name;
  return (
    <>
        {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} hideCreator={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>{displayName} belum memiliki produk.</p>
          </div>
        )}
    </>
  );
}

function AffiliateProfileView({ user, products, loading }: { user: UserProfile; products?: Product[] | null; loading: boolean }) {
  const hasFeaturedProducts = user.featuredProductIds && user.featuredProductIds.length > 0;
  return (
     <>
        {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : hasFeaturedProducts && products && products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} affiliateId={user.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Afiliator ini belum memilih produk unggulan.</p>
          </div>
        )}
      </>
  );
}


export function ProfileContent({ slug }: { slug: string }) {
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
          if (user.role === 'kreator' || user.role === 'affiliator') {
            setProfileUser(user);
          } else {
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

  useEffect(() => {
    if (profileUser?.profileBackgroundColor && !profileUser.profileBackgroundImageUrl) {
      document.body.style.backgroundColor = profileUser.profileBackgroundColor;
    } else if (profileUser?.profileBackgroundImageUrl) {
      document.body.style.backgroundImage = `url(${profileUser.profileBackgroundImageUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    }
    // Cleanup function to reset the background style when the component unmounts
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    };
  }, [profileUser]);


  const productsQuery = useMemo(() => {
    if (!firestore || !profileUser) return null;
    
    if (profileUser.role === 'kreator') {
        return query(collection(firestore, "products"), where('creatorId', '==', profileUser.id));
    }
    
    if (profileUser.role === 'affiliator' && profileUser.featuredProductIds && profileUser.featuredProductIds.length > 0) {
        // Firestore 'in' queries are limited to 30 items.
        return query(collection(firestore, "products"), where(documentId(), 'in', profileUser.featuredProductIds.slice(0, 30)));
    }

    return null;
  }, [firestore, profileUser]);

  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col items-center gap-6 text-center">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-64" />
            </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
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
  
  const displayName = profileUser.fullName || profileUser.name;
  
  const headerGradientStyle = profileUser.profileBackgroundColor
    ? { backgroundImage: `linear-gradient(to top, ${profileUser.profileBackgroundColor} 0%, rgba(0,0,0,0) 100%)` }
    : {};

  const showGradient = profileUser.showHeaderGradient ?? true;
  const socialsSettings = profileUser.socialsSettings || { style: 'iconOnly', layout: 'horizontal', pillSize: 'md' };
  
  const getPillSizeClasses = (size: string | undefined) => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-xs';
      case 'lg':
        return 'h-11 px-6 text-base';
      case 'md':
      default:
        return 'h-10 px-4 text-sm';
    }
  };

  const socialLinkClasses = (size: string | undefined, layout: string | undefined) => cn(
    "transition-transform hover:scale-110 flex items-center gap-2",
    socialsSettings.style === 'iconOnly' ? 'text-muted-foreground hover:text-primary' : getPillSizeClasses(size),
    layout === 'vertical' && socialsSettings.style === 'pill' ? 'w-full justify-center' : ''
  );
  
   const getSocialLink = (platform: string, username: string) => {
    switch (platform) {
      case 'website':
        return username;
      case 'whatsapp':
        return `https://wa.me/${username}`;
      default:
        return `https://www.${platform}.com/${username}`;
    }
  };

  return (
    <div className="pb-6">
       <div
        className="relative h-48 md:h-64 overflow-hidden"
        style={{ backgroundColor: profileUser.headerColor }}
        >
            {profileUser.headerImageUrl ? (
                <Image
                    src={profileUser.headerImageUrl}
                    alt="Header background"
                    fill
                    className="object-cover"
                    data-ai-hint={profileUser.headerImageHint}
                />
            ) : !profileUser.headerColor && (
                 <Image
                    src={`https://picsum.photos/seed/${profileUser.id}/1200/400`}
                    alt="Header background"
                    fill
                    className="object-cover"
                    data-ai-hint="header background"
                />
            )}
            {showGradient && (
              <div 
                className={cn("absolute inset-0", !profileUser.profileBackgroundColor && !profileUser.profileBackgroundImageUrl && "bg-gradient-to-t from-background via-background/50 to-transparent")} 
                style={headerGradientStyle}
              />
            )}
        </div>
      
      <div className="container mx-auto px-4">
        <header className="flex flex-col items-center gap-4 mb-8 text-center -mt-16 md:-mt-24 relative z-10">
          <Avatar 
            className="h-24 w-24 md:h-32 md:w-32 border-4"
            style={{ borderColor: profileUser.profileBackgroundColor || 'hsl(var(--background))' }}
          >
            <AvatarImage src={profileUser.avatarUrl || undefined} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold font-headline" style={{ color: profileUser.profileTitleFontColor || undefined }}>{displayName}</h1>
            <p className="text-muted-foreground mt-1 max-w-2xl mx-auto" style={{ color: profileUser.profileBodyFontColor || undefined }}>{profileUser.bio}</p>
            {profileUser.socials && (
              <div className={cn(
                "flex justify-center items-center gap-2 mt-3 flex-wrap",
                socialsSettings.layout === 'vertical' ? 'flex-col' : 'flex-row'
              )}>
                {Object.entries(profileUser.socials).map(([platform, username]) => {
                  const rgbaBg = socialsSettings.style === 'pill' && socialsSettings.backgroundColor ? hexToRgba(socialsSettings.backgroundColor, socialsSettings.backgroundOpacity) : 'transparent';
                  const borderRadius = socialsSettings.style === 'pill' ? socialsSettings.borderRadius : undefined;
                  return (
                  <Link 
                    key={platform} 
                    href={getSocialLink(platform, username as string)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={socialLinkClasses(socialsSettings.pillSize, socialsSettings.layout)}
                    style={{
                      backgroundColor: rgbaBg,
                      color: socialsSettings.style === 'pill' ? socialsSettings.fontColor : (profileUser.profileBodyFontColor || undefined),
                      borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined,
                    }}
                  >
                    {socialIcons[platform as SocialPlatform]}
                     {socialsSettings.style === 'pill' && <span className="font-medium capitalize">{platform}</span>}
                    <span className="sr-only">{platform}</span>
                  </Link>
                  )
                })}
              </div>
            )}
          </div>
        </header>

        <Separator className="mb-8" />

        <main>
          {profileUser.role === 'kreator' && <CreatorProfileView user={profileUser} products={products} loading={productsLoading} />}
          {profileUser.role === 'affiliator' && <AffiliateProfileView user={profileUser} products={products} loading={productsLoading} />}
        </main>
      </div>
    </div>
  );
}
