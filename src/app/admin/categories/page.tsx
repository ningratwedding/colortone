
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import type { Category } from '@/lib/data';
import { Badge } from '@/components/ui/badge';


export default function AdminCategoriesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<Category['type']>('digital');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const categoriesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'));
  }, [firestore]);

  const { data: categories, loading } = useCollection<Category>(categoriesQuery);

  const createSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const handleOpenDialog = (category: Category | null = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setCategoryType(category ? category.type : 'digital');
    setIsDialogOpen(true);
  };
  
  const resetDialog = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryType('digital');
    setIsDialogOpen(false);
  }

  const handleSaveCategory = async () => {
    if (!categoryName || !firestore) return;

    setIsSubmitting(true);
    const slug = createSlug(categoryName);

    try {
        const dataToSave = {
            name: categoryName,
            slug: slug,
            type: categoryType,
        };

      if (editingCategory) {
        // Update existing category
        const categoryRef = doc(firestore, 'categories', editingCategory.id);
        await updateDoc(categoryRef, dataToSave);
        toast({ title: 'Kategori Diperbarui', description: `"${categoryName}" telah berhasil diperbarui.` });
      } else {
        // Add new category
        await addDoc(collection(firestore, 'categories'), {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Kategori Ditambahkan', description: `Kategori "${categoryName}" telah berhasil dibuat.` });
      }
      resetDialog();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan saat menyimpan kategori.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete || !firestore) return;
    setIsSubmitting(true);
    try {
      const categoryRef = doc(firestore, 'categories', categoryToDelete.id);
      await deleteDoc(categoryRef);
      toast({ title: 'Kategori Dihapus', description: `Kategori "${categoryToDelete.name}" telah dihapus.`});
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
       toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Terjadi kesalahan saat menghapus kategori.' });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  }
  
  const getTypeBadge = (type: Category['type']) => {
    switch (type) {
      case 'digital':
        return <Badge variant="secondary">Digital</Badge>;
      case 'fisik':
        return <Badge variant="outline">Fisik</Badge>;
      case 'semua':
        return <Badge>Semua</Badge>;
      default:
        return <Badge variant="destructive">Tidak Diketahui</Badge>;
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Kategori Produk</CardTitle>
            <CardDescription>
              Kelola semua kategori produk yang tersedia di platform.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Tambah Kategori
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kategori</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Tipe</TableHead>
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
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))}
              {!loading &&
                categories &&
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.slug}
                    </TableCell>
                     <TableCell>
                      {getTypeBadge(category.type)}
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
                          <DropdownMenuItem onSelect={() => handleOpenDialog(category)}>
                            Ubah
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={() => openDeleteDialog(category)}
                          >
                             <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              {!loading && (!categories || categories.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Belum ada kategori.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Dialog for Add/Edit Category */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Ubah Kategori' : 'Tambah Kategori Baru'}
            </DialogTitle>
            <DialogDescription>
              Masukkan detail untuk kategori ini. Slug akan dibuat secara otomatis.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Nama Kategori</Label>
              <Input
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="misal: Pakaian"
                autoFocus
              />
            </div>
             <div className="grid gap-2">
              <Label>Tipe Kategori</Label>
              <RadioGroup value={categoryType} onValueChange={(value) => setCategoryType(value as Category['type'])} className="flex gap-4">
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="digital" id="type-digital" />
                    <Label htmlFor="type-digital">Digital</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fisik" id="type-fisik" />
                    <Label htmlFor="type-fisik">Fisik</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="semua" id="type-semua" />
                    <Label htmlFor="type-semua">Semua</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSaveCategory}
              disabled={isSubmitting || !categoryName}
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
                        Tindakan ini tidak dapat dibatalkan. Ini akan menghapus kategori <span className="font-semibold">{categoryToDelete?.name}</span> secara permanen.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
                    <Button variant="destructive" onClick={handleDeleteCategory} disabled={isSubmitting}>
                        {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
