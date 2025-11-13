
'use client';

import { useState, useEffect, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


const bankList = [
    { code: '014', name: 'BCA' },
    { code: '008', name: 'Bank Mandiri' },
    { code: '009', name: 'BNI' },
    { code: '002', name: 'BRI' },
    { code: '451', name: 'BSI' },
    { code: '022', name: 'CIMB Niaga' },
    { code: '013', name: 'Bank Permata' },
    { code: '011', name: 'Bank Danamon' },
    { code: '019', name: 'Panin Bank' },
    { code: '028', name: 'OCBC NISP' },
    { code: '200', name: 'BTN' },
    { code: '016', name: 'Maybank Indonesia' },
    { code: '023', name: 'UOB Indonesia' },
    { code: '426', name: 'Bank Mega' },
    { code: '547', name: 'Bank Jago' },
    { code: '542', name: 'SeaBank' },
    { code: '046', name: 'DBS Indonesia' },
    { code: '536', name: 'BCA Syariah' },
    { code: '147', name: 'Bank Muamalat' },
];

export default function SettingsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userProfileRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  // Bank Info States
  const [bankCode, setBankCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Loading States
  const [isSavingBankInfo, setIsSavingBankInfo] = useState(false);

   useEffect(() => {
    if (userProfile) {
      // Bank Info
      setBankCode(userProfile.bankCode || '');
      setAccountHolderName(userProfile.accountHolderName || '');
      setAccountNumber(userProfile.accountNumber || '');
    }
  }, [userProfile]);


  const handleSaveBankInfo = async () => {
      if (!userProfileRef) return;
      setIsSavingBankInfo(true);
      try {
          const selectedBank = bankList.find(b => b.code === bankCode);
          const bankNameToSave = selectedBank ? selectedBank.name : '';

          const bankData: Partial<UserProfile> = {
              bankCode: bankCode,
              bankName: bankNameToSave,
              accountHolderName: accountHolderName,
              accountNumber: accountNumber
          };
          await updateDoc(userProfileRef, bankData);
          toast({ title: 'Informasi Bank Disimpan', description: 'Detail rekening bank Anda telah diperbarui.' });
      } catch (error) {
          console.error('Error saving bank info:', error);
          toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan saat menyimpan info bank.' });
      } finally {
          setIsSavingBankInfo(false);
      }
  };


  const loading = userLoading || profileLoading;

  if (loading) {
    return <Skeleton className="w-full h-[80vh]" />;
  }

  if (!userProfile) {
    return <div>Profil tidak ditemukan.</div>
  }

  return (
    <div className="space-y-4">
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
                <Select value={bankCode} onValueChange={setBankCode}>
                  <SelectTrigger id="bank-name">
                    <SelectValue placeholder="Pilih Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-72">
                         {bankList.map((bank) => (
                            <SelectItem key={bank.code} value={bank.code}>
                                {bank.name} ({bank.code})
                            </SelectItem>
                        ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account-holder-name">Nama Pemilik Rekening</Label>
                <Input id="account-holder-name" placeholder="Sesuai nama di buku tabungan" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account-number">Nomor Rekening</Label>
                <Input id="account-number" placeholder="Masukkan nomor rekening" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSaveBankInfo} disabled={isSavingBankInfo}>
                {isSavingBankInfo ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Menyimpan...</> : 'Simpan Informasi Bank'}
                </Button>
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
                  defaultValue={user?.email || ''}
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
              <Button disabled>Simpan Preferensi</Button>
            </CardFooter>
          </Card>
        </div>
    </div>
  );
}
