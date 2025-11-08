
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
import { users } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AccountSettingsPage() {
    const user = users[2]; // Mock user data

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
                                        <AvatarImage src={user.avatar.imageUrl} data-ai-hint={user.avatar.imageHint} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">Ubah Foto</Button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fullname">Nama Lengkap</Label>
                                <Input id="fullname" defaultValue={user.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input id="email" type="email" defaultValue="dewi.lestari@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                                <Input id="whatsapp" type="tel" defaultValue="+6287654321098" />
                            </div>
                             <Button>Simpan Perubahan</Button>
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
