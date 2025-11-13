
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useStorage } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef, useMemo } from 'react';
import { uploadFile } from '@/firebase/storage/actions';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { PartyPopper, Copy, Loader2, PlusCircle, Trash2, Instagram, Facebook, Globe } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

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


export default function AccountSettingsPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const storage = useStorage();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const userProfileRef = useMemo(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);
    
    const [name, setName] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bio, setBio] = useState('');
    const [socials, setSocials] = useState<UserProfile['socials']>({});
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isJoiningAffiliate, setIsJoiningAffiliate] = useState(false);

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newSocialPlatform, setNewSocialPlatform] = useState<SocialPlatform | ''>('');
    const [newSocialUsername, setNewSocialUsername] = useState('');
    
    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name);
            setFullName(userProfile.fullName || '');
            setPhoneNumber(userProfile.phoneNumber || '');
            setAvatarPreview(userProfile.avatarUrl);
            setBio(userProfile.bio || '');
            setSocials(userProfile.socials || {});
        }
    }, [userProfile]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveChanges = async () => {
        if (!userProfileRef || !userProfile || !user || !storage) return;
        setIsSaving(true);
        try {
            let newAvatarUrl = userProfile.avatarUrl;

            if (avatarFile) {
                toast({ title: 'Mengompres dan mengunggah foto profil...' });
                newAvatarUrl = await uploadFile(storage, avatarFile, user.uid, 'avatars');
            }

            const updatedData: Partial<UserProfile> = {
                name: name,
                fullName: fullName,
                phoneNumber: phoneNumber,
                avatarUrl: newAvatarUrl,
                bio: bio,
                socials: socials,
            };

            await updateDoc(userProfileRef, updatedData);

            if (user && (name !== user.displayName || newAvatarUrl !== user.photoURL)) {
                 await updateAuthProfile(user, {
                    displayName: name,
                    photoURL: newAvatarUrl,
                });
            }

            toast({
                title: "Profil Diperbarui",
                description: "Perubahan Anda telah berhasil disimpan.",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                variant: "destructive",
                title: "Gagal Menyimpan",
                description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan perubahan.",
            });
        } finally {
            setIsSaving(false);
            setAvatarFile(null); // Clear the file state after saving
        }
    };
    
    const handleJoinAffiliate = async () => {
        if (!userProfileRef) return;
        setIsJoiningAffiliate(true);
        try {
            await updateDoc(userProfileRef, { role: 'affiliator' });
            toast({
                title: 'Selamat Bergabung!',
                description: 'Anda sekarang adalah seorang afiliator. Anda akan diarahkan ke dasbor afiliasi.',
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Gagal Bergabung",
                description: "Terjadi kesalahan. Coba lagi nanti.",
            });
        } finally {
            setIsJoiningAffiliate(false);
        }
    };

    const handleAddSocial = () => {
        if (newSocialPlatform && newSocialUsername) {
        setSocials(prev => ({...prev, [newSocialPlatform]: newSocialUsername}));
        setIsDialogOpen(false);
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
             <div>
                <div className="mb-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-64 mt-2" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-56 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-9 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-9 w-full" />
                        </div>
                            <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-9 w-full" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!userProfile || !user) {
        return <div>Profil tidak ditemukan.</div>
    }
    
    const fallbackName = name || userProfile.name || user.displayName || 'U';
    const showPublicProfileSettings = userProfile.role === 'kreator' || userProfile.role === 'affiliator';

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <h1 className="font-headline text-2xl font-bold">Pengaturan Akun</h1>
                <p className="text-muted-foreground">Kelola informasi profil dan detail akun Anda.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Informasi Profil</CardTitle>
                    <CardDescription>Perbarui foto, nama, dan detail kontak Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <Label>Foto Profil</Label>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={avatarPreview || undefined} alt={name} />
                                <AvatarFallback>{fallbackName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Ubah Foto</Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="profilename">Nama Profil</Label>
                        <Input id="profilename" value={name} onChange={(e) => setName(e.target.value)} />
                        <p className="text-xs text-muted-foreground">Ini adalah nama yang akan muncul di profil publik Anda.</p>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="fullname">Nama Lengkap</Label>
                        <Input id="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                         <p className="text-xs text-muted-foreground">Nama ini digunakan untuk keperluan administratif dan tidak akan ditampilkan secara publik.</p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input id="email" type="email" value={user.email || ''} readOnly disabled />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="misal: 081234567890" />
                    </div>
                    
                    {showPublicProfileSettings && (
                        <>
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

                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                        </>
                    )}
                </CardContent>
                <CardHeader>
                     <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Menyimpan...</> : "Simpan Perubahan"}
                    </Button>
                </CardHeader>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Program Afiliasi</CardTitle>
                    <CardDescription>
                        {userProfile.role === 'affiliator' 
                            ? 'Anda sekarang adalah mitra afiliasi. Bagikan tautan produk untuk mendapatkan komisi!' 
                            : 'Dapatkan penghasilan dengan membagikan produk dari kreator favorit Anda.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {userProfile.role === 'affiliator' ? (
                        <div className="flex items-center justify-between rounded-lg border p-4 bg-green-50 dark:bg-green-900/20">
                            <div className="flex items-center gap-3">
                                <PartyPopper className="h-6 w-6 text-green-600" />
                                <p className="text-sm font-medium text-green-800 dark:text-green-300">Anda telah terdaftar sebagai mitra afiliasi.</p>
                            </div>
                        </div>
                    ) : (
                        <Button onClick={handleJoinAffiliate} disabled={isJoiningAffiliate}>
                            {isJoiningAffiliate ? 'Memproses...' : 'Gabung Program Afiliasi'}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
