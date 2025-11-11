
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
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase/provider';
import {
  collection,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Software } from '@/lib/data';

export default function AdminSoftwarePage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null);
  const [softwareName, setSoftwareName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [softwareToDelete, setSoftwareToDelete] = useState<Software | null>(null);

  const softwareQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'software'));
  }, [firestore]);

  const { data: softwareList, loading } = useCollection<Software>(softwareQuery);

  const createSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const handleOpenDialog = (software: Software | null = null) => {
    setEditingSoftware(software);
    setSoftwareName(software ? software.name : '');
    setIsDialogOpen(true);
  };

  const handleSaveSoftware = async () => {
    if (!softwareName || !firestore) return;

    setIsSubmitting(true);
    const slug = createSlug(softwareName);

    try {
      if (editingSoftware) {
        // Update existing software
        const softwareRef = doc(firestore, 'software', editingSoftware.id);
        await updateDoc(softwareRef, { name: softwareName, slug: slug });
        toast({ title: 'Software Diperbarui', description: `"${softwareName}" telah berhasil diperbarui.` });
      } else {
        // Add new software
        await addDoc(collection(firestore, 'software'), {
          name: softwareName,
          slug: slug,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Software Ditambahkan', description: `Software "${softwareName}" telah berhasil dibuat.` });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving software:', error);
      toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan saat menyimpan software.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSoftware = async () => {
    if (!softwareToDelete || !firestore) return;
    setIsSubmitting(true);
    try {
      const softwareRef = doc(firestore, 'software', softwareToDelete.id);
      await deleteDoc(softwareRef);
      toast({ title: 'Software Dihapus', description: `Software "${softwareToDelete.name}" telah dihapus.`});
      setIsDeleteDialogOpen(false);
      setSoftwareToDelete(null);
    } catch (error) {
      console.error('Error deleting software:', error);
       toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Terjadi kesalahan saat menghapus software.' });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const openDeleteDialog = (software: Software) => {
    setSoftwareToDelete(software);
    setIsDeleteDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Perangkat Lunak (Software)</CardTitle>
            <CardDescription>
              Kelola daftar perangkat lunak yang kompatibel dengan produk.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Tambah Software
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Software</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>
                  <span className="sr-only">Tindakan</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))}
              {!loading &&
                softwareList &&
                softwareList.map((software) => (
                  <TableRow key={software.id}>
                    <TableCell className="font-medium">{software.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {software.slug}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Alihkan menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleOpenDialog(software)}>
                            Ubah
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={() => openDeleteDialog(software)}
                          >
                             <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              {!loading && (!softwareList || softwareList.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Belum ada software.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Dialog for Add/Edit Software */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSoftware ? 'Ubah Software' : 'Tambah Software Baru'}
            </DialogTitle>
            <DialogDescription>
              Masukkan nama untuk software ini. Slug akan dibuat secara otomatis.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="software-name">Nama Software</Label>
              <Input
                id="software-name"
                value={softwareName}
                onChange={(e) => setSoftwareName(e.target.value)}
                placeholder="misal: Lightroom"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSaveSoftware}
              disabled={isSubmitting || !softwareName}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
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
                        Tindakan ini tidak dapat dibatalkan. Ini akan menghapus software <span className="font-semibold">{softwareToDelete?.name}</span> secara permanen.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
                    <Button variant="destructive" onClick={handleDeleteSoftware} disabled={isSubmitting}>
                        {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
