

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
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useMemo } from 'react';
import { Loader2, PlusCircle, Trash2, Globe, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

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
    { name: 'Default', value: '' },
];


function ProfilePreview({
  profile,
  bio,
  socials,
  headerColor,
  profileBackgroundColor
}: {
  profile: UserProfile;
  bio: string;
  socials: UserProfile['socials'];
  headerColor: string | undefined;
  profileBackgroundColor: string | undefined;
}) {
  const displayName = profile.fullName || profile.name;
  
  const headerGradientStyle = profileBackgroundColor
    ? { backgroundImage: `linear-gradient(to top, ${profileBackgroundColor} 0%, rgba(0,0,0,0) 100%)` }
    : {};

  return (
    <div className="w-full h-full overflow-y-auto" style={{ backgroundColor: profileBackgroundColor || undefined }}>
        <div
        className="relative h-32 md:h-48 rounded-b-lg overflow-hidden"
        style={{ backgroundColor: headerColor }}
        >
            {profile.headerImageUrl ? (
                <Image
                    src={profile.headerImageUrl}
                    alt="Header background"
                    fill
                    className="object-cover"
                    data-ai-hint={profile.headerImageHint}
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
            <div 
                className={cn("absolute inset-0", !profileBackgroundColor && "bg-gradient-to-t from-background via-background/50 to-transparent")} 
                style={headerGradientStyle}
            />
        </div>
        <div className="px-4">
        <header className="flex flex-col items-center gap-4 mb-6 text-center -mt-12 md:-mt-16 relative z-10">
        <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={profile.avatarUrl || undefined} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-xl font-bold font-headline">{displayName}</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{bio || "Bio Anda akan muncul di sini."}</p>
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
    const { toast } = useToast();

    const userProfileRef = useMemo(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);
    
    const [bio, setBio] = useState('');
    const [socials, setSocials] = useState<UserProfile['socials']>({});
    const [headerColor, setHeaderColor] = useState<string | undefined>('');
    const [profileBackgroundColor, setProfileBackgroundColor] = useState<string | undefined>('');

    const [isSaving, setIsSaving] = useState(false);

    // Dialog States
    const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
    const [newSocialPlatform, setNewSocialPlatform] = useState<SocialPlatform | ''>('');
    const [newSocialUsername, setNewSocialUsername] = useState('');
    const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
    const [colorDialogTarget, setColorDialogTarget] = useState<'header' | 'page' | null>(null);
    
    useEffect(() => {
        if (userProfile) {
            setBio(userProfile.bio || '');
            setSocials(userProfile.socials || {});
            setHeaderColor(userProfile.headerColor || '');
            setProfileBackgroundColor(userProfile.profileBackgroundColor || '');
        }
    }, [userProfile]);

    const handleSaveChanges = async () => {
        if (!userProfileRef || !user) return;
        setIsSaving(true);
        try {
            const updatedData: Partial<UserProfile> = {
                bio: bio,
                socials: socials,
                headerColor: headerColor,
                profileBackgroundColor: profileBackgroundColor,
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
            setIsColorDialogOpen(false); // Close color dialog on save
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
    
    const handleOpenColorDialog = (target: 'header' | 'page') => {
        setColorDialogTarget(target);
        setIsColorDialogOpen(true);
    }
    
    const handleSelectColor = (color: string) => {
        if (colorDialogTarget === 'header') {
            setHeaderColor(color);
        } else if (colorDialogTarget === 'page') {
            setProfileBackgroundColor(color);
        }
    }

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
                <CardContent className="space-y-6 pt-6">
                    <div className="grid gap-2">
                        <Label htmlFor="bio">Bio Profil Publik</Label>
                        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Ceritakan sedikit tentang diri Anda" className="min-h-[100px]" />
                    </div>
                    <div className="grid gap-4">
                        <Label>Tautan Sosial & Situs Web</Label>
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
                    <div className="grid gap-2">
                        <Label>Kustomisasi Latar</Label>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" onClick={() => handleOpenColorDialog('header')}>Ubah Latar Header</Button>
                            <Button variant="outline" onClick={() => handleOpenColorDialog('page')}>Ubah Latar Halaman</Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                     <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Menyimpan...</> : "Simpan Tampilan Profil"}
                    </Button>
                </CardFooter>
            </Card>
            
            <div className="hidden lg:flex items-center justify-center">
                <div className="relative mx-auto border-zinc-800 dark:border-zinc-800 bg-zinc-800 border-[14px] rounded-[2.5rem] h-[712px] w-[352px]">
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
                            profileBackgroundColor={profileBackgroundColor}
                        />
                    </div>
                </div>
            </div>

            <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pilih Warna Latar {colorDialogTarget === 'header' ? 'Header' : 'Halaman'}</DialogTitle>
                        <DialogDescription>Pilih warna solid untuk latar belakang Anda.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-5 gap-3 py-4">
                        {colorOptions.map((color) => (
                            <button 
                                key={color.value}
                                type="button"
                                onClick={() => handleSelectColor(color.value)}
                                className={cn(
                                    "h-12 w-12 rounded-full border-2 transition-transform hover:scale-110",
                                    (colorDialogTarget === 'header' && headerColor === color.value) || (colorDialogTarget === 'page' && profileBackgroundColor === color.value)
                                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                                      : 'border-transparent',
                                    color.value === '' && 'border-muted-foreground border-dashed'
                                )}
                                style={{ backgroundColor: color.value || 'transparent' }}
                                aria-label={`Pilih warna ${color.name}`}
                            >
                                {((colorDialogTarget === 'header' && headerColor === color.value) ||
                                (colorDialogTarget === 'page' && profileBackgroundColor === color.value)) &&
                                <Check className="h-6 w-6 text-white" />}
                                {color.value === '' && <span className="text-xs text-muted-foreground">Auto</span>}
                            </button>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsColorDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Menyimpan...</> : "Simpan Pilihan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
