
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { PartyPopper, Loader2 } from 'lucide-react';


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

    const { data: userProfile, loading: profileLoading, error } = useDoc<UserProfile>(userProfileRef);
    
    const [name, setName] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isJoiningAffiliate, setIsJoiningAffiliate] = useState(false);

    
    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name);
            setFullName(userProfile.fullName || '');
            setPhoneNumber(userProfile.phoneNumber || '');
            setAvatarPreview(userProfile.avatarUrl);
        }
    }, [userProfile]);

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

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
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

    if (!userProfile || !user || error) {
        return <div>Profil tidak ditemukan atau terjadi kesalahan.</div>
    }
    
    const fallbackName = name || userProfile.name || user.displayName || 'U';

    return (
        <div className="space-y-6">
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
                </CardContent>
                <CardFooter>
                     <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Menyimpan...</> : "Simpan Perubahan Profil"}
                    </Button>
                </CardFooter>
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
