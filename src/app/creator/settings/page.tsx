
'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/data';
import Link from 'next/link';
import { Instagram, Facebook, PlusCircle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
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
};

const bankList = [
    { code: 'bca', name: 'BCA' },
    { code: 'mandiri', name: 'Bank Mandiri' },
    { code: 'bni', name: 'BNI' },
    { code: 'bri', name: 'BRI' },
    { code: 'bsi', name: 'BSI' },
    { code: 'cimb', name: 'CIMB Niaga' },
    { code: 'permata', name: 'Bank Permata' },
    { code: 'danamon', name: 'Bank Danamon' },
    { code: 'panin', name: 'Panin Bank' },
    { code: 'ocbc', name: 'OCBC NISP' },
    { code: 'btn', name: 'BTN' },
    { code: 'maybank', name: 'Maybank Indonesia' },
    { code: 'uob', name: 'UOB Indonesia' },
    { code: 'mega', name: 'Bank Mega' },
    { code: 'jago', name: 'Bank Jago' },
    { code: 'artos', name: 'Bank Artos' },
    { code: 'dbs', name: 'DBS Indonesia' },
    { code: 'bcasyariah', name: 'BCA Syariah' },
    { code: 'muamalat', name: 'Bank Muamalat' },
];

export default function SettingsPage() {
  const user = users[0];
  const [socials, setSocials] = useState(user.socials || {});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {/* Store Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profil Publik</CardTitle>
                  <CardDescription>
                    Informasi ini akan ditampilkan secara publik.
                  </CardDescription>
                </div>
                <Link
                  href={`/creator/${user.id}`}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Lihat Profil Saya
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={user.avatar.imageUrl}
                    data-ai-hint={user.avatar.imageHint}
                  />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button>Ubah Foto</Button>
                  <Button variant="outline">Hapus</Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-name">Nama Kreator</Label>
                <Input id="store-name" defaultValue={user.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue={user.bio}
                  placeholder="Ceritakan sedikit tentang diri Anda"
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid gap-4">
                <Label>Tautan Sosial</Label>
                <div className="space-y-3">
                  {Object.entries(socials).map(([platform, username]) => (
                    <div key={platform} className="flex items-center gap-3">
                      <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          {socialIcons[platform as keyof typeof socialIcons]}
                        </span>
                        <Input
                          defaultValue={username as string}
                          className="pl-10"
                          readOnly
                        />
                      </div>
                      <Button variant="ghost" size="icon">
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
                      Tambah Tautan Sosial
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Tautan Sosial</DialogTitle>
                      <DialogDescription>
                        Pilih platform dan masukkan nama pengguna Anda.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih platform sosial" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="username">Nama Pengguna</Label>
                        <Input id="username" placeholder="@username" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Simpan</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Simpan Profil</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pembayaran</CardTitle>
              <CardDescription>
                Kelola informasi rekening bank Anda untuk pencairan dana.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="bank-name">Nama Bank</Label>
                <Select>
                  <SelectTrigger id="bank-name">
                    <SelectValue placeholder="Pilih Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-72">
                         {bankList.map((bank) => (
                            <SelectItem key={bank.code} value={bank.code}>
                                {bank.name}
                            </SelectItem>
                        ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account-holder-name">Nama Pemilik Rekening</Label>
                <Input id="account-holder-name" placeholder="Sesuai nama di buku tabungan" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account-number">Nomor Rekening</Label>
                <Input id="account-number" placeholder="Masukkan nomor rekening" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Simpan Informasi Bank</Button>
            </CardFooter>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="elena@example.com"
                  readOnly
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
              <CardDescription>
                Pilih cara kami menghubungi Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox id="email-sales" defaultChecked />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="email-sales"
                    className="text-sm font-medium"
                  >
                    Penjualan Baru
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Dapatkan pemberitahuan saat seseorang membeli produk Anda.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="email-reviews" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="email-reviews"
                    className="text-sm font-medium"
                  >
                    Ulasan Baru
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Dapatkan pemberitahuan saat seseorang memberikan ulasan pada
                    produk Anda.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="email-newsletter" defaultChecked />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="email-newsletter"
                    className="text-sm font-medium"
                  >
                    Buletin Kreator
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Terima pembaruan produk, tip, dan berita dari kami.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Simpan Preferensi</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

    