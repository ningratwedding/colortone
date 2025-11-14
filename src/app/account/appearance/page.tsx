
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, updateDoc, collection, query, where, documentId } from 'firebase/firestore';
import { useFirestore, useStorage } from '@/firebase/provider';
import type { Product, UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Loader2, PlusCircle, Trash2, Globe, Check, Image as ImageIcon, Palette, Type, AlignCenter, AlignLeft, AspectRatio, Replace, Video, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { uploadFile } from '@/firebase/storage/actions';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { hexToRgba } from '@/lib/hex-to-rgba';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ProductCard } from '@/components/product-card';
import { useCollection } from '@/firebase/firestore/use-collection';
import { siteConfig } from '@/lib/config';
import { Separator } from '@/components/ui/separator';


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

const colorOptions = [
    { name: 'Putih', value: '#FFFFFF' },
    { name: 'Abu-abu Gelap', value: '#4B5563' },
    { name: 'Biru', value: '#3B82F6' },
    { name: 'Merah', value: '#EF4444' },
];

const fontOptions = [
    { name: 'Default (Inter)', value: 'inter' },
    { name: 'Poppins', value: 'poppins' },
    { name: 'Lora', value: 'lora' },
    { name: 'Oswald', value: 'oswald' },
    { name: 'Raleway', value: 'raleway' },
    { name: 'Playfair Display', value: 'playfair' },
    { name: 'Roboto', value: 'roboto' },
    { name: 'Lato', value: 'lato' },
    { name: 'Merriweather', value: 'merriweather' },
    { name: 'Montserrat', value: 'montserrat' },
    { name: 'Open Sans', value: 'open-sans' },
    { name: 'Noto Sans', value: 'noto-sans' },
    { name: 'Source Sans Pro', value: 'source-sans-pro' },
    { name: 'Slabo 27px', value: 'slabo' },
    { name: 'PT Serif', value: 'pt-serif' },
    { name: 'Ubuntu', value: 'ubuntu' },
    { name: 'Exo 2', value: 'exo2' },
    { name: 'Zilla Slab', value: 'zilla-slab' },
    { name: 'Cutive Mono (Typewriter)', value: 'cutive-mono' },
    { name: 'Source Code Pro (Code)', value: 'source-code-pro' },
]


