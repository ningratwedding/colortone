
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
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function AccountSettingsPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const userProfileRef = user ? doc(firestore, 'users', user.uid) : null;
    const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);
    
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name);
        }
    }, [userProfile]);

    const handleSaveChanges = async () => {
        if (!userProfileRef || !userProfile) return;
        setIsSaving(true);
        try {
            await updateDoc(userProfileRef, {
                name: name,
            });
            toast({
                title: "Profil Diperbarui",
                description: "Perubahan Anda telah berhasil disimpan.",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                variant: "destructive",
                title: "Gagal Menyimpan",
                description: "Terjadi kesalahan saat menyimpan perubahan.",
            });
        } finally {
            setIsSaving(false);
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
                 <Tabs defaultValue="profile">
                    <TabsList className="grid w-full grid-cols-2 max-w-sm">
                        <TabsTrigger value="profile">Profil</TabsTrigger>
                        <TabsTrigger value="security">Keamanan</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-56 mt-2" />
                            </CardHeader>
                            <CardContent className="space-y-6">
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
                                <Skeleton className="h-10 w-32" />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        )
    }

    if (!userProfile) {
        return <div>Profil tidak ditemukan.</div>
    }

    return (
        <div>
            <div className="mb-4">
                <h1 className="font-headline text-2xl font-bold">Pengaturan Akun</h1>
                <p className="text-muted-foreground">Kelola informasi profil dan detail akun Anda.</p>
            </div>
             <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-2 max-w-sm">
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="security">Keamanan</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Profil</CardTitle>
                            <CardDescription>Perbarui foto, nama, dan detail kontak Anda.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Foto Profil</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={userProfile.avatarUrl} data-ai-hint={userProfile.avatarHint} />
                                        <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">Ubah Foto</Button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fullname">Nama Lengkap</Label>
                                <Input id="fullname" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input id="email" type="email" defaultValue={user.email || ''} readOnly disabled />
                            </div>
                             <Button onClick={handleSaveChanges} disabled={isSaving}>
                                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="security">
                     <Card>
                        <CardHeader>
                            <CardTitle>Keamanan</CardTitle>
                            <CardDescription>Ubah kata sandi Anda.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid gap-2">
                                <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="new-password">Kata Sandi Baru</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                             <Button>Ubah Kata Sandi</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
