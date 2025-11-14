


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
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";


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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
    )
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
        </svg>
    );
}

const socialIcons = {
  instagram: <InstagramIcon className="h-5 w-5" />,
  facebook: <FacebookIcon className="h-5 w-5" />,
  tiktok: <TikTokIcon className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />,
  whatsapp: <WhatsAppIcon className="h-5 w-5" />,
  linkedin: <LinkedInIcon className="h-5 w-5" />,
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
              <ProductCard key={product.id} product={product} hideCreator={true} settings={user.productCardSettings} />
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
  const [activeCategory, setActiveCategory] = useState('all');
  const hasFeaturedProducts = user.featuredProductIds && user.featuredProductIds.length > 0;
  const categories = user.affiliateProductCategories || [];

  if (loading) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!hasFeaturedProducts || !products || products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Afiliator ini belum memilih produk unggulan.</p>
      </div>
    );
  }

  const allCategory: (typeof categories)[0] = { id: 'all', name: 'Semua Produk', productIds: user.featuredProductIds || [] };
  const displayCategories = [allCategory, ...categories];
  const activeProducts = products.filter(p => displayCategories.find(c => c.id === activeCategory)?.productIds.includes(p.id));

  return (
     <div className="w-full space-y-4">
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {displayCategories.map((cat) => (
            <CarouselItem key={cat.id} className="basis-auto pl-2">
              <Button
                variant={activeCategory === cat.id ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {activeProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          {activeProducts.map((product) => (
            <ProductCard key={product.id} product={product} affiliateId={user.id} settings={user.productCardSettings} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Tidak ada produk dalam kategori ini.</p>
        </div>
      )}
    </div>
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
  const socialsSettings = profileUser.socialsSettings || { style: 'iconOnly', layout: 'vertical', pillSize: 'md' };
  
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
            <h1 
              className={cn(
                "text-3xl font-bold font-headline",
                profileUser.profileTitleFont === 'poppins' && 'font-poppins',
                profileUser.profileTitleFont === 'lora' && 'font-lora',
                profileUser.profileTitleFont === 'oswald' && 'font-oswald',
                profileUser.profileTitleFont === 'raleway' && 'font-raleway',
                profileUser.profileTitleFont === 'playfair' && 'font-playfair',
                profileUser.profileTitleFont === 'roboto' && 'font-roboto',
                profileUser.profileTitleFont === 'lato' && 'font-lato',
                profileUser.profileTitleFont === 'merriweather' && 'font-merriweather',
                profileUser.profileTitleFont === 'montserrat' && 'font-montserrat',
                profileUser.profileTitleFont === 'open-sans' && 'font-open-sans',
                profileUser.profileTitleFont === 'noto-sans' && 'font-noto-sans',
                profileUser.profileTitleFont === 'source-sans-pro' && 'font-source-sans-pro',
                profileUser.profileTitleFont === 'slabo' && 'font-slabo',
                profileUser.profileTitleFont === 'pt-serif' && 'font-pt-serif',
                profileUser.profileTitleFont === 'ubuntu' && 'font-ubuntu',
                profileUser.profileTitleFont === 'exo2' && 'font-exo2',
                profileUser.profileTitleFont === 'zilla-slab' && 'font-zilla-slab',
                profileUser.profileTitleFont === 'cutive-mono' && 'font-cutive-mono',
                profileUser.profileTitleFont === 'source-code-pro' && 'font-source-code-pro'
              )} 
              style={{ color: profileUser.profileTitleFontColor || undefined }}
            >
              {displayName}
            </h1>
            <p 
              className={cn(
                "text-muted-foreground mt-1 max-w-2xl mx-auto",
                profileUser.profileBodyFont === 'poppins' && 'font-poppins',
                profileUser.profileBodyFont === 'lora' && 'font-lora',
                profileUser.profileBodyFont === 'oswald' && 'font-oswald',
                profileUser.profileBodyFont === 'raleway' && 'font-raleway',
                profileUser.profileBodyFont === 'playfair' && 'font-playfair',
                profileUser.profileBodyFont === 'roboto' && 'font-roboto',
                profileUser.profileBodyFont === 'lato' && 'font-lato',
                profileUser.profileBodyFont === 'merriweather' && 'font-merriweather',
                profileUser.profileBodyFont === 'montserrat' && 'font-montserrat',
                profileUser.profileBodyFont === 'open-sans' && 'font-open-sans',
                profileUser.profileBodyFont === 'noto-sans' && 'font-noto-sans',
                profileUser.profileBodyFont === 'source-sans-pro' && 'font-source-sans-pro',
                profileUser.profileBodyFont === 'slabo' && 'font-slabo',
                profileUser.profileBodyFont === 'pt-serif' && 'font-pt-serif',
                profileUser.profileBodyFont === 'ubuntu' && 'font-ubuntu',
                profileUser.profileBodyFont === 'exo2' && 'font-exo2',
                profileUser.profileBodyFont === 'zilla-slab' && 'font-zilla-slab',
                profileUser.profileBodyFont === 'cutive-mono' && 'font-cutive-mono',
                profileUser.profileBodyFont === 'source-code-pro' && 'font-source-code-pro'
              )} 
              style={{ color: profileUser.profileBodyFontColor || undefined }}
            >
              {profileUser.bio}
            </p>
            {profileUser.socials && (
              <div className={cn(
                "flex justify-center items-center gap-2 mt-3 flex-wrap",
                socialsSettings.layout === 'vertical' ? 'flex-col' : 'flex-row'
              )}>
                {Object.entries(profileUser.socials).map(([platform, username]) => {
                  if (!username) return null;
                  const rgbaBg = socialsSettings.style === 'pill' && socialsSettings.backgroundColor ? hexToRgba(socialsSettings.backgroundColor, socialsSettings.backgroundOpacity) : 'transparent';
                  const borderRadius = socialsSettings.style === 'pill' ? socialsSettings.borderRadius : undefined;
                  const pillWidth = socialsSettings.style === 'pill' && socialsSettings.layout === 'horizontal' ? socialsSettings.pillWidth : undefined;

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
                      minWidth: pillWidth !== undefined ? `${pillWidth}px` : undefined,
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
