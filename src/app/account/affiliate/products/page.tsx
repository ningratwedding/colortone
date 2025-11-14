
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { collection, doc, query, updateDoc } from 'firebase/firestore';
import type { Product, UserProfile, AffiliateProductCategory, Category } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, PlusCircle, Trash2, Edit, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function FeaturedProductsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<AffiliateProductCategory[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Dialog states for category management
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AffiliateProductCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<AffiliateProductCategory | null>(null);

  const userProfileRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'));
  }, [firestore]);
  const { data: allProducts, loading: productsLoading } = useCollection<Product>(productsQuery);
  
  const platformCategoriesQuery = useMemo(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'categories'));
  }, [firestore]);
  const { data: platformCategories, loading: platformCategoriesLoading } = useCollection<Category>(platformCategoriesQuery);
  
  const filteredProducts = useMemo(() => {
      if (!allProducts) return [];
      return allProducts.filter(product => {
          const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
          return matchesSearch && matchesCategory;
      });
  }, [allProducts, searchTerm, filterCategory]);

  useEffect(() => {
    if (userProfile) {
      setSelectedProducts(new Set(userProfile.featuredProductIds || []));
      setCategories(userProfile.affiliateProductCategories || []);
    }
  }, [userProfile]);

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!userProfileRef) return;
    setIsSaving(true);
    try {
      // Clean up categories: remove any productIds that are no longer in the main selectedProducts list
      const cleanedCategories = categories.map(cat => ({
        ...cat,
        productIds: cat.productIds.filter(pid => selectedProducts.has(pid))
      }));

      await updateDoc(userProfileRef, {
        featuredProductIds: Array.from(selectedProducts),
        affiliateProductCategories: cleanedCategories
      });
      toast({
        title: "Pembaruan Disimpan",
        description: "Produk unggulan dan kategori Anda telah disimpan.",
      });
    } catch (error) {
      console.error("Error saving data:", error);
      toast({ variant: "destructive", title: "Gagal Menyimpan" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleProductInCategory = (categoryId: string, productId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        const newProductIds = new Set(cat.productIds);
        if (newProductIds.has(productId)) {
          newProductIds.delete(productId);
        } else {
          newProductIds.add(productId);
        }
        return { ...cat, productIds: Array.from(newProductIds) };
      }
      return cat;
    }));
  };
  
  // Category Dialog Handlers
  const handleOpenCategoryDialog = (category: AffiliateProductCategory | null = null) => {
    setEditingCategory(category);
    setCategoryName(category?.name || '');
    setIsCategoryDialogOpen(true);
  };
  
  const resetCategoryDialog = () => {
    setEditingCategory(null);
    setCategoryName('');
    setIsCategoryDialogOpen(false);
  };
  
  const handleSaveCategory = () => {
    if (!categoryName) return;
    
    if (editingCategory) {
      setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? { ...cat, name: categoryName } : cat));
      toast({ title: 'Kategori Diperbarui' });
    } else {
      const newCategory: AffiliateProductCategory = { id: uuidv4(), name: categoryName, productIds: [] };
      setCategories(prev => [...prev, newCategory]);
      toast({ title: 'Kategori Dibuat' });
    }
    resetCategoryDialog();
  };
  
  const openDeleteDialog = (category: AffiliateProductCategory) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteCategory = () => {
    if (!categoryToDelete) return;
    setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
    toast({ title: 'Kategori Dihapus' });
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };
  
  const loading = userLoading || profileLoading || productsLoading;
  
  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Product Selection */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Pilih Produk Unggulan</CardTitle>
            <CardDescription>
              Pilih produk yang ingin Anda tampilkan di halaman profil afiliasi Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Cari produk..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter berdasarkan kategori" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {platformCategoriesLoading ? (
                        <SelectItem value="loading" disabled>Memuat...</SelectItem>
                    ) : (
                        platformCategories?.map(cat => (
                            <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
            <ScrollArea className="h-96 pr-4 border-t pt-4">
              <div className="space-y-3">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                ) : filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 rounded-md border p-3">
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={selectedProducts.has(product.id)}
                        onCheckedChange={() => handleProductToggle(product.id)}
                      />
                      <Image 
                        src={product.galleryImageUrls[0]}
                        alt={product.name}
                        width={48}
                        height={32}
                        className="rounded object-cover aspect-[3/2] bg-muted"
                      />
                      <Label htmlFor={`product-${product.id}`} className="font-normal cursor-pointer flex-1">
                        <p className="truncate">{product.name}</p>
                        <p className="text-xs font-semibold text-primary">{formatCurrency(product.price)}</p>
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">Tidak ada produk ditemukan.</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Category Management */}
      <div className="lg:col-span-1">
        <Card>
            <CardHeader>
                <CardTitle>Atur Kategori</CardTitle>
                <CardDescription>
                    Kelompokkan produk unggulan Anda ke dalam kategori kustom.
                </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <Tabs defaultValue={categories[0]?.id || 'new'}>
                  <div className="flex items-center gap-2">
                    <TabsList className="relative flex-1 justify-start h-auto flex-wrap">
                        {categories.map((cat) => (
                          <div key={cat.id} className="flex items-center rounded-md data-[state=active]:bg-muted">
                            <TabsTrigger value={cat.id}>
                              {cat.name}
                            </TabsTrigger>
                            <div className="flex items-center pr-2">
                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); handleOpenCategoryDialog(cat); }}>
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); openDeleteDialog(cat); }}>
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                            </div>
                           </div>
                        ))}
                    </TabsList>
                    <Button onClick={() => handleOpenCategoryDialog()} size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Baru
                    </Button>
                  </div>
                  {categories.map((cat) => (
                    <TabsContent key={cat.id} value={cat.id} className="mt-4">
                        <p className="text-sm text-muted-foreground mb-3">Pilih produk unggulan untuk kategori "{cat.name}":</p>
                        <ScrollArea className="h-80 pr-4">
                            <div className="space-y-2">
                            {Array.from(selectedProducts).length > 0 ? (
                                Array.from(selectedProducts).map(productId => {
                                    const product = allProducts?.find(p => p.id === productId);
                                    if (!product) return null;
                                    return (
                                        <div key={`${cat.id}-${productId}`} className="flex items-center space-x-3 rounded-md border p-2">
                                                <Checkbox
                                                id={`${cat.id}-${productId}-check`}
                                                checked={cat.productIds.includes(productId)}
                                                onCheckedChange={() => handleToggleProductInCategory(cat.id, productId)}
                                            />
                                            <Image src={product.galleryImageUrls[0]} alt={product.name} width={40} height={26} className="rounded object-cover aspect-[3/2] bg-muted" />
                                            <Label htmlFor={`${cat.id}-${productId}-check`} className="text-sm font-normal cursor-pointer flex-1 truncate">{product.name}</Label>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-sm text-center text-muted-foreground pt-4">Pilih produk unggulan terlebih dahulu.</p>
                            )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                  ))}
                  {categories.length === 0 && (
                      <div className="text-center text-muted-foreground py-12">Belum ada kategori. Buat satu untuk memulai!</div>
                  )}
                </Tabs>
              )}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} disabled={loading || isSaving}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Menyimpan...</> : 'Simpan Semua Perubahan'}
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
    
    {/* Category Add/Edit Dialog */}
    <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Ubah Kategori' : 'Buat Kategori Baru'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category-name">Nama Kategori</Label>
            <Input id="category-name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetCategoryDialog}>Batal</Button>
          <Button onClick={handleSaveCategory} disabled={!categoryName}>
            {editingCategory ? 'Simpan Perubahan' : 'Buat Kategori'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Delete Confirmation Dialog */}
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
          <Button variant="destructive" onClick={handleDeleteCategory}>
            Ya, Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
