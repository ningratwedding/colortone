
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

export default function AccountSettingsPage() {
    const user = users[2]; // Mock user data

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Pengaturan Akun</CardTitle>
                <CardDescription>Kelola informasi profil dan detail akun Anda.</CardDescription>
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
                    <Label htmlFor="password">Kata Sandi Baru</Label>
                    <Input id="password" type="password" placeholder="Kosongkan jika tidak ingin mengubah" />
                </div>
                <Button>Simpan Perubahan</Button>
            </CardContent>
        </Card>
    )
}