function ProfilePreview({
  profile,
  products,
  bio,
  socials,
  socialsSettings,
  headerColor,
  headerImagePreview,
  headerVideoPreview,
  showHeaderGradient,
  profileBackgroundColor,
  profileBackgroundImagePreview,
  profileTitleFont,
  profileTitleFontColor,
  profileBodyFont,
  profileBodyFontColor,
  productCardSettings,
  categorySettings,
}: {
  profile: UserProfile;
  products?: Product[] | null;
  bio: string;
  socials: UserProfile['socials'];
  socialsSettings: UserProfile['socialsSettings'];
  headerColor: string;
  headerImagePreview: string | null;
  headerVideoPreview: string | null;
  showHeaderGradient: boolean;
  profileBackgroundColor: string;
  profileBackgroundImagePreview: string | null;
  profileTitleFont?: string;
  profileTitleFontColor: string;
  profileBodyFont?: string;
  profileBodyFontColor: string;
  productCardSettings?: UserProfile['productCardSettings'];
  categorySettings?: UserProfile['categorySettings'];
}) {
  const displayName = profile.fullName || profile.name;
  const [activeCategory, setActiveCategory] = useState('all');

  const headerGradientStyle = profileBackgroundColor
    ? { backgroundImage: `linear-gradient(to top, ${profileBackgroundColor} 0%, rgba(0,0,0,0) 100%)` }
    : {};
    
  const pageBackgroundStyle = profileBackgroundImagePreview 
    ? { backgroundImage: `url(${profileBackgroundImagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: profileBackgroundColor || '#FFFFFF' };

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
    socialsSettings?.style === 'iconOnly' ? 'text-muted-foreground hover:text-primary' : getPillSizeClasses(size),
    layout === 'vertical' && socialsSettings?.style === 'pill' ? 'w-full justify-center' : ''
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
  
    const categories = profile.affiliateProductCategories || [];
    const allCategory = { id: 'all', name: 'Semua Produk', productIds: profile.featuredProductIds || [] };
    const displayCategories = [allCategory, ...categories];
    
    const activeProducts = products?.filter(p => displayCategories.find(c => c.id === activeCategory)?.productIds.includes(p.id));


  return (
    <div className="w-full h-full overflow-y-auto" style={pageBackgroundStyle}>
        <div
        className="relative h-32 md:h-48 overflow-hidden"
        style={{ backgroundColor: headerColor || '#FFFFFF' }}
        >
            {headerVideoPreview ? (
                <video
                    src={headerVideoPreview}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : headerImagePreview && (
                <Image
                    src={headerImagePreview}
                    alt="Header background"
                    fill
                    className="object-cover"
                />
            )}
            {showHeaderGradient && (
              <div 
                  className={cn("absolute inset-0", !profileBackgroundColor && !profileBackgroundImagePreview && "bg-gradient-to-t from-background via-background/50 to-transparent")} 
                  style={headerGradientStyle}
              />
            )}
        </div>
        <div className="px-4">
        <header className="flex flex-col items-center gap-2 mb-4 text-center -mt-10 md:-mt-12 relative z-10">
        <Avatar 
          className="h-20 w-20 md:h-24 md:w-24 border-4"
          style={{ borderColor: profileBackgroundColor || 'hsl(var(--background))' }}
        >
            <AvatarImage src={profile.avatarUrl || undefined} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <h1 
              className={cn(
                "text-xl font-bold font-headline",
                profileTitleFont === 'poppins' && 'font-poppins',
                profileTitleFont === 'lora' && 'font-lora',
                profileTitleFont === 'oswald' && 'font-oswald',
                profileTitleFont === 'raleway' && 'font-raleway',
                profileTitleFont === 'playfair' && 'font-playfair',
                profileTitleFont === 'roboto' && 'font-roboto',
                profileTitleFont === 'lato' && 'font-lato',
                profileTitleFont === 'merriweather' && 'font-merriweather',
                profileTitleFont === 'montserrat' && 'font-montserrat',
                profileTitleFont === 'open-sans' && 'font-open-sans',
                profileTitleFont === 'noto-sans' && 'font-noto-sans',
                profileTitleFont === 'source-sans-pro' && 'font-source-sans-pro',
                profileTitleFont === 'slabo' && 'font-slabo',
                profileTitleFont === 'pt-serif' && 'font-pt-serif',
                profileTitleFont === 'ubuntu' && 'font-ubuntu',
                profileTitleFont === 'exo2' && 'font-exo2',
                profileTitleFont === 'zilla-slab' && 'font-zilla-slab',
                profileTitleFont === 'cutive-mono' && 'font-cutive-mono',
                profileTitleFont === 'source-code-pro' && 'font-source-code-pro'
              )} 
              style={{ color: profileTitleFontColor || undefined }}
            >
              {displayName}
            </h1>
            <p 
               className={cn(
                "text-sm text-muted-foreground mt-1 max-w-md mx-auto",
                profileBodyFont === 'poppins' && 'font-poppins',
                profileBodyFont === 'lora' && 'font-lora',
                profileBodyFont === 'oswald' && 'font-oswald',
                profileBodyFont === 'raleway' && 'font-raleway',
                profileBodyFont === 'playfair' && 'font-playfair',
                profileBodyFont === 'roboto' && 'font-roboto',
                profileBodyFont === 'lato' && 'font-lato',
                profileBodyFont === 'merriweather' && 'font-merriweather',
                profileBodyFont === 'montserrat' && 'font-montserrat',
                profileBodyFont === 'open-sans' && 'font-open-sans',
                profileBodyFont === 'noto-sans' && 'font-noto-sans',
                profileBodyFont === 'source-sans-pro' && 'font-source-sans-pro',
                profileBodyFont === 'slabo' && 'font-slabo',
                profileBodyFont === 'pt-serif' && 'font-pt-serif',
                profileBodyFont === 'ubuntu' && 'font-ubuntu',
                profileBodyFont === 'exo2' && 'font-exo2',
                profileBodyFont === 'zilla-slab' && 'font-zilla-slab',
                profileBodyFont === 'cutive-mono' && 'font-cutive-mono',
                profileBodyFont === 'source-code-pro' && 'font-source-code-pro'
              )} 
              style={{ color: profileBodyFontColor || undefined }}
            >
              {bio || "Bio Anda akan muncul di sini."}
            </p>
            {socials && Object.keys(socials).length > 0 && (
              <div className={cn(
                "flex justify-center items-center gap-2 mt-3 flex-wrap",
                socialsSettings?.layout === 'vertical' ? 'flex-col' : 'flex-row'
              )}>
                {Object.entries(socials).map(([platform, username]) => {
                  if (!username) return null;
                  const rgbaBg = socialsSettings?.style === 'pill' && socialsSettings?.backgroundColor ? hexToRgba(socialsSettings.backgroundColor, socialsSettings.backgroundOpacity) : 'transparent';
                  const borderRadius = socialsSettings?.style === 'pill' ? socialsSettings.borderRadius : undefined;
                  const pillWidth = socialsSettings?.style === 'pill' && socialsSettings.layout === 'horizontal' ? socialsSettings.pillWidth : undefined;

                  return (
                    <Link 
                      key={platform} 
                      href={getSocialLink(platform, username as string)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={socialLinkClasses(socialsSettings?.pillSize, socialsSettings?.layout)}
                      style={{
                        backgroundColor: rgbaBg,
                        color: socialsSettings?.style === 'pill' ? socialsSettings?.fontColor : (profileBodyFontColor || undefined),
                        borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined,
                        minWidth: pillWidth !== undefined ? `${pillWidth}px` : undefined,
                      }}
                    >
                      {socialIcons[platform as SocialPlatform]}
                      {socialsSettings?.style === 'pill' && <span className="font-medium capitalize">{platform}</span>}
                      <span className="sr-only">{platform}</span>
                    </Link>
                  )
                })}
              </div>
            )}
        </div>
        </header>
            
            { (profile.role === 'kreator' || profile.role === 'affiliator') && <Separator className="my-4" /> }

            {profile.role === 'affiliator' && profile.featuredProductIds && profile.featuredProductIds.length > 0 && (
              <div className="w-full space-y-4">
                <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                  <CarouselContent className="-ml-2">
                    {displayCategories.map((cat) => {
                      const isActive = activeCategory === cat.id;
                      const style = {
                        color: isActive ? categorySettings?.activeColor : categorySettings?.color,
                        backgroundColor: isActive ? categorySettings?.activeBackgroundColor : categorySettings?.backgroundColor,
                        borderColor: categorySettings?.style === 'outline' && (isActive ? categorySettings?.activeBackgroundColor : categorySettings?.backgroundColor) ? (isActive ? categorySettings?.activeBackgroundColor : categorySettings?.backgroundColor) : undefined
                      }
                      return (
                      <CarouselItem key={cat.id} className="basis-auto pl-2">
                        <Button
                          size={categorySettings?.size}
                          variant={isActive ? categorySettings?.style || 'default' : 'outline'}
                          onClick={() => setActiveCategory(cat.id)}
                          className={cn(categorySettings?.shape === 'pill' && 'rounded-full')}
                          style={style}
                        >
                          {cat.name}
                        </Button>
                      </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                </Carousel>
                {activeProducts ? (
                  <div className="grid grid-cols-2 gap-2">
                    {activeProducts.map(product => (
                      <ProductCard key={product.id} product={product} affiliateId={profile.id} settings={productCardSettings} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-center text-muted-foreground py-4">(Ini adalah pratinjau)</p>
    </div>
    </div>
  )
}


export default function AppearancePage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const storage = useStorage();
    const { toast } = useToast();
    const headerImageInputRef = useRef<HTMLInputElement>(null);
    const headerVideoInputRef = useRef<HTMLInputElement>(null);
    const pageImageInputRef = useRef<HTMLInputElement>(null);

    const userProfileRef = useMemo(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

     const productsQuery = useMemo(() => {
        if (!firestore || !userProfile || userProfile.role !== 'affiliator' || !userProfile.featuredProductIds || userProfile.featuredProductIds.length === 0) return null;
        return query(collection(firestore, "products"), where(documentId(), 'in', userProfile.featuredProductIds.slice(0, 30)));
    }, [firestore, userProfile]);

    const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);
    
    const [bio, setBio] = useState('');
    const [socials, setSocials] = useState<UserProfile['socials']>({});
    const [headerColor, setHeaderColor] = useState('');
    const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
    const [headerVideoFile, setHeaderVideoFile] = useState<File | null>(null);
    const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(null);
    const [headerVideoPreview, setHeaderVideoPreview] = useState<string | null>(null);
    const [showHeaderGradient, setShowHeaderGradient] = useState(true);
    const [profileBackgroundColor, setProfileBackgroundColor] = useState('');
    const [profileBackgroundImageFile, setProfileBackgroundImageFile] = useState<File | null>(null);
    const [profileBackgroundImagePreview, setProfileBackgroundImagePreview] = useState<string | null>(null);
    const [profileTitleFont, setProfileTitleFont] = useState<string>('inter');
    const [profileTitleFontColor, setProfileTitleFontColor] = useState('');
    const [profileBodyFont, setProfileBodyFont] = useState<string>('inter');
    const [profileBodyFontColor, setProfileBodyFontColor] = useState('');
    const [socialsSettings, setSocialsSettings] = useState<UserProfile['socialsSettings']>({ style: 'iconOnly', backgroundColor: '', fontColor: '', layout: 'vertical', backgroundOpacity: 1, borderRadius: 9999, pillSize: 'md', pillWidth: 140 });
    const [productCardSettings, setProductCardSettings] = useState<UserProfile['productCardSettings']>({ style: 'standard', textAlign: 'left', imageAspectRatio: '3/2', buttonStyle: 'fill' });
    const [categorySettings, setCategorySettings] = useState<UserProfile['categorySettings']>({ style: 'default', size: 'default', shape: 'default', color: '', backgroundColor: '', activeColor: '', activeBackgroundColor: '' });

    const [isSaving, setIsSaving] = useState(false);

    // Dialog States
    const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
    const [newSocialPlatform, setNewSocialPlatform] = useState<SocialPlatform | ''>('');
    const [newSocialUsername, setNewSocialUsername] = useState('');
    
    useEffect(() => {
        if (userProfile) {
            setBio(userProfile.bio || '');
            setSocials(userProfile.socials || {});
            setHeaderColor(userProfile.headerColor || '');
            setHeaderImagePreview(userProfile.headerImageUrl || null);
            setHeaderVideoPreview(userProfile.headerVideoUrl || null);
            setShowHeaderGradient(userProfile.showHeaderGradient ?? true);
            setProfileBackgroundColor(userProfile.profileBackgroundColor || '');
            setProfileBackgroundImagePreview(userProfile.profileBackgroundImageUrl || null);
            setProfileTitleFont(userProfile.profileTitleFont || 'inter');
            setProfileTitleFontColor(userProfile.profileTitleFontColor || '');
            setProfileBodyFont(userProfile.profileBodyFont || 'inter');
            setProfileBodyFontColor(userProfile.profileBodyFontColor || '');
            setSocialsSettings({
                style: 'iconOnly',
                layout: 'vertical',
                backgroundOpacity: 1,
                borderRadius: 9999,
                pillSize: 'md',
                pillWidth: 140,
                ...userProfile.socialsSettings
            });
            setProductCardSettings({
                style: 'standard',
                textAlign: 'left',
                imageAspectRatio: '3/2',
                buttonStyle: 'fill',
                ...userProfile.productCardSettings,
            });
            setCategorySettings({
                style: 'default',
                size: 'default',
                shape: 'default',
                color: '',
                backgroundColor: '',
                activeColor: '',
                activeBackgroundColor: '',
                ...userProfile.categorySettings,
            });
        }
    }, [userProfile]);
    
    const handleHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setHeaderImageFile(file);
            setHeaderImagePreview(URL.createObjectURL(file));
            setHeaderVideoFile(null);
            setHeaderVideoPreview(null);
        }
    };

    const handleHeaderVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setHeaderVideoFile(file);
            setHeaderVideoPreview(URL.createObjectURL(file));
            setHeaderImageFile(null);
            setHeaderImagePreview(null);
        }
    };
    
    const handleRemoveHeaderBackground = () => {
        setHeaderImageFile(null);
        setHeaderImagePreview(null);
        setHeaderVideoFile(null);
        setHeaderVideoPreview(null);
        toast({ title: 'Latar Dihapus', description: 'Latar header akan dihapus saat Anda menyimpan.'});
    }

    const handlePageImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileBackgroundImageFile(file);
            setProfileBackgroundImagePreview(URL.createObjectURL(file));
        }
    };


    const handleSaveChanges = async () => {
        if (!userProfileRef || !user || !storage) return;
        setIsSaving(true);
        try {
            let newHeaderImageUrl = userProfile?.headerImageUrl || null;
            let newHeaderVideoUrl = userProfile?.headerVideoUrl || null;

            if (headerImageFile) {
                toast({ title: 'Mengunggah gambar header...' });
                newHeaderImageUrl = await uploadFile(storage, headerImageFile, user.uid, 'profile_headers');
                newHeaderVideoUrl = null;
            } else if (headerVideoFile) {
                 toast({ title: 'Mengunggah video header...' });
                 newHeaderVideoUrl = await uploadFile(storage, headerVideoFile, user.uid, 'profile_headers');
                 newHeaderImageUrl = null;
            } else if (!headerImagePreview && !headerVideoPreview) {
                newHeaderImageUrl = null;
                newHeaderVideoUrl = null;
            }

            
            let newProfileBackgroundImageUrl = userProfile?.profileBackgroundImageUrl || null;
            if (profileBackgroundImageFile) {
                toast({ title: 'Mengunggah gambar latar...' });
                newProfileBackgroundImageUrl = await uploadFile(storage, profileBackgroundImageFile, user.uid, 'profile_backgrounds');
            }

            const updatedData: Partial<UserProfile> = {
                bio: bio,
                socials: socials,
                headerColor: headerColor,
                headerImageUrl: newHeaderImageUrl,
                headerVideoUrl: newHeaderVideoUrl,
                showHeaderGradient: showHeaderGradient,
                profileBackgroundColor: profileBackgroundColor,
                profileBackgroundImageUrl: newProfileBackgroundImageUrl,
                profileTitleFont,
                profileTitleFontColor,
                profileBodyFont,
                profileBodyFontColor,
                socialsSettings: socialsSettings,
                productCardSettings: productCardSettings,
                categorySettings: categorySettings,
            };

            await updateDoc(userProfileRef, updatedData);

            toast({
                title: "Tampilan Profil Diperbarui",
                description: "Perubahan Anda telah berhasil disimpan.",
            });
        } catch (error) {
            console.error("Error updating profile appearance:", error);
            toast({
                variant: "destructive",
                title: "Gagal Menyimpan",
                description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan perubahan.",
            });
        } finally {
            setIsSaving(false);
            setHeaderImageFile(null);
            setHeaderVideoFile(null);
            setProfileBackgroundImageFile(null);
        }
    };
    
    const handleAddSocial = () => {
        if (newSocialPlatform && newSocialUsername) {
        setSocials(prev => ({...prev, [newSocialPlatform]: newSocialUsername}));
        setIsSocialDialogOpen(false);
        setNewSocialPlatform('');
        setNewSocialUsername('');
        }
    };

    const handleRemoveSocial = (platform: SocialPlatform) => {
        setSocials(prev => {
            const newSocials = {...prev};
            if (prev) {
            delete (newSocials as any)[platform];
            }
            return newSocials;
        });
    };
    
    const loading = userLoading || profileLoading || productsLoading;

    if (loading) {
        return (
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64 mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-1">
                    <Skeleton className="h-full w-full min-h-[50vh]" />
                </div>
            </div>
        )
    }

    if (!userProfile) {
        return <div>Profil tidak ditemukan.</div>
    }

    return (
        <div className="grid lg:grid-cols-2 gap-6">
             <Card>
                <CardHeader>
                    <CardTitle>Tampilan Profil Publik</CardTitle>
                    <CardDescription>Sesuaikan tampilan halaman profil publik Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    
                    <div className="grid gap-2">
                        <Label htmlFor="bio">Bio Profil Publik</Label>
                        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Ceritakan sedikit tentang diri Anda" className="min-h-[100px]" />
                    </div>

                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="socials">
                            <AccordionTrigger className="text-sm font-medium">Tautan Sosial & Situs Web</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-4 pt-2">
                                    <div className="space-y-3">
                                    {socials && Object.entries(socials).map(([platform, username]) => (
                                        <div key={platform} className="flex items-center gap-3">
                                        <div className="relative flex-grow">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            {socialIcons[platform as keyof typeof socialIcons]}
                                            </span>
                                            <Input
                                            value={username as string}
                                            className="pl-10"
                                            readOnly
                                            />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSocial(platform as SocialPlatform)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                    <Dialog open={isSocialDialogOpen} onOpenChange={setIsSocialDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                        variant="outline"
                                        className="mt-2 w-full sm:w-auto"
                                        >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Tambah Tautan
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                        <DialogTitle>Tambah Tautan Sosial atau Situs Web</DialogTitle>
                                        <DialogDescription>
                                            Pilih platform dan masukkan nama pengguna atau URL.
                                        </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="platform">Platform</Label>
                                            <Select onValueChange={(value) => setNewSocialPlatform(value as SocialPlatform)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih platform" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="instagram">Instagram</SelectItem>
                                                <SelectItem value="facebook">Facebook</SelectItem>
                                                <SelectItem value="tiktok">TikTok</SelectItem>
                                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                                <SelectItem value="website">Situs Web</SelectItem>
                                            </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="username">Nama Pengguna atau URL</Label>
                                            <Input id="username" placeholder={newSocialPlatform === 'website' ? 'https://contoh.com' : 'misal: kartikasari'} value={newSocialUsername} onChange={(e) => setNewSocialUsername(e.target.value)} />
                                        </div>
                                        </div>
                                        <DialogFooter>
                                        <Button onClick={handleAddSocial}>Simpan</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                    </Dialog>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="header-background">
                            <AccordionTrigger className="text-sm font-medium">Latar Header</AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                               <div className="grid gap-2">
                                    <Label>Media Latar</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-32 h-16 rounded-md bg-muted overflow-hidden">
                                            {headerVideoPreview ? (
                                                <video src={headerVideoPreview} muted className="w-full h-full object-cover" />
                                            ) : headerImagePreview ? (
                                                <Image src={headerImagePreview} alt="Pratinjau Header" layout="fill" className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Input type="file" ref={headerImageInputRef} className="hidden" accept="image/*" onChange={handleHeaderImageChange} />
                                            <Input type="file" ref={headerVideoInputRef} className="hidden" accept="video/*" onChange={handleHeaderVideoChange} />
                                            <div className="flex flex-wrap gap-2">
                                                <Button type="button" variant="outline" size="sm" onClick={() => headerImageInputRef.current?.click()}>
                                                    <Replace className="mr-2 h-4 w-4" /> Ganti Gambar
                                                </Button>
                                                 <Button type="button" variant="outline" size="sm" onClick={() => headerVideoInputRef.current?.click()}>
                                                    <Video className="mr-2 h-4 w-4" /> Ganti Video
                                                </Button>
                                                {(headerImagePreview || headerVideoPreview) && (
                                                    <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={handleRemoveHeaderBackground}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">Unggah gambar atau video untuk latar header.</p>
                                        </div>
                                    </div>
                                </div>
                                 <div className="grid gap-2">
                                    <Label>Warna Latar (pengganti jika tidak ada media)</Label>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {colorOptions.map((color) => (
                                            <button 
                                                key={`header-${color.value}`}
                                                type="button"
                                                onClick={() => setHeaderColor(color.value)}
                                                className={cn(
                                                    "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center border-border",
                                                    headerColor === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : ''
                                                )}
                                                style={{ backgroundColor: color.value || 'transparent' }}
                                                aria-label={`Pilih warna header ${color.name}`}
                                            >
                                                {headerColor === color.value && <Check className="h-4 w-4 text-primary-foreground" style={{color: color.value === '#FFFFFF' ? 'black' : 'white'}} />}
                                            </button>
                                        ))}
                                        <Label htmlFor="header-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer transition-transform hover:scale-110" style={{ backgroundColor: headerColor && !colorOptions.some(c => c.value === headerColor) ? headerColor : 'transparent' }}>
                                            <Palette className="h-4 w-4 text-muted-foreground" />
                                            <Input id="header-color-picker" type="color" value={headerColor} onChange={e => setHeaderColor(e.target.value)} className="sr-only" />
                                        </Label>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                        id="header-gradient"
                                        checked={showHeaderGradient}
                                        onCheckedChange={setShowHeaderGradient}
                                    />
                                    <Label htmlFor="header-gradient">Tampilkan Gradasi Header</Label>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="page-background">
                            <AccordionTrigger className="text-sm font-medium">Latar Halaman</AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                               <div className="grid gap-2">
                                    <Label>Gambar Latar Halaman</Label>
                                    <div className="flex items-center gap-4">
                                        {profileBackgroundImagePreview && <Image src={profileBackgroundImagePreview} alt="Pratinjau Latar Halaman" width={128} height={64} className="rounded-md object-cover aspect-[2/1] bg-muted" />}
                                        <div className="flex-1">
                                            <Input type="file" ref={pageImageInputRef} className="hidden" accept="image/*" onChange={handlePageImageChange} />
                                            <Button type="button" variant="outline" onClick={() => pageImageInputRef.current?.click()}>
                                            <ImageIcon className="mr-2 h-4 w-4" /> {profileBackgroundImagePreview ? 'Ganti Gambar' : 'Pilih Gambar'}
                                            </Button>
                                            <p className="text-xs text-muted-foreground mt-1">Rasio 9:16 atau 1:1 disarankan.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Warna Latar Halaman (pengganti jika tidak ada gambar)</Label>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {colorOptions.map((color) => (
                                            <button 
                                                key={`page-${color.value}`}
                                                type="button"
                                                onClick={() => setProfileBackgroundColor(color.value)}
                                                className={cn(
                                                    "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center border-border",
                                                    profileBackgroundColor === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : ''
                                                )}
                                                style={{ backgroundColor: color.value || 'transparent' }}
                                                aria-label={`Pilih warna halaman ${color.name}`}
                                            >
                                                {profileBackgroundColor === color.value && <Check className="h-4 w-4 text-primary-foreground" style={{color: color.value === '#FFFFFF' ? 'black' : 'white'}} />}
                                            </button>
                                        ))}
                                        <Label htmlFor="page-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer transition-transform hover:scale-110" style={{ backgroundColor: profileBackgroundColor && !colorOptions.some(c => c.value === profileBackgroundColor) ? profileBackgroundColor : 'transparent' }}>
                                            <Palette className="h-4 w-4 text-muted-foreground" />
                                            <Input id="page-color-picker" type="color" value={profileBackgroundColor} onChange={e => setProfileBackgroundColor(e.target.value)} className="sr-only" />
                                        </Label>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="fonts">
                            <AccordionTrigger className="text-sm font-medium">Font Halaman</AccordionTrigger>
                             <AccordionContent className="pt-4 space-y-4">
                                 <div className="grid gap-2">
                                    <Label>Font Judul (Nama)</Label>
                                     <Select value={profileTitleFont} onValueChange={setProfileTitleFont}>
                                        <SelectTrigger><SelectValue placeholder="Pilih font judul" /></SelectTrigger>
                                        <SelectContent>
                                            {fontOptions.map(font => (
                                                <SelectItem key={`title-${font.value}`} value={font.value} className={cn(
                                                  font.value === 'poppins' && 'font-poppins',
                                                  font.value === 'lora' && 'font-lora',
                                                  font.value === 'oswald' && 'font-oswald',
                                                  font.value === 'raleway' && 'font-raleway',
                                                  font.value === 'playfair' && 'font-playfair',
                                                  font.value === 'roboto' && 'font-roboto',
                                                  font.value === 'lato' && 'font-lato',
                                                  font.value === 'merriweather' && 'font-merriweather',
                                                  font.value === 'montserrat' && 'font-montserrat',
                                                  font.value === 'open-sans' && 'font-open-sans',
                                                  font.value === 'noto-sans' && 'font-noto-sans',
                                                  font.value === 'source-sans-pro' && 'font-source-sans-pro',
                                                  font.value === 'slabo' && 'font-slabo',
                                                  font.value === 'pt-serif' && 'font-pt-serif',
                                                  font.value === 'ubuntu' && 'font-ubuntu',
                                                  font.value === 'exo2' && 'font-exo2',
                                                  font.value === 'zilla-slab' && 'font-zilla-slab',
                                                  font.value === 'cutive-mono' && 'font-cutive-mono',
                                                  font.value === 'source-code-pro' && 'font-source-code-pro'
                                                )}>{font.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                 </div>
                                 <div className="grid gap-2">
                                    <Label>Font Isi (Bio)</Label>
                                     <Select value={profileBodyFont} onValueChange={setProfileBodyFont}>
                                        <SelectTrigger><SelectValue placeholder="Pilih font isi" /></SelectTrigger>
                                        <SelectContent>
                                            {fontOptions.map(font => (
                                                <SelectItem key={`body-${font.value}`} value={font.value} className={cn(
                                                  font.value === 'poppins' && 'font-poppins',
                                                  font.value === 'lora' && 'font-lora',
                                                  font.value === 'oswald' && 'font-oswald',
                                                  font.value === 'raleway' && 'font-raleway',
                                                  font.value === 'playfair' && 'font-playfair',
                                                  font.value === 'roboto' && 'font-roboto',
                                                  font.value === 'lato' && 'font-lato',
                                                  font.value === 'merriweather' && 'font-merriweather',
                                                  font.value === 'montserrat' && 'font-montserrat',
                                                  font.value === 'open-sans' && 'font-open-sans',
                                                  font.value === 'noto-sans' && 'font-noto-sans',
                                                  font.value === 'source-sans-pro' && 'font-source-sans-pro',
                                                  font.value === 'slabo' && 'font-slabo',
                                                  font.value === 'pt-serif' && 'font-pt-serif',
                                                  font.value === 'ubuntu' && 'font-ubuntu',
                                                  font.value === 'exo2' && 'font-exo2',
                                                  font.value === 'zilla-slab' && 'font-zilla-slab',
                                                  font.value === 'cutive-mono' && 'font-cutive-mono',
                                                  font.value === 'source-code-pro' && 'font-source-code-pro'
                                                )}>{font.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                 </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="font-color">
                            <AccordionTrigger className="text-sm font-medium">Warna Font</AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div>
                                    <Label className="text-xs font-normal text-muted-foreground mb-2 block">Warna Font Nama</Label>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {colorOptions.map((color) => (
                                            <button 
                                                key={`title-font-${color.value}`}
                                                type="button"
                                                onClick={() => setProfileTitleFontColor(color.value)}
                                                className={cn(
                                                    "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center border-border",
                                                    profileTitleFontColor === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : ''
                                                )}
                                                style={{ backgroundColor: color.value || 'transparent' }}
                                                aria-label={`Pilih warna font nama ${color.name}`}
                                            >
                                                {profileTitleFontColor === color.value && <Check className="h-4 w-4 text-primary-foreground" style={{color: color.value === '#FFFFFF' ? 'black' : 'white'}} />}
                                            </button>
                                        ))}
                                        <Label htmlFor="title-font-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer transition-transform hover:scale-110" style={{ backgroundColor: profileTitleFontColor && !colorOptions.some(c => c.value === profileTitleFontColor) ? profileTitleFontColor : 'transparent' }}>
                                            <Palette className="h-4 w-4 text-muted-foreground" />
                                            <Input id="title-font-color-picker" type="color" value={profileTitleFontColor} onChange={e => setProfileTitleFontColor(e.target.value)} className="sr-only" />
                                        </Label>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs font-normal text-muted-foreground mb-2 block">Warna Font Bio & Ikon</Label>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {colorOptions.map((color) => (
                                            <button 
                                                key={`body-font-${color.value}`}
                                                type="button"
                                                onClick={() => setProfileBodyFontColor(color.value)}
                                                className={cn(
                                                    "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center border-border",
                                                    profileBodyFontColor === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : ''
                                                )}
                                                style={{ backgroundColor: color.value || 'transparent' }}
                                                aria-label={`Pilih warna font bio ${color.name}`}
                                            >
                                                {profileBodyFontColor === color.value && <Check className="h-4 w-4 text-primary-foreground" style={{color: color.value === '#FFFFFF' ? 'black' : 'white'}} />}
                                            </button>
                                        ))}
                                         <Label htmlFor="body-font-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer transition-transform hover:scale-110" style={{ backgroundColor: profileBodyFontColor && !colorOptions.some(c => c.value === profileBodyFontColor) ? profileBodyFontColor : 'transparent' }}>
                                            <Palette className="h-4 w-4 text-muted-foreground" />
                                            <Input id="body-font-color-picker" type="color" value={profileBodyFontColor} onChange={e => setProfileBodyFontColor(e.target.value)} className="sr-only" />
                                        </Label>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="socials-appearance">
                            <AccordionTrigger className="text-sm font-medium">Tampilan Tautan Sosial</AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div>
                                <Label className="text-xs font-normal text-muted-foreground mb-2 block">Tata Letak</Label>
                                <RadioGroup 
                                    value={socialsSettings?.layout}
                                    onValueChange={(value) => setSocialsSettings(prev => ({...prev, layout: value as 'horizontal' | 'vertical'}))}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="horizontal" id="horizontal" />
                                        <Label htmlFor="horizontal">Horizontal</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="vertical" id="vertical" />
                                        <Label htmlFor="vertical">Vertikal</Label>
                                    </div>
                                </RadioGroup>
                                </div>

                                <div>
                                <Label className="text-xs font-normal text-muted-foreground mb-2 block">Gaya Tombol</Label>
                                <RadioGroup 
                                    value={socialsSettings?.style}
                                    onValueChange={(value) => setSocialsSettings(prev => ({...prev, style: value as 'iconOnly' | 'pill'}))}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="iconOnly" id="iconOnly" />
                                        <Label htmlFor="iconOnly">Hanya Ikon</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="pill" id="pill" />
                                        <Label htmlFor="pill">Pil</Label>
                                    </div>
                                </RadioGroup>
                                </div>
                                {socialsSettings?.style === 'pill' && (
                                    <div className="space-y-4 pl-6 border-l ml-2 pt-4">
                                        <div>
                                            <Label className="text-xs font-normal text-muted-foreground mb-2 block">Ukuran Pil</Label>
                                            <RadioGroup 
                                                value={socialsSettings?.pillSize}
                                                onValueChange={(value) => setSocialsSettings(prev => ({...prev, pillSize: value as 'sm' | 'md' | 'lg'}))}
                                            >
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="sm" id="sm" /><Label htmlFor="sm">Kecil</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="md" id="md" /><Label htmlFor="md">Sedang</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="lg" id="lg" /><Label htmlFor="lg">Besar</Label></div>
                                            </RadioGroup>
                                        </div>
                                         {socialsSettings.layout === 'horizontal' && (
                                            <div>
                                                <Label className="text-xs font-normal text-muted-foreground mb-2 block">Lebar Minimum Pil</Label>
                                                <div className="flex items-center gap-4">
                                                    <Slider
                                                        value={[ socialsSettings.pillWidth ?? 140 ]}
                                                        onValueChange={(value) => setSocialsSettings(prev => ({...prev, pillWidth: value[0]}))}
                                                        min={80}
                                                        max={300}
                                                        step={10}
                                                    />
                                                    <span className="text-xs w-12 text-right">{socialsSettings.pillWidth ?? 140}px</span>
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <Label className="text-xs font-normal text-muted-foreground mb-2 block">Tingkat Bulat (Border Radius)</Label>
                                            <div className="flex items-center gap-4">
                                                <Slider
                                                    value={[ socialsSettings.borderRadius ?? 32 ]}
                                                    onValueChange={(value) => setSocialsSettings(prev => ({...prev, borderRadius: value[0]}))}
                                                    max={32}
                                                    step={1}
                                                />
                                                <span className="text-xs w-12 text-right">{socialsSettings.borderRadius ?? 32}px</span>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs font-normal text-muted-foreground mb-2 block">Opasitas Latar Pil</Label>
                                            <div className="flex items-center gap-4">
                                                <Slider
                                                    value={[ (socialsSettings.backgroundOpacity ?? 1) * 100 ]}
                                                    onValueChange={(value) => setSocialsSettings(prev => ({...prev, backgroundOpacity: value[0] / 100}))}
                                                    max={100}
                                                    step={1}
                                                />
                                                <span className="text-xs w-12 text-right">{Math.round((socialsSettings.backgroundOpacity ?? 1) * 100)}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs font-normal text-muted-foreground mb-2 block">Warna Latar Pil</Label>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {colorOptions.map((color) => (
                                                    <button key={`social-bg-${color.value}`} type="button" onClick={() => setSocialsSettings(prev => ({...prev, backgroundColor: color.value}))} className={cn("h-8 w-8 rounded-full border-2 border-border", socialsSettings?.backgroundColor === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : '')} style={{backgroundColor: color.value || 'transparent'}}>
                                                        {socialsSettings?.backgroundColor === color.value && <Check className="h-4 w-4 text-primary-foreground" style={{color: color.value === '#FFFFFF' ? 'black' : 'white'}} />}
                                                    </button>
                                                ))}
                                                <Label htmlFor="social-bg-picker" className="h-8 w-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer" style={{ backgroundColor: socialsSettings?.backgroundColor && !colorOptions.some(c => c.value === socialsSettings?.backgroundColor) ? socialsSettings.backgroundColor : 'transparent' }}><Palette className="h-4 w-4 text-muted-foreground" /><Input id="social-bg-picker" type="color" value={socialsSettings.backgroundColor || '#000000'} onChange={e => setSocialsSettings(prev => ({...prev, backgroundColor: e.target.value}))} className="sr-only" /></Label>
                                            </div>
                                        </div>
                                         <div>
                                            <Label className="text-xs font-normal text-muted-foreground mb-2 block">Warna Ikon & Teks Pil</Label>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {colorOptions.map((color) => (
                                                    <button key={`social-fg-${color.value}`} type="button" onClick={() => setSocialsSettings(prev => ({...prev, fontColor: color.value}))} className={cn("h-8 w-8 rounded-full border-2 border-border", socialsSettings?.fontColor === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : '')} style={{backgroundColor: color.value || 'transparent' }}>
                                                        {socialsSettings?.fontColor === color.value && <Check className="h-4 w-4 text-primary-foreground" style={{color: color.value === '#FFFFFF' ? 'black' : 'white'}} />}
                                                    </button>
                                                ))}
                                                <Label htmlFor="social-fg-picker" className="h-8 w-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer" style={{ backgroundColor: socialsSettings?.fontColor && !colorOptions.some(c => c.value === socialsSettings?.fontColor) ? socialsSettings.fontColor : 'transparent' }}><Palette className="h-4 w-4 text-muted-foreground" /><Input id="social-fg-picker" type="color" value={socialsSettings.fontColor || '#000000'} onChange={e => setSocialsSettings(prev => ({...prev, fontColor: e.target.value}))} className="sr-only" /></Label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        { userProfile.role === 'affiliator' && (
                        <AccordionItem value="product-card">
                            <AccordionTrigger className="text-sm font-medium">Pengaturan Kartu Produk</AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div className="grid gap-2">
                                    <Label>Gaya Kartu</Label>
                                    <RadioGroup value={productCardSettings?.style} onValueChange={(value) => setProductCardSettings(prev => ({...prev, style: value as any}))}>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="standard" id="card-standard" /><Label htmlFor="card-standard">Standar (dengan kreator)</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="simple" id="card-simple" /><Label htmlFor="card-simple">Sederhana</Label></div>
                                    </RadioGroup>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Perataan Teks</Label>
                                    <RadioGroup value={productCardSettings?.textAlign} onValueChange={(value) => setProductCardSettings(prev => ({...prev, textAlign: value as any}))}>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="left" id="text-left" /><Label htmlFor="text-left">Kiri</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="center" id="text-center" /><Label htmlFor="text-center">Tengah</Label></div>
                                    </RadioGroup>
                                </div>
                                 <div className="grid gap-2">
                                    <Label>Rasio Aspek Gambar</Label>
                                    <RadioGroup value={productCardSettings?.imageAspectRatio} onValueChange={(value) => setProductCardSettings(prev => ({...prev, imageAspectRatio: value as any}))}>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="3/2" id="aspect-3-2" /><Label htmlFor="aspect-3-2">3:2 (Lanskap)</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="4/3" id="aspect-4-3" /><Label htmlFor="aspect-4-3">4:3 (Lanskap)</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="1/1" id="aspect-1-1" /><Label htmlFor="aspect-1-1">1:1 (Persegi)</Label></div>
                                    </RadioGroup>
                                </div>
                                 <div className="grid gap-2">
                                    <Label>Gaya Tombol Beli</Label>
                                    <RadioGroup value={productCardSettings?.buttonStyle} onValueChange={(value) => setProductCardSettings(prev => ({...prev, buttonStyle: value as any}))}>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="fill" id="button-fill" /><Label htmlFor="button-fill">Isi (Fill)</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="outline" id="button-outline" /><Label htmlFor="button-outline">Garis (Outline)</Label></div>
                                    </RadioGroup>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        )}
                        { userProfile.role === 'affiliator' && (
                        <AccordionItem value="category-buttons">
                             <AccordionTrigger className="text-sm font-medium">Pengaturan Tombol Kategori</AccordionTrigger>
                             <AccordionContent className="pt-4 space-y-4">
                                <div className="grid gap-2">
                                    <Label>Gaya Tombol</Label>
                                    <RadioGroup value={categorySettings?.style} onValueChange={(value) => setCategorySettings(prev => ({...prev, style: value as any}))}>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="default" id="cat-style-default" /><Label htmlFor="cat-style-default">Isi (Default)</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="outline" id="cat-style-outline" /><Label htmlFor="cat-style-outline">Garis (Outline)</Label></div>
                                    </RadioGroup>
                                </div>
                                 <div className="grid gap-2">
                                    <Label>Ukuran Tombol</Label>
                                    <RadioGroup value={categorySettings?.size} onValueChange={(value) => setCategorySettings(prev => ({...prev, size: value as any}))}>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="sm" id="cat-size-sm" /><Label htmlFor="cat-size-sm">Kecil</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="default" id="cat-size-md" /><Label htmlFor="cat-size-md">Sedang</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="lg" id="cat-size-lg" /><Label htmlFor="cat-size-lg">Besar</Label></div>
                                    </RadioGroup>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Bentuk Tombol</Label>
                                    <RadioGroup value={categorySettings?.shape} onValueChange={(value) => setCategorySettings(prev => ({...prev, shape: value as any}))}>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="default" id="cat-shape-default" /><Label htmlFor="cat-shape-default">Standar</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="pill" id="cat-shape-pill" /><Label htmlFor="cat-shape-pill">Pil</Label></div>
                                    </RadioGroup>
                                </div>
                                <div className="grid gap-4 pt-2">
                                    <div>
                                        <Label className="text-xs font-normal text-muted-foreground mb-2 block">Warna Teks Tombol</Label>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {colorOptions.map(c => <button key={`cat-fg-${c.value}`} type="button" onClick={() => setCategorySettings(p => ({...p, color: c.value}))} className={cn("h-8 w-8 rounded-full border-2 border-border", categorySettings?.color === c.value ? 'border-primary ring-2 ring-primary ring-offset-2' : '')} style={{backgroundColor: c.value||'transparent'}}><span className="sr-only">{c.name}</span></button>)}
                                            <Label htmlFor="cat-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer"><Palette className="h-4 w-4 text-muted-foreground" /><Input id="cat-color-picker" type="color" value={categorySettings?.color || '#000000'} onChange={e => setCategorySettings(p => ({...p, color: e.target.value}))} className="sr-only" /></Label>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs font-normal text-muted-foreground mb-2 block">Warna Latar Tombol</Label>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {colorOptions.map(c => <button key={`cat-bg-${c.value}`} type="button" onClick={() => setCategorySettings(p => ({...p, backgroundColor: c.value}))} className={cn("h-8 w-8 rounded-full border-2 border-border", categorySettings?.backgroundColor === c.value ? 'border-primary ring-2 ring-primary ring-offset-2' : '')} style={{backgroundColor: c.value||'transparent'}}><span className="sr-only">{c.name}</span></button>)}
                                            <Label htmlFor="cat-bg-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer"><Palette className="h-4 w-4 text-muted-foreground" /><Input id="cat-bg-color-picker" type="color" value={categorySettings?.backgroundColor || '#000000'} onChange={e => setCategorySettings(p => ({...p, backgroundColor: e.target.value}))} className="sr-only" /></Label>
                                        </div>
                                    </div>
                                     <div>
                                        <Label className="text-xs font-normal text-muted-foreground mb-2 block">Warna Teks Tombol Aktif</Label>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {colorOptions.map(c => <button key={`cat-active-fg-${c.value}`} type="button" onClick={() => setCategorySettings(p => ({...p, activeColor: c.value}))} className={cn("h-8 w-8 rounded-full border-2 border-border", categorySettings?.activeColor === c.value ? 'border-primary ring-2 ring-primary ring-offset-2' : '')} style={{backgroundColor: c.value||'transparent'}}><span className="sr-only">{c.name}</span></button>)}
                                            <Label htmlFor="cat-active-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer"><Palette className="h-4 w-4 text-muted-foreground" /><Input id="cat-active-color-picker" type="color" value={categorySettings?.activeColor || '#000000'} onChange={e => setCategorySettings(p => ({...p, activeColor: e.target.value}))} className="sr-only" /></Label>
                                        </div>
                                    </div>
                                     <div>
                                        <Label className="text-xs font-normal text-muted-foreground mb-2 block">Warna Latar Tombol Aktif</Label>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {colorOptions.map(c => <button key={`cat-active-bg-${c.value}`} type="button" onClick={() => setCategorySettings(p => ({...p, activeBackgroundColor: c.value}))} className={cn("h-8 w-8 rounded-full border-2 border-border", categorySettings?.activeBackgroundColor === c.value ? 'border-primary ring-2 ring-primary ring-offset-2' : '')} style={{backgroundColor: c.value||'transparent'}}><span className="sr-only">{c.name}</span></button>)}
                                            <Label htmlFor="cat-active-bg-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer"><Palette className="h-4 w-4 text-muted-foreground" /><Input id="cat-active-bg-color-picker" type="color" value={categorySettings?.activeBackgroundColor || '#000000'} onChange={e => setCategorySettings(p => ({...p, activeBackgroundColor: e.target.value}))} className="sr-only" /></Label>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        )}
                    </Accordion>
                </CardContent>
                <CardFooter>
                     <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Menyimpan...</> : "Simpan Tampilan Profil"}
                    </Button>
                </CardFooter>
            </Card>
            
            <div className="hidden lg:block">
                <div className="sticky top-20">
                    <div className="flex items-center justify-center">
                        <div className="relative mx-auto border-zinc-800 dark:border-zinc-800 bg-zinc-800 border-[14px] rounded-[2.5rem] h-[712px] w-[352px] shadow-2xl">
                            <div className="h-[32px] w-[3px] bg-zinc-800 dark:bg-zinc-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                            <div className="h-[46px] w-[3px] bg-zinc-800 dark:bg-zinc-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                            <div className="h-[46px] w-[3px] bg-zinc-800 dark:bg-zinc-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                            <div className="h-[64px] w-[3px] bg-zinc-800 dark:bg-zinc-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-background">
                                <ProfilePreview 
                                    profile={userProfile}
                                    products={products}
                                    bio={bio}
                                    socials={socials}
                                    socialsSettings={socialsSettings}
                                    headerColor={headerColor}
                                    headerImagePreview={headerImagePreview}
                                    headerVideoPreview={headerVideoPreview}
                                    showHeaderGradient={showHeaderGradient}
                                    profileBackgroundColor={profileBackgroundColor}
                                    profileBackgroundImagePreview={profileBackgroundImagePreview}
                                    profileTitleFont={profileTitleFont}
                                    profileTitleFontColor={profileTitleFontColor}
                                    profileBodyFont={profileBodyFont}
                                    profileBodyFontColor={profileBodyFontColor}
                                    productCardSettings={productCardSettings}
                                    categorySettings={categorySettings}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
