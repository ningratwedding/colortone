
'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { MoreHorizontal, PlusCircle, Trash2, Edit } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { doc, updateDoc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile, AffiliateProductCategory } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from '@/components/ui/checkbox';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, documentId } from 'firebase/firestore';
import Image from 'next/image';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};


export default function AffiliateCategoriesPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AffiliateProductCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<AffiliateProductCategory | null>(null);

  const userProfileRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);
  
  const featuredProductsQuery = useMemo(() => {
    if (!firestore || !userProfile?.featuredProductIds || userProfile.featuredProductIds.length === 0) return null;
    return query(collection(firestore, "products"), where(documentId(), 'in', userProfile.featuredProductIds));
  }, [firestore, userProfile?.featuredProductIds]);

  const { data: featuredProducts, loading: productsLoading } = useCollection(featuredProductsQuery);
  
  const handleOpenDialog = (category: AffiliateProductCategory | null = null) => {
    setEditingCategory(category);
    setCategoryName(category?.name || '');
    setSelectedProductIds(new Set(category?.productIds || []));
    setIsDialogOpen(true);
  };
  
  const resetDialog = () => {
    setEditingCategory(null);
    setCategoryName('');
    setSelectedProductIds(new Set());
    setIsDialogOpen(false);
  };

  const handleToggleProduct = (productId: string) => {
    setSelectedProductIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(productId)) {
            newSet.delete(productId);
        } else {
            newSet.add(productId);
        }
        return newSet;
    });
  };

  const handleSaveCategory = async () => {
    if (!userProfileRef || !userProfile || !categoryName) return;
    
    setIsSubmitting(true);
    const currentCategories = userProfile.affiliateProductCategories || [];
    let newCategories: AffiliateProductCategory[];

    if (editingCategory) {
      newCategories = currentCategories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: categoryName, productIds: Array.from(selectedProductIds) } 
          : cat
      );
    } else {
      newCategories = [
        ...currentCategories,
        { id: uuidv4(), name: categoryName, productIds: Array.from(selectedProductIds) }
      ];
    }
    
    try {
      await updateDoc(userProfileRef, { affiliateProductCategories: newCategories });
      toast({ title: editingCategory ? 'Kategori Diperbarui' : 'Kategori Dibuat', description: `Kategori "${categoryName}" telah disimpan.`});
      resetDialog();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan saat menyimpan kategori.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete || !userProfileRef || !userProfile) return;
    setIsSubmitting(true);
    const updatedCategories = (userProfile.affiliateProductCategories || []).filter(c => c.id !== categoryToDelete.id);
    try {
      await updateDoc(userProfileRef, { affiliateProductCategories: updatedCategories });
      toast({ title: 'Kategori Dihapus' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Gagal Menghapus' });
    } finally {
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (category: AffiliateProductCategory) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };
  
  const loading = userLoading || profileLoading;

  return (
    <>
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Kategori Produk Unggulan</CardTitle>
          <CardDescription>
            Buat grup kustom untuk produk afiliasi Anda. Ini akan ditampilkan sebagai tab di halaman profil publik Anda.
          </CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Kategori
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kategori</TableHead>
              <TableHead>Jumlah Produk</TableHead>
              <TableHead><span className="sr-only">Tindakan</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : userProfile?.affiliateProductCategories && userProfile.affiliateProductCategories.length > 0 ? (
              userProfile.affiliateProductCategories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.productIds.length}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu Tindakan</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleOpenDialog(cat)}>
                          <Edit className="mr-2 h-4 w-4" /> Ubah
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={() => openDeleteDialog(cat)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Belum ada kategori. Buat satu untuk memulai!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Dialog open={isDialogOpen} onOpenChange={resetDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Ubah Kategori' : 'Buat Kategori Baru'}</DialogTitle>
          <DialogDescription>
            Beri nama kategori Anda dan pilih produk mana yang akan dimasukkan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category-name">Nama Kategori</Label>
            <Input id="category-name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Pilih Produk</Label>
            <Card className="max-h-64">
                <CardContent className="p-2 overflow-y-auto max-h-64">
                    {productsLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Memuat produk unggulan...</div>
                    ) : featuredProducts && featuredProducts.length > 0 ? (
                       <div className="space-y-2">
                         {featuredProducts.map(product => (
                            <div key={product.id} className="flex items-center space-x-3 rounded-md border p-2">
                                <Checkbox
                                    id={`product-${product.id}`}
                                    checked={selectedProductIds.has(product.id)}
                                    onCheckedChange={() => handleToggleProduct(product.id)}
                                />
                                <Image 
                                    src={product.galleryImageUrls[0]}
                                    alt={product.name}
                                    width={48}
                                    height={32}
                                    className="rounded object-cover aspect-[3/2]"
                                />
                                <Label htmlFor={`product-${product.id}`} className="font-normal cursor-pointer flex-1">
                                    <p className="truncate">{product.name}</p>
                                    <p className="text-xs font-semibold text-primary">{formatCurrency(product.price)}</p>
                                </Label>
                            </div>
                        ))}
                       </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Anda belum memilih produk unggulan.
                            <Button variant="link" asChild className="block p-0 h-auto">
                                <Link href="/account/affiliate/products">Pilih produk unggulan</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetDialog} disabled={isSubmitting}>Batal</Button>
          <Button onClick={handleSaveCategory} disabled={isSubmitting || !categoryName}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Kategori?</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus kategori "{categoryToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
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
    </>
  );
}
