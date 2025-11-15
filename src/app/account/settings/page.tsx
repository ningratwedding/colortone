
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
import { doc, updateDoc, serverTimestamp, type Timestamp, getDocs, query, collection, where, limit } from 'firebase/firestore';
import { useFirestore, useStorage } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef, useMemo } from 'react';
import { uploadFile } from '@/firebase/storage/actions';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { PartyPopper, Loader2, Star } from 'lucide-react';
import { addDays, format, differenceInDays } from 'date-fns';
import { id as fnsIdLocale } from 'date-fns/locale';

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
    const [isRequestingPro, setIsRequestingPro] = useState(false);

    // Name change cooldown logic
    const [canChangeName, setCanChangeName] = useState(true);
    const [nextChangeDate, setNextChangeDate] = useState('');
    const NAME_CHANGE_COOLDOWN_DAYS = 14;

    
    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name);
            setFullName(userProfile.fullName || '');
            setPhoneNumber(userProfile.phoneNumber || '');
            setAvatarPreview(userProfile.avatarUrl);

            // Check name change cooldown
            if (userProfile.nameLastUpdatedAt) {
                const lastUpdate = (userProfile.nameLastUpdatedAt as Timestamp).toDate();
                const nextAvailableDate = addDays(lastUpdate, NAME_CHANGE_COOLDOWN_DAYS);
                const daysRemaining = differenceInDays(nextAvailableDate, new Date());

                if (daysRemaining > 0) {
                    setCanChangeName(false);
                    setNextChangeDate(format(nextAvailableDate, "d MMMM yyyy", { locale: fnsIdLocale }));
                } else {
                    setCanChangeName(true);
                }
            } else {
                setCanChangeName(true);
            }
        }
    }, [userProfile]);

    const handleSaveChanges = async () => {
        if (!userProfileRef || !userProfile || !user || !storage || !firestore) return;
        setIsSaving(true);
        try {
            let newAvatarUrl = userProfile.avatarUrl;

            if (avatarFile) {
                toast({ title: 'Mengompres dan mengunggah foto profil...' });
                newAvatarUrl = await uploadFile(storage, avatarFile, user.uid, 'avatars');
            }

            const updatedData: Partial<UserProfile> & { nameLastUpdatedAt?: any } = {
                fullName: fullName,
                phoneNumber: phoneNumber,
                avatarUrl: newAvatarUrl,
            };

            // Only update name and timestamp if the name has changed and is allowed
            if (name !== userProfile.name) {
                if (!canChangeName) {
                    toast({
                        variant: 'destructive',
                        title: 'Perubahan Nama Tidak Diizinkan',
                        description: `Anda baru dapat mengubah nama lagi pada ${nextChangeDate}.`,
                    });
                    setIsSaving(false);
                    return;
                }
                
                // Check if new slug already exists
                const newSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                if (newSlug !== userProfile.slug) {
                    const usersRef = collection(firestore, 'users');
                    const q = query(usersRef, where('slug', '==', newSlug), limit(1));
                    const slugSnapshot = await getDocs(q);
                    if (!slugSnapshot.empty) {
                        toast({ variant: 'destructive', title: 'Nama Profil Sudah Ada', description: `Nama "${name}" sudah digunakan. Silakan pilih yang lain.`});
                        setIsSaving(false);
                        return;
                    }
                    updatedData.slug = newSlug;
                }

                updatedData.name = name;
                updatedData.nameLastUpdatedAt = serverTimestamp();
            }

            await updateDoc(userProfileRef, updatedData);

            if (user && (updatedData.name || newAvatarUrl)) {
                 await updateAuthProfile(user, {
                    displayName: updatedData.name || user.displayName,
                    photoURL: newAvatarUrl || user.photoURL,
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
    
    const handleRequestPro = () => {
        setIsRequestingPro(true);
        // Simulate an API call
        setTimeout(() => {
            toast({
                title: "Permintaan Terkirim!",
                description: "Tim kami akan segera menghubungi Anda melalui email untuk proses selanjutnya. Terima kasih!",
                duration: 8000,
            });
            setIsRequestingPro(false);
        }, 1000);
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
    const planExpiryDateFormatted = userProfile.planExpiryDate 
        ? format((userProfile.planExpiryDate as Timestamp).toDate(), "d MMMM yyyy", { locale: fnsIdLocale }) 
        : '';


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
                        <Input id="profilename" value={name} onChange={(e) => setName(e.target.value)} disabled={!canChangeName} />
                        {!canChangeName ? (
                            <p className="text-xs text-destructive">
                                Anda baru dapat mengubah nama profil lagi pada {nextChangeDate}.
                            </p>
                        ) : (
                             <p className="text-xs text-muted-foreground">Ini adalah nama yang akan muncul di profil publik Anda.</p>
                        )}
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
                     <Button onClick={handleSaveChanges} disabled={isSaving || !canChangeName}>
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Menyimpan...</> : "Simpan Perubahan Profil"}
                    </Button>
                </CardFooter>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Paket Langganan</CardTitle>
                    <CardDescription>
                        {userProfile.plan === 'pro' 
                            ? `Anda sedang berlangganan paket Pro. Langganan Anda akan berakhir pada ${planExpiryDateFormatted}.`
                            : "Tingkatkan akun Anda ke Pro untuk membuka fitur eksklusif."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {userProfile.plan === 'free' && (
                        <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                            <li className="flex items-center"><Star className="h-4 w-4 mr-2 text-primary" />Kustomisasi tampilan profil tanpa batas.</li>
                            <li className="flex items-center"><Star className="h-4 w-4 mr-2 text-primary" />Analitik pengunjung profil yang mendalam.</li>
                            <li className="flex items-center"><Star className="h-4 w-4 mr-2 text-primary" />Prioritas dukungan pelanggan.</li>
                        </ul>
                    )}
                </CardContent>
                <CardFooter>
                    {userProfile.plan === 'free' && (
                        <Button onClick={handleRequestPro} disabled={isRequestingPro}>
                             {isRequestingPro ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Memproses...</> : "Upgrade ke Pro"}
                        </Button>
                    )}
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
