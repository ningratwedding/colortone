
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const user = users[0];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Pengaturan</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          {/* Store Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Profil Toko</CardTitle>
              <CardDescription>
                Informasi ini akan ditampilkan di halaman kreator publik Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <Label htmlFor="store-name">Nama Toko</Label>
                <Input id="store-name" defaultValue={user.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio Toko</Label>
                <Textarea
                  id="bio"
                  defaultValue={user.bio}
                  placeholder="Ceritakan sedikit tentang toko Anda dan jenis produk yang Anda buat."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Simpan Profil</Button>
            </CardFooter>
          </Card>

          {/* Payout Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pembayaran</CardTitle>
              <CardDescription>
                Kelola metode penarikan dana Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="payout-method">Metode Penarikan</Label>
                     <Select defaultValue="bank">
                        <SelectTrigger id="payout-method">
                            <SelectValue placeholder="Pilih metode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bank">Transfer Bank</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="bank-account">Nomor Rekening</Label>
                    <Input id="bank-account" placeholder="•••• •••• 1234" />
                </div>
            </CardContent>
             <CardFooter>
              <Button>Simpan Pengaturan Pembayaran</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="elena@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">Kata Sandi Baru</Label>
                <Input id="new-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Perbarui Kata Sandi</Button>
            </CardFooter>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
              <CardDescription>Pilih cara kami menghubungi Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                    <Checkbox id="email-sales" defaultChecked/>
                    <div className="grid gap-1.5 leading-none">
                        <label htmlFor="email-sales" className="text-sm font-medium">Penjualan Baru</label>
                        <p className="text-sm text-muted-foreground">Dapatkan pemberitahuan saat seseorang membeli produk Anda.</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-3">
                    <Checkbox id="email-reviews" />
                    <div className="grid gap-1.5 leading-none">
                        <label htmlFor="email-reviews" className="text-sm font-medium">Ulasan Baru</label>
                        <p className="text-sm text-muted-foreground">Dapatkan pemberitahuan saat seseorang memberikan ulasan pada produk Anda.</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-3">
                    <Checkbox id="email-newsletter" defaultChecked/>
                    <div className="grid gap-1.5 leading-none">
                        <label htmlFor="email-newsletter" className="text-sm font-medium">Buletin Kreator</label>
                        <p className="text-sm text-muted-foreground">Terima pembaruan produk, tip, dan berita dari kami.</p>
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
