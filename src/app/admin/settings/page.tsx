'use client';

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
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pengaturan Platform</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>Kelola pengaturan umum untuk seluruh aplikasi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="app-name">Nama Aplikasi</Label>
                    <Input id="app-name" defaultValue="FilterForge" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="support-email">Email Dukungan</Label>
                    <Input id="support-email" type="email" defaultValue="support@filterforge.com" />
                </div>
            </CardContent>
            <CardFooter>
                <Button>Simpan Pengaturan Umum</Button>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
              <CardTitle>Notifikasi Admin</CardTitle>
              <CardDescription>Pilih notifikasi yang ingin Anda terima.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                    <Checkbox id="email-new-creator" defaultChecked/>
                    <div className="grid gap-1.5 leading-none">
                        <label htmlFor="email-new-creator" className="text-sm font-medium">Kreator Baru Bergabung</label>
                        <p className="text-sm text-muted-foreground">Dapatkan email saat kreator baru mendaftar.</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-3">
                    <Checkbox id="email-new-product" defaultChecked/>
                    <div className="grid gap-1.5 leading-none">
                        <label htmlFor="email-new-product" className="text-sm font-medium">Produk Baru Diunggah</label>
                        <p className="text-sm text-muted-foreground">Dapatkan email saat ada produk baru yang dipublikasikan.</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button>Simpan Preferensi</Button>
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}
