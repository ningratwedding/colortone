
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
import Link from 'next/link';
import { Instagram, Facebook, PlusCircle, Trash2, DollarSign, Globe, Loader2 } from 'lucide-react';
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
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useStorage } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/firebase/storage/actions';
import { updateProfile as updateAuthProfile } from 'firebase/auth';


function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24"
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
  website: <Globe className="h-5 w-5" />
};

type SocialPlatform = keyof typeof socialIcons;

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
  const storage = useStorage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userProfileRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  // Profile States
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [socials, setSocials] = useState<UserProfile['socials']>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Bank Info States
  const [bankCode, setBankCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState<SocialPlatform | ''>('');
  const [newSocialUsername, setNewSocialUsername] = useState('');
  
  // Loading States
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingBankInfo, setIsSavingBankInfo] = useState(false);
  const [formattedBalance, setFormattedBalance] = useState('');

   useEffect(() => {
    if (userProfile) {
      // Profile
      setName(userProfile.name || '');
      setBio(userProfile.bio || '');
      setSocials(userProfile.socials || {});
      setAvatarPreview(userProfile.avatarUrl);
      // Bank Info
      setBankCode(userProfile.bankCode || '');
      setAccountHolderName(userProfile.accountHolderName || '');
      setAccountNumber(userProfile.accountNumber || '');
    }
  }, [userProfile]);

  useEffect(() => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };
    // Placeholder balance, replace with actual data when available
    setFormattedBalance(formatCurrency(2500000));
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!userProfileRef || !user) return;
    setIsSavingProfile(true);
    try {
      let newAvatarUrl = userProfile?.avatarUrl;
      if (avatarFile) {
        toast({ title: 'Mengunggah foto profil...' });
        newAvatarUrl = await uploadFile(storage, avatarFile, user.uid, 'avatars');
      }

      const updatedData: Partial<UserProfile> = {
        name: name,
        bio: bio,
        socials: socials,
        avatarUrl: newAvatarUrl,
      };

      await updateDoc(userProfileRef, updatedData);

      if (user && (name !== user.displayName || newAvatarUrl !== user.photoURL)) {
        await updateAuthProfile(user, { displayName: name, photoURL: newAvatarUrl });
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
      setIsSavingProfile(false);
      setAvatarFile(null);
    }
  };

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


  const handleAddSocial = () => {
    if (newSocialPlatform && newSocialUsername) {
      setSocials(prev => ({...prev, [newSocialPlatform]: newSocialUsername}));
      setIsDialogOpen(false);
      setNewSocialPlatform('');
      setNewSocialUsername('');
    }
  };

  const handleRemoveSocial = (platform: SocialPlatform) => {
    setSocials(prev => {
        const newSocials = {...prev};
        if (prev) {
          delete (newSocials as any)[platform];
        }
        return newSocials;
    });
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
                  href={`/creator/${userProfile.slug}`}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Lihat Profil Saya
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                   <AvatarImage src={avatarPreview || undefined} alt={name} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                   <Input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                  <Button onClick={() => fileInputRef.current?.click()}>Ubah Foto</Button>
                  <Button variant="outline" onClick={() => { setAvatarPreview(undefined); setAvatarFile(null)}}>Hapus</Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-name">Nama Kreator</Label>
                <Input id="store-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ceritakan sedikit tentang diri Anda"
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid gap-4">
                <Label>Tautan Sosial & Situs Web</Label>
                <div className="space-y-3">
                  {socials && Object.entries(socials).map(([platform, username]) => (
                    <div key={platform} className="flex items-center gap-3">
                      <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          {socialIcons[platform as keyof typeof socialIcons]}
                        </span>
                        <Input
                          value={username as string}
                          className="pl-10"
                          readOnly
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveSocial(platform as SocialPlatform)}>
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
                      Tambah Tautan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Tautan Sosial atau Situs Web</DialogTitle>
                      <DialogDescription>
                        Pilih platform dan masukkan nama pengguna atau URL.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select onValueChange={(value) => setNewSocialPlatform(value as SocialPlatform)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="website">Situs Web</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="username">Nama Pengguna atau URL</Label>
                        <Input id="username" placeholder={newSocialPlatform === 'website' ? 'https://contoh.com' : 'misal: kartikasari'} value={newSocialUsername} onChange={(e) => setNewSocialUsername(e.target.value)} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddSocial}>Simpan</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                {isSavingProfile ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Menyimpan...</> : 'Simpan Profil'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Total Balance */}
          <Card className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
            <CardHeader>
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary-foreground/80">
                  Total Saldo
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary-foreground/80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formattedBalance}</div>
              <p className="text-xs text-primary-foreground/80">
                Saldo yang tersedia untuk ditarik.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90" disabled>Tarik Dana</Button>
            </CardFooter>
          </Card>

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
    </div>
  );
}
