
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, PlusCircle, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useState, useMemo, useRef } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useStorage } from '@/firebase/provider';
import {
  collection,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Campaign } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/firebase/auth/use-user';
import { uploadFile } from '@/firebase/storage/actions';


export default function AdminCampaignsPage() {
  const firestore = useFirestore();
  const storage = useStorage();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  const campaignsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'campaigns'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: campaigns, loading } = useCollection<Campaign>(campaignsQuery);

  const handleOpenDialog = (campaign: Campaign | null = null) => {
    setEditingCampaign(campaign);
    setTitle(campaign?.title || '');
    setDescription(campaign?.description || '');
    setLinkUrl(campaign?.linkUrl || '');
    setIsActive(campaign ? campaign.isActive : true);
    setImagePreview(campaign?.imageUrl || null);
    setImageFile(null);
    setIsDialogOpen(true);
  };
  
  const resetDialog = () => {
    setIsDialogOpen(false);
    setEditingCampaign(null);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
      }
  };

  const handleSaveCampaign = async () => {
    if (!title || !linkUrl || !firestore || !user || !storage) {
        toast({ variant: 'destructive', title: 'Data Tidak Lengkap', description: 'Judul dan URL tautan harus diisi.' });
        return;
    }
    if (!imageFile && !editingCampaign) {
        toast({ variant: 'destructive', title: 'Gambar Diperlukan', description: 'Anda harus mengunggah gambar untuk kampanye baru.' });
        return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = editingCampaign?.imageUrl || '';
      if (imageFile) {
          toast({ title: 'Mengunggah gambar...' });
          imageUrl = await uploadFile(storage, imageFile, user.uid, 'campaign_images');
      }

      const dataToSave = {
        title,
        description,
        linkUrl,
        isActive,
        imageUrl,
        imageHint: 'campaign banner',
      };

      if (editingCampaign) {
        const campaignRef = doc(firestore, 'campaigns', editingCampaign.id);
        await updateDoc(campaignRef, dataToSave);
        toast({ title: 'Kampanye Diperbarui', description: `"${title}" telah berhasil diperbarui.` });
      } else {
        await addDoc(collection(firestore, 'campaigns'), {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Kampanye Ditambahkan', description: `Kampanye "${title}" telah berhasil dibuat.` });
      }
      resetDialog();
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan saat menyimpan kampanye.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete || !firestore) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, 'campaigns', campaignToDelete.id));
      toast({ title: 'Kampanye Dihapus', description: `Kampanye "${campaignToDelete.title}" telah dihapus.`});
    } catch (error) {
       toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Terjadi kesalahan.' });
    } finally {
        setIsDeleteDialogOpen(false);
        setCampaignToDelete(null);
        setIsSubmitting(false);
    }
  }
  
  const openDeleteDialog = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Manajemen Kampanye</CardTitle>
            <CardDescription>
              Buat dan kelola spanduk promosi untuk halaman utama.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Kampanye
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Gambar</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tautan</TableHead>
                <TableHead>
                  <span className="sr-only">Tindakan</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-12 w-24 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                 ))
              ) : campaigns && campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image src={campaign.imageUrl} alt={campaign.title} width={96} height={48} className="rounded-md object-cover aspect-[2/1]" />
                    </TableCell>
                    <TableCell className="font-medium">{campaign.title}</TableCell>
                    <TableCell>
                      <Badge variant={campaign.isActive ? 'default' : 'secondary'}>
                        {campaign.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <a href={campaign.linkUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block max-w-xs">{campaign.linkUrl}</a>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleOpenDialog(campaign)}>Ubah</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onSelect={() => openDeleteDialog(campaign)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Belum ada kampanye.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Dialog for Add/Edit Campaign */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetDialog()}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? 'Ubah Kampanye' : 'Tambah Kampanye Baru'}
            </DialogTitle>
            <DialogDescription>
              Isi detail kampanye. Gambar yang diunggah akan muncul di halaman utama.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="campaign-title">Judul Kampanye</Label>
              <Input id="campaign-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="misal: Diskon Kemerdekaan" autoFocus />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campaign-link">URL Tautan</Label>
              <Input id="campaign-link" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://domain.com/halaman-promo" />
            </div>
             <div className="grid gap-2">
                <Label>Gambar Kampanye</Label>
                <div className="flex items-center gap-4">
                    {imagePreview && <Image src={imagePreview} alt="Pratinjau" width={128} height={64} className="rounded-md object-cover aspect-[2/1]" />}
                    <div className="flex-1">
                        <Input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                           <ImageIcon className="mr-2 h-4 w-4" /> {imagePreview ? 'Ganti Gambar' : 'Pilih Gambar'}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">Rekomendasi rasio aspek 4:1 atau 3:1.</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="is-active">Aktifkan kampanye ini?</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetDialog} disabled={isSubmitting}>Batal</Button>
            <Button type="submit" onClick={handleSaveCampaign} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan Kampanye'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Apakah Anda yakin ingin menghapus?</DialogTitle>
                  <DialogDescription>
                      Tindakan ini akan menghapus kampanye <span className="font-semibold">{campaignToDelete?.title}</span> secara permanen.
                  </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
                  <Button variant="destructive" onClick={handleDeleteCampaign} disabled={isSubmitting}>
                      {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
