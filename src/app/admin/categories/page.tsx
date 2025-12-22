

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, PlusCircle, Trash2, ChevronsRight, CornerDownRight } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
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
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


export default function AdminCategoriesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<Category['type']>('digital');
  const [parentId, setParentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const categoriesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'), orderBy('name', 'asc'));
  }, [firestore]);

  const { data: categories, loading } = useCollection<Category>(categoriesQuery);

  const { categoryTree, parentCategories } = useMemo(() => {
    if (!categories) return { categoryTree: [], parentCategories: [] };

    const categoryMap = new Map<string, Category & { children: Category[] }>();
    categories.forEach(cat => categoryMap.set(cat.id, { ...cat, children: [] }));

    const tree: (Category & { children: Category[] })[] = [];
    categories.forEach(cat => {
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        categoryMap.get(cat.parentId)?.children.push(categoryMap.get(cat.id)!);
      } else {
        tree.push(categoryMap.get(cat.id)!);
      }
    });

    const parents = categories.filter(c => !c.parentId);

    return { categoryTree: tree, parentCategories: parents };
  }, [categories]);

  const createSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const handleOpenDialog = (category: Category | null = null, parentId: string | null = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setCategoryType(category ? category.type : 'digital');
    setParentId(category ? category.parentId || null : parentId);
    setIsDialogOpen(true);
  };
  
  const resetDialog = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryType('digital');
    setParentId(null);
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
        parentId: parentId || null,
      };

      if (editingCategory) {
        // Update existing category
        const categoryRef = doc(firestore, 'categories', editingCategory.id);
        await updateDoc(categoryRef, dataToSave);
        toast({ title: 'Kategori Diperbarui', description: `Kategori "${categoryName}" telah berhasil diperbarui.` });
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
  
  const getSubCategories = useCallback((catId: string): Category[] => {
    if (!categories) return [];
    const children = categories.filter(c => c.parentId === catId);
    let descendants = [...children];
    children.forEach(child => {
        descendants = [...descendants, ...getSubCategories(child.id)];
    });
    return descendants;
  }, [categories]);

  const handleDeleteCategory = async () => {
    if (!categoryToDelete || !firestore) return;
    setIsSubmitting(true);
    try {
        const batch = writeBatch(firestore);

        // Find all descendants to delete them as well
        const descendants = getSubCategories(categoryToDelete.id);
        const allIdsToDelete = [categoryToDelete.id, ...descendants.map(d => d.id)];

        allIdsToDelete.forEach(id => {
            const categoryRef = doc(firestore, 'categories', id);
            batch.delete(categoryRef);
        });
        
        await batch.commit();

      toast({ title: 'Kategori Dihapus', description: `Kategori "${categoryToDelete.name}" dan semua sub-kategorinya telah dihapus.`});
    } catch (error) {
      console.error('Error deleting category:', error);
       toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Terjadi kesalahan saat menghapus kategori.' });
    } finally {
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
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
  
  const renderCategoryRow = (category: Category & { children: Category[] }, level = 0) => (
    <React.Fragment key={category.id}>
        <div className={cn("flex items-center gap-2 py-2 px-2 rounded-md hover:bg-muted/50", level > 0 && "ml-4")}>
            <div className="flex-1 flex items-center gap-2">
                {level > 0 && <CornerDownRight className="h-4 w-4 text-muted-foreground" />}
                <p className="font-medium">{category.name}</p>
                {getTypeBadge(category.type)}
            </div>
            <div className="flex items-center gap-2">
                 <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(null, category.id)}>
                    <PlusCircle className="h-4 w-4 mr-1"/>
                    Sub-Kategori
                 </Button>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu Tindakan</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => handleOpenDialog(category)}>Ubah</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onSelect={() => openDeleteDialog(category)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        {category.children.sort((a,b) => a.name.localeCompare(b.name)).map(child => renderCategoryRow(child, level + 1))}
    </React.Fragment>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Kategori Produk</CardTitle>
            <CardDescription>
              Kelola semua kategori dan sub-kategori produk yang tersedia di platform.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2" />
            Tambah Kategori Induk
          </Button>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex justify-between items-center p-2">
                            <Skeleton className="h-5 w-32" />
                             <div className="flex gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                             </div>
                        </div>
                    ))}
                </div>
            ) : categoryTree.length > 0 ? (
                <div className="space-y-1">
                  {categoryTree.map(cat => renderCategoryRow(cat))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground p-8">
                    Belum ada kategori.
                </div>
            )}
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
                <Label htmlFor="parent-category">Kategori Induk (Opsional)</Label>
                <Select value={parentId || 'none'} onValueChange={(value) => setParentId(value === 'none' ? null : value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Tidak ada (Kategori Induk)</SelectItem>
                        {parentCategories.filter(p => p.id !== editingCategory?.id).map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-name">Nama Kategori</Label>
              <Input
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="misal: Pakaian Pria"
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
             <Button variant="outline" onClick={resetDialog} disabled={isSubmitting}>Batal</Button>
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
                        Tindakan ini akan menghapus kategori <span className="font-semibold">{categoryToDelete?.name}</span> dan semua sub-kategorinya secara permanen.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>Batal</Button>
                    <Button variant="destructive" onClick={handleDeleteCategory} disabled={isSubmitting}>
                        {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
