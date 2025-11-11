
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
import { useFirestore } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc, setDoc } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type PlatformSettings = {
    appName: string;
    supportEmail: string;
    notifications: {
        newCreator: boolean;
        newProduct: boolean;
    }
}

export default function AdminSettingsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const settingsRef = useMemo(() => {
        if (!firestore) return null;
        return doc(firestore, 'platform_settings', 'main');
    }, [firestore]);

    const { data: settings, loading } = useDoc<PlatformSettings>(settingsRef);

    const [appName, setAppName] = useState('');
    const [supportEmail, setSupportEmail] = useState('');
    const [notifNewCreator, setNotifNewCreator] = useState(true);
    const [notifNewProduct, setNotifNewProduct] = useState(true);
    const [isSavingGeneral, setIsSavingGeneral] = useState(false);
    const [isSavingPrefs, setIsSavingPrefs] = useState(false);

    useEffect(() => {
        if (settings) {
            setAppName(settings.appName || '');
            setSupportEmail(settings.supportEmail || '');
            setNotifNewCreator(settings.notifications?.newCreator ?? true);
            setNotifNewProduct(settings.notifications?.newProduct ?? true);
        }
    }, [settings]);

    const handleSaveGeneral = async () => {
        if (!settingsRef) return;
        setIsSavingGeneral(true);
        try {
            await setDoc(settingsRef, {
                appName,
                supportEmail,
            }, { merge: true });
            toast({ title: 'Pengaturan Disimpan', description: 'Pengaturan umum telah diperbarui.'});
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
                    newCreator: notifNewCreator,
                    newProduct: notifNewProduct
                }
            }, { merge: true });
            toast({ title: 'Preferensi Disimpan', description: 'Preferensi notifikasi telah diperbarui.'});
        } catch (error) {
            console.error("Error saving preferences:", error);
            toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Gagal menyimpan preferensi notifikasi.'});
        } finally {
            setIsSavingPrefs(false);
        }
    }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Pengaturan Platform</h1>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Skeleton className="lg:col-span-2 h-64" />
             <Skeleton className="h-64" />
        </div>
      ) : (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>Kelola pengaturan umum untuk seluruh aplikasi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid gap-1.5">
                    <Label htmlFor="app-name">Nama Aplikasi</Label>
                    <Input id="app-name" value={appName} onChange={e => setAppName(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="support-email">Email Dukungan</Label>
                    <Input id="support-email" type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveGeneral} disabled={isSavingGeneral}>
                    {isSavingGeneral ? 'Menyimpan...' : 'Simpan Pengaturan Umum'}
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
                    <Checkbox id="email-new-creator" checked={notifNewCreator} onCheckedChange={(checked) => setNotifNewCreator(Boolean(checked))} />
                    <div className="grid gap-1 leading-none">
                        <label htmlFor="email-new-creator" className="text-sm font-medium">Kreator Baru Bergabung</label>
                        <p className="text-xs text-muted-foreground">Dapatkan email saat kreator baru mendaftar.</p>
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
                     {isSavingPrefs ? 'Menyimpan...' : 'Simpan Preferensi'}
                </Button>
            </CardFooter>
          </Card>
      </div>
      )}
    </div>
  );
}
