

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
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useStorage } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Loader2, PlusCircle, Trash2, Globe, Check, Image as ImageIcon, Palette } from 'lucide-react';
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16.5 6.5a4.5 4.5 0 1 0 5.5 5.5v.05" />
      <path d="M12 12V2" />
      <path d="M12 18.5a6.5 6.5 0 1 0 0-13V2" />
      <path d="M12 12a6.5 6.5 0 1 0 6.5 6.5" />
    </svg>
  );
}

const socialIcons = {
  instagram: <InstagramIcon className="h-5 w-5" />,
  facebook: <FacebookIcon className="h-5 w-5" />,
  tiktok: <TikTokIcon className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />
};
type SocialPlatform = keyof typeof socialIcons;

const colorOptions = [
    { name: 'Default', value: '' },
    { name: 'Abu-abu', value: '#6B7280' },
    { name: 'Merah', value: '#EF4444' },
    { name: 'Oranye', value: '#F97316' },
    { name: 'Kuning', value: '#EAB308' },
    { name: 'Hijau', value: '#22C55E' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Biru', value: '#3B82F6' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Ungu', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
];


function ProfilePreview({
  profile,
  bio,
  socials,
  headerColor,
  headerImagePreview,
  showHeaderGradient,
  profileBackgroundColor,
  profileBackgroundImagePreview,
  profileTitleFontColor,
  profileBodyFontColor,
  avatarRingColor,
  showAvatarRing,
}: {
  profile: UserProfile;
  bio: string;
  socials: UserProfile['socials'];
  headerColor: string | undefined;
  headerImagePreview: string | null;
  showHeaderGradient: boolean;
  profileBackgroundColor: string | undefined;
  profileBackgroundImagePreview: string | null;
  profileTitleFontColor: string | undefined;
  profileBodyFontColor: string | undefined;
  avatarRingColor: string | undefined;
  showAvatarRing: boolean;
}) {
  const displayName = profile.fullName || profile.name;
  
  const headerGradientStyle = profileBackgroundColor
    ? { backgroundImage: `linear-gradient(to top, ${profileBackgroundColor} 0%, rgba(0,0,0,0) 100%)` }
    : {};
    
  const pageBackgroundStyle = profileBackgroundImagePreview 
    ? { backgroundImage: `url(${profileBackgroundImagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: profileBackgroundColor || undefined };

  return (
    <div className="w-full h-full overflow-y-auto" style={pageBackgroundStyle}>
        <div
        className="relative h-32 md:h-48 rounded-b-lg overflow-hidden"
        style={{ backgroundColor: headerColor }}
        >
            {headerImagePreview ? (
                <Image
                    src={headerImagePreview}
                    alt="Header background"
                    fill
                    className="object-cover"
                />
            ) : !headerColor && (
                <Image
                    src={`https://picsum.photos/seed/${profile.id}/1200/400`}
                    alt="Header background"
                    fill
                    className="object-cover"
                    data-ai-hint="header background"
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
        <header className="flex flex-col items-center gap-4 mb-6 text-center -mt-12 md:-mt-16 relative z-10">
        <Avatar 
          className={cn(
            "h-20 w-20 md:h-24 md:w-24 border-4 border-background",
            showAvatarRing && 'ring-2'
          )}
          style={{ borderColor: profileBackgroundColor || undefined, ringColor: avatarRingColor || undefined }}
        >
            <AvatarImage src={profile.avatarUrl || undefined} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-xl font-bold font-headline" style={{ color: profileTitleFontColor || undefined }}>{displayName}</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto" style={{ color: profileBodyFontColor || undefined }}>{bio || "Bio Anda akan muncul di sini."}</p>
            {socials && Object.keys(socials).length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-3">
                {Object.entries(socials).map(([platform, username]) => (
                <Link key={platform} href={platform === 'website' ? username as string : `https://www.${platform}.com/${username}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    {socialIcons[platform as SocialPlatform]}
                    <span className="sr-only">{platform}</span>
                </Link>
                ))}
            </div>
            )}
        </div>
        </header>
            <p className="text-xs text-center text-muted-foreground">(Ini adalah pratinjau)</p>
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
    const pageImageInputRef = useRef<HTMLInputElement>(null);

    const userProfileRef = useMemo(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);
    
    const [bio, setBio] = useState('');
    const [socials, setSocials] = useState<UserProfile['socials']>({});
    const [headerColor, setHeaderColor] = useState<string | undefined>('');
    const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
    const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(null);
    const [showHeaderGradient, setShowHeaderGradient] = useState(true);
    const [profileBackgroundColor, setProfileBackgroundColor] = useState<string | undefined>('');
    const [profileBackgroundImageFile, setProfileBackgroundImageFile] = useState<File | null>(null);
    const [profileBackgroundImagePreview, setProfileBackgroundImagePreview] = useState<string | null>(null);
    const [profileTitleFontColor, setProfileTitleFontColor] = useState<string | undefined>('');
    const [profileBodyFontColor, setProfileBodyFontColor] = useState<string | undefined>('');
    const [avatarRingColor, setAvatarRingColor] = useState<string | undefined>('');
    const [showAvatarRing, setShowAvatarRing] = useState(true);


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
            setShowHeaderGradient(userProfile.showHeaderGradient ?? true);
            setProfileBackgroundColor(userProfile.profileBackgroundColor || '');
            setProfileBackgroundImagePreview(userProfile.profileBackgroundImageUrl || null);
            setProfileTitleFontColor(userProfile.profileTitleFontColor || '');
            setProfileBodyFontColor(userProfile.profileBodyFontColor || '');
            setAvatarRingColor(userProfile.avatarRingColor || '');
            setShowAvatarRing(userProfile.showAvatarRing ?? true);
        }
    }, [userProfile]);
    
    const handleHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setHeaderImageFile(file);
            setHeaderImagePreview(URL.createObjectURL(file));
        }
    };
    
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
            let newHeaderImageUrl = userProfile?.headerImageUrl;
            if (headerImageFile) {
                toast({ title: 'Mengunggah gambar header...' });
                newHeaderImageUrl = await uploadFile(storage, headerImageFile, user.uid, 'profile_headers');
            }
            
            let newProfileBackgroundImageUrl = userProfile?.profileBackgroundImageUrl;
            if (profileBackgroundImageFile) {
                toast({ title: 'Mengunggah gambar latar...' });
                newProfileBackgroundImageUrl = await uploadFile(storage, profileBackgroundImageFile, user.uid, 'profile_backgrounds');
            }

            const updatedData: Partial<UserProfile> = {
                bio: bio,
                socials: socials,
                headerColor: headerColor,
                headerImageUrl: newHeaderImageUrl,
                showHeaderGradient: showHeaderGradient,
                profileBackgroundColor: profileBackgroundColor,
                profileBackgroundImageUrl: newProfileBackgroundImageUrl,
                profileTitleFontColor: profileTitleFontColor,
                profileBodyFontColor: profileBodyFontColor,
                avatarRingColor: avatarRingColor,
                showAvatarRing: showAvatarRing,
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

    const loading = userLoading || profileLoading;

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
    
    const showPublicProfileSettings = userProfile.role === 'kreator' || userProfile.role === 'affiliator';

    if (!showPublicProfileSettings) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tampilan Profil Publik</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Pengaturan ini hanya tersedia untuk Kreator dan Afiliator.</p>
                </CardContent>
            </Card>
        )
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
                        <AccordionItem value="avatar-ring">
                            <AccordionTrigger className="text-sm font-medium">Bingkai Avatar</AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div>
                                    <Label className="text-xs font-normal text-muted-foreground mb-2 block">Warna Bingkai</Label>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={`avatar-ring-${color.value}`}
                                                type="button"
                                                onClick={() => setAvatarRingColor(color.value)}
                                                className={cn(
                                                    "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                                                    avatarRingColor === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent',
                                                    color.value === '' && 'border-muted-foreground border-dashed'
                                                )}
                                                style={{ backgroundColor: color.value || 'transparent' }}
                                                aria-label={`Pilih warna bingkai avatar ${color.name}`}
                                            >
                                                {avatarRingColor === color.value && <Check className="h-4 w-4 text-white" />}
                                                {color.value === '' && <span className="text-xs text-muted-foreground">A</span>}
                                            </button>
                                        ))}
                                        <Label htmlFor="avatar-ring-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-transform hover:scale-110" style={{ backgroundColor: avatarRingColor && !colorOptions.some(c => c.value === avatarRingColor) ? avatarRingColor : 'transparent' }}>
                                            <Palette className="h-4 w-4 text-muted-foreground" />
                                            <Input id="avatar-ring-color-picker" type="color" value={avatarRingColor} onChange={e => setAvatarRingColor(e.target.value)} className="sr-only" />
                                        </Label>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                        id="avatar-ring-switch"
                                        checked={showAvatarRing}
                                        onCheckedChange={setShowAvatarRing}
                                    />
                                    <Label htmlFor="avatar-ring-switch">Tampilkan Bingkai Avatar</Label>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="header-background">
                            <AccordionTrigger className="text-sm font-medium">Latar Header</AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div className="grid gap-2">
                                    <Label>Gambar Latar</Label>
                                    <div className="flex items-center gap-4">
                                        {headerImagePreview && <Image src={headerImagePreview} alt="Pratinjau Header" width={128} height={64} className="rounded-md object-cover aspect-[2/1] bg-muted" />}
                                        <div className="flex-1">
                                            <Input type="file" ref={headerImageInputRef} className="hidden" accept="image/*" onChange={handleHeaderImageChange} />
                                            <Button type="button" variant="outline" onClick={() => headerImageInputRef.current?.click()}>
                                            <ImageIcon className="mr-2 h-4 w-4" /> {headerImagePreview ? 'Ganti Gambar' : 'Pilih Gambar'}
                                            </Button>
                                            <p className="text-xs text-muted-foreground mt-1">Rasio 3:1 atau 4:1 disarankan.</p>
                                        </div>
                                    </div>
                                </div>
                                 <div className="grid gap-2">
                                    <Label>Warna Latar (pengganti jika tidak ada gambar)</Label>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {colorOptions.map((color) => (
                                            <button 
                                                key={`header-${color.value}`}
                                                type="button"
                                                onClick={() => setHeaderColor(color.value)}
                                                className={cn(
                                                    "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                                                    headerColor === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent',
                                                    color.value === '' && 'border-muted-foreground border-dashed'
                                                )}
                                                style={{ backgroundColor: color.value || 'transparent' }}
                                                aria-label={`Pilih warna header ${color.name}`}
                                            >
                                                {headerColor === color.value && <Check className="h-4 w-4 text-white" />}
                                                {color.value === '' && <span className="text-xs text-muted-foreground">A</span>}
                                            </button>
                                        ))}
                                        <Label htmlFor="header-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-transform hover:scale-110" style={{ backgroundColor: headerColor && !colorOptions.some(c => c.value === headerColor) ? headerColor : 'transparent' }}>
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
                                                    "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                                                    profileBackgroundColor === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent',
                                                    color.value === '' && 'border-muted-foreground border-dashed'
                                                )}
                                                style={{ backgroundColor: color.value || 'transparent' }}
                                                aria-label={`Pilih warna halaman ${color.name}`}
                                            >
                                                {profileBackgroundColor === color.value && <Check className="h-4 w-4 text-white" />}
                                                {color.value === '' && <span className="text-xs text-muted-foreground">A</span>}
                                            </button>
                                        ))}
                                        <Label htmlFor="page-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-transform hover:scale-110" style={{ backgroundColor: profileBackgroundColor && !colorOptions.some(c => c.value === profileBackgroundColor) ? profileBackgroundColor : 'transparent' }}>
                                            <Palette className="h-4 w-4 text-muted-foreground" />
                                            <Input id="page-color-picker" type="color" value={profileBackgroundColor} onChange={e => setProfileBackgroundColor(e.target.value)} className="sr-only" />
                                        </Label>
                                    </div>
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
                                                    "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                                                    profileTitleFontColor === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent',
                                                    color.value === '' && 'border-muted-foreground border-dashed'
                                                )}
                                                style={{ backgroundColor: color.value || 'transparent' }}
                                                aria-label={`Pilih warna font nama ${color.name}`}
                                            >
                                                {profileTitleFontColor === color.value && <Check className="h-4 w-4 text-white" />}
                                                {color.value === '' && <span className="text-xs text-muted-foreground">A</span>}
                                            </button>
                                        ))}
                                        <Label htmlFor="title-font-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-transform hover:scale-110" style={{ backgroundColor: profileTitleFontColor && !colorOptions.some(c => c.value === profileTitleFontColor) ? profileTitleFontColor : 'transparent' }}>
                                            <Palette className="h-4 w-4 text-muted-foreground" />
                                            <Input id="title-font-color-picker" type="color" value={profileTitleFontColor} onChange={e => setProfileTitleFontColor(e.target.value)} className="sr-only" />
                                        </Label>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs font-normal text-muted-foreground mb-2 block">Warna Font Bio</Label>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {colorOptions.map((color) => (
                                            <button 
                                                key={`body-font-${color.value}`}
                                                type="button"
                                                onClick={() => setProfileBodyFontColor(color.value)}
                                                className={cn(
                                                    "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                                                    profileBodyFontColor === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent',
                                                    color.value === '' && 'border-muted-foreground border-dashed'
                                                )}
                                                style={{ backgroundColor: color.value || 'transparent' }}
                                                aria-label={`Pilih warna font bio ${color.name}`}
                                            >
                                                {profileBodyFontColor === color.value && <Check className="h-4 w-4 text-white" />}
                                                {color.value === '' && <span className="text-xs text-muted-foreground">A</span>}
                                            </button>
                                        ))}
                                         <Label htmlFor="body-font-color-picker" className="h-8 w-8 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-transform hover:scale-110" style={{ backgroundColor: profileBodyFontColor && !colorOptions.some(c => c.value === profileBodyFontColor) ? profileBodyFontColor : 'transparent' }}>
                                            <Palette className="h-4 w-4 text-muted-foreground" />
                                            <Input id="body-font-color-picker" type="color" value={profileBodyFontColor} onChange={e => setProfileBodyFontColor(e.target.value)} className="sr-only" />
                                        </Label>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
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
                                    bio={bio}
                                    socials={socials}
                                    headerColor={headerColor}
                                    headerImagePreview={headerImagePreview}
                                    showHeaderGradient={showHeaderGradient}
                                    profileBackgroundColor={profileBackgroundColor}
                                    profileBackgroundImagePreview={profileBackgroundImagePreview}
                                    profileTitleFontColor={profileTitleFontColor}
                                    profileBodyFontColor={profileBodyFontColor}
                                    avatarRingColor={avatarRingColor}
                                    showAvatarRing={showAvatarRing}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
