

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
import { useFirestore, useStorage } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc, setDoc } from "firebase/firestore";
import { useMemo, useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlatformSettings } from '@/lib/data';
import { ImageIcon, Loader2 } from "lucide-react";
import { uploadFile } from "@/firebase/storage/actions";
import { useUser } from "@/firebase/auth/use-user";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
    const firestore = useFirestore();
    const storage = useStorage();
    const { user } = useUser();
    const { toast } = useToast();
    
    const settingsRef = useMemo(() => {
        if (!firestore) return null;
        return doc(firestore, 'platform_settings', 'main');
    }, [firestore]);

    const { data: settings, loading } = useDoc<PlatformSettings>(settingsRef);

    const [appName, setAppName] = useState('');
    const [appDescription, setAppDescription] = useState('');
    const [supportEmail, setSupportEmail] = useState('');
    const [commissionRate, setCommissionRate] = useState<number | string>('');
    const [notifNewSeller, setNotifNewSeller] = useState(true);
    const [notifNewProduct, setNotifNewProduct] = useState(true);
    const [ogImageFile, setOgImageFile] = useState<File | null>(null);
    const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);

    const ogImageInputRef = useRef<HTMLInputElement>(null);

    const [isSavingGeneral, setIsSavingGeneral] = useState(false);
    const [isSavingPrefs, setIsSavingPrefs] = useState(false);
    const [isSavingOgImage, setIsSavingOgImage] = useState(false);

    useEffect(() => {
        if (settings) {
            setAppName(settings.appName || '');
            setAppDescription(settings.appDescription || '');
            setSupportEmail(settings.supportEmail || '');
            setCommissionRate(settings.affiliateCommissionRate ? settings.affiliateCommissionRate * 100 : '');
            setNotifNewSeller(settings.notifications?.newSeller ?? true);
            setNotifNewProduct(settings.notifications?.newProduct ?? true);
            setOgImagePreview(settings.ogImageUrl || null);
        }
    }, [settings]);

    const handleSaveGeneral = async () => {
        if (!settingsRef) return;
        setIsSavingGeneral(true);
        try {
            const rate = parseFloat(String(commissionRate)) / 100;
            if (isNaN(rate) || rate < 0 || rate > 1) {
                toast({ variant: 'destructive', title: 'Nilai Tidak Valid', description: 'Persentase komisi harus antara 0 dan 100.'});
                setIsSavingGeneral(false);
                return;
            }

            await setDoc(settingsRef, {
                appName,
                appDescription,
                supportEmail,
                affiliateCommissionRate: rate,
            }, { merge: true });
            toast({ title: 'Pengaturan Umum Disimpan', description: 'Pengaturan umum aplikasi telah berhasil diperbarui.'});
        } catch (error) {
            console.error("Error saving general settings:", error);
            toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Gagal menyimpan pengaturan umum.'});
        } finally {
            setIsSavingGeneral(false);
        }
    }

    const handleSavePrefs = async () => {
        if (!settingsRef) return;
        setIsSavingPrefs(true);
        try {
            await setDoc(settingsRef, {
                notifications: {
                    newSeller: notifNewSeller,
                    newProduct: notifNewProduct
                }
            }, { merge: true });
            toast({ title: 'Preferensi Disimpan', description: 'Preferensi notifikasi Anda telah berhasil diperbarui.'});
        } catch (error) {
            console.error("Error saving preferences:", error);
            toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Gagal menyimpan preferensi notifikasi.'});
        } finally {
            setIsSavingPrefs(false);
        }
    }

    const handleOgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setOgImageFile(file);
            setOgImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveOgImage = async () => {
        if (!settingsRef || !ogImageFile || !user) return;
        setIsSavingOgImage(true);
        try {
            toast({ title: 'Mengunggah gambar OG...' });
            const imageUrl = await uploadFile(storage, ogImageFile, user.uid, 'platform_assets');
            
            await setDoc(settingsRef, {
                ogImageUrl: imageUrl,
                ogImageHint: "site opengraph image",
            }, { merge: true });

            toast({ title: 'Gambar OG Diperbarui', description: 'Gambar pratinjau default situs telah berhasil diubah.' });
            setOgImageFile(null);
        } catch (error) {
            console.error('Error saving OG image:', error);
            toast({ variant: 'destructive', title: 'Gagal Menyimpan Gambar', description: 'Terjadi kesalahan saat mengunggah gambar.' });
        } finally {
            setIsSavingOgImage(false);
        }
    }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Skeleton className="lg:col-span-2 h-96" />
             <Skeleton className="lg:col-span-1 h-96" />
        </div>
      ) : (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>Kelola pengaturan umum untuk seluruh aplikasi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="app-name">Nama Aplikasi</Label>
                    <Input id="app-name" value={appName} onChange={e => setAppName(e.target.value)} />
                </div>
                 <div className="grid gap-1.5">
                    <Label htmlFor="app-description">Deskripsi Aplikasi</Label>
                    <Textarea id="app-description" value={appDescription} onChange={e => setAppDescription(e.target.value)} placeholder="Deskripsi singkat aplikasi untuk SEO..." />
                    <p className="text-xs text-muted-foreground">Deskripsi ini akan digunakan untuk metadata Open Graph.</p>
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="support-email">Email Dukungan</Label>
                    <Input id="support-email" type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
                </div>
                 <div className="grid gap-1.5">
                    <Label htmlFor="commission-rate">Komisi Afiliasi (%)</Label>
                    <Input id="commission-rate" type="number" value={commissionRate} onChange={e => setCommissionRate(e.target.value)} placeholder="misal: 10" />
                    <p className="text-xs text-muted-foreground">Masukkan nilai antara 0 dan 100.</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveGeneral} disabled={isSavingGeneral}>
                    {isSavingGeneral ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Menyimpan...</> : 'Simpan Pengaturan Umum'}
                </Button>
            </CardFooter>
        </Card>

        <div className="lg:col-span-1 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Gambar Open Graph (OG)</CardTitle>
                    <CardDescription>Gambar default saat tautan situs dibagikan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                     <div className="grid gap-2">
                        <Label>Pratinjau Gambar</Label>
                        <div className="flex items-center gap-4">
                            {ogImagePreview ? (
                                <Image src={ogImagePreview} alt="Pratinjau OG" width={128} height={64} className="rounded-md object-cover aspect-[2/1] bg-muted border" />
                            ) : (
                                <div className="w-32 h-16 rounded-md bg-muted border flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                            <div className="flex-1">
                                <Input type="file" ref={ogImageInputRef} className="hidden" accept="image/*" onChange={handleOgImageChange} />
                                <Button type="button" variant="outline" onClick={() => ogImageInputRef.current?.click()}>
                                   <ImageIcon className="mr-2 h-4 w-4" /> {ogImagePreview ? 'Ganti' : 'Pilih Gambar'}
                                </Button>
                                <p className="text-xs text-muted-foreground mt-1">Rasio 1.91:1 (1200x630px) disarankan.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveOgImage} disabled={isSavingOgImage || !ogImageFile}>
                        {isSavingOgImage ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Mengunggah...</> : 'Simpan Gambar OG'}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Notifikasi Admin</CardTitle>
                <CardDescription>Pilih notifikasi yang ingin Anda terima.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                        <Checkbox id="email-new-seller" checked={notifNewSeller} onCheckedChange={(checked) => setNotifNewSeller(Boolean(checked))} />
                        <div className="grid gap-1 leading-none">
                            <label htmlFor="email-new-seller" className="text-sm font-medium">Penjual Baru Bergabung</label>
                            <p className="text-xs text-muted-foreground">Dapatkan email saat penjual baru mendaftar.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-2">
                        <Checkbox id="email-new-product" checked={notifNewProduct} onCheckedChange={(checked) => setNotifNewProduct(Boolean(checked))} />
                        <div className="grid gap-1 leading-none">
                            <label htmlFor="email-new-product" className="text-sm font-medium">Produk Baru Diunggah</label>
                            <p className="text-xs text-muted-foreground">Dapatkan email saat ada produk baru yang dipublikasikan.</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSavePrefs} disabled={isSavingPrefs}>
                        {isSavingPrefs ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Menyimpan...</> : 'Simpan Preferensi'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
      )}
    </div>
  );
}
