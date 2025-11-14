
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
import { Loader2, PlusCircle, Trash2, Edit, Search, MoreHorizontal, ListTree } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<AffiliateProductCategory | null>(null);
  const [isAllCategoriesDialogOpen, setIsAllCategoriesDialogOpen] = useState(false);

  // Dialog states for categorizing a product
  const [isCategorizeDialogOpen, setIsCategorizeDialogOpen] = useState(false);
  const [productToCategorize, setProductToCategorize] = useState<Product | null>(null);
  const [tempSelectedCategories, setTempSelectedCategories] = useState<Set<string>>(new Set());


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

  const handleProductToggle = (product: Product) => {
    const productId = product.id;
    const newSelectedProducts = new Set(selectedProducts);
    
    if (newSelectedProducts.has(productId)) {
      // Un-featuring product
      newSelectedProducts.delete(productId);
      setSelectedProducts(newSelectedProducts);
      // Also remove it from all custom categories
      setCategories(prev => prev.map(cat => ({
        ...cat,
        productIds: cat.productIds.filter(pid => pid !== productId)
      })));
       toast({ title: "Produk Dihapus", description: `"${product.name}" dihapus dari produk unggulan Anda.` });

    } else {
      // Featuring product: add to main list and open categorization dialog
      newSelectedProducts.add(productId);
      setSelectedProducts(newSelectedProducts);
      
      setProductToCategorize(product);
      
      // Pre-select categories this product is already in
      const existingCats = categories.filter(c => c.productIds.includes(productId)).map(c => c.id);
      setTempSelectedCategories(new Set(existingCats));

      setIsCategorizeDialogOpen(true);
    }
  };


  const handleSaveCategorization = () => {
    if (!productToCategorize) return;

    const productId = productToCategorize.id;

    setCategories(prev => {
      return prev.map(cat => {
        const hasProduct = cat.productIds.includes(productId);
        const shouldHaveProduct = tempSelectedCategories.has(cat.id);

        if (hasProduct && !shouldHaveProduct) {
          // Remove product from category
          return { ...cat, productIds: cat.productIds.filter(pid => pid !== productId) };
        }
        if (!hasProduct && shouldHaveProduct) {
          // Add product to category
          return { ...cat, productIds: [...cat.productIds, productId] };
        }
        return cat;
      });
    });

    toast({ title: 'Kategori Diperbarui', description: `Kategori untuk "${productToCategorize.name}" telah disimpan.` });
    closeCategorizeDialog();
  };
  
  const closeCategorizeDialog = () => {
      setIsCategorizeDialogOpen(false);
      setProductToCategorize(null);
      setTempSelectedCategories(new Set());
  };

  const handleToggleProductInCategorizeDialog = (categoryId: string) => {
    setTempSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
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
    <div className="grid grid-cols-1 lg:max-w-2xl mx-auto gap-6 items-start">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle>Pilih Produk Unggulan</CardTitle>
                <CardDescription>
                  Pilih produk yang ingin Anda tampilkan di halaman profil afiliasi Anda.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsAllCategoriesDialogOpen(true)}>
                <ListTree className="mr-2 h-4 w-4" />
                Kategori saya
              </Button>
          </div>
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
                      onCheckedChange={() => handleProductToggle(product)}
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
        <CardFooter>
            <Button onClick={handleSave} disabled={loading || isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Menyimpan...</> : 'Simpan Semua Perubahan'}
            </Button>
        </CardFooter>
      </Card>
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

    {/* All Categories Dialog */}
    <Dialog open={isAllCategoriesDialogOpen} onOpenChange={setIsAllCategoriesDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kelola Kategori Anda</DialogTitle>
          <DialogDescription>Ubah, hapus, atau buat kategori baru di sini.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            {categories.length > 0 ? (
            <ScrollArea className="h-72">
                <div className="space-y-2 pr-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-3 rounded-md border p-3">
                        <Label className="font-normal flex-1">{cat.name}</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuItem onSelect={() => handleOpenCategoryDialog(cat)}>
                                    <Edit className="mr-2 h-4 w-4" /> Ubah
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => openDeleteDialog(cat)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
                </div>
            </ScrollArea>
            ) : (
                <div className="text-center text-muted-foreground p-4 border rounded-md">
                    <p>Anda belum membuat kategori kustom.</p>
                </div>
            )}
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenCategoryDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat Kategori Baru
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

    {/* Categorize Product Dialog */}
    <Dialog open={isCategorizeDialogOpen} onOpenChange={closeCategorizeDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Masukkan ke Kategori</DialogTitle>
                <DialogDescription>Pilih kategori untuk produk "{productToCategorize?.name}".</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <p className="text-sm font-medium">Kategori yang Tersedia:</p>
                {categories.length > 0 ? (
                <ScrollArea className="h-48">
                    <div className="space-y-2 pr-4">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-3 rounded-md border p-3">
                            <Checkbox
                                id={`cat-dialog-${cat.id}`}
                                checked={tempSelectedCategories.has(cat.id)}
                                onCheckedChange={() => handleToggleProductInCategorizeDialog(cat.id)}
                            />
                            <Label htmlFor={`cat-dialog-${cat.id}`} className="font-normal cursor-pointer flex-1">{cat.name}</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenuItem onSelect={() => {
                                        setIsCategorizeDialogOpen(false);
                                        handleOpenCategoryDialog(cat);
                                    }}>
                                        <Edit className="mr-2 h-4 w-4" /> Ubah
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => {
                                        setIsCategorizeDialogOpen(false);
                                        openDeleteDialog(cat);
                                    }} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
                ) : (
                    <div className="text-center text-muted-foreground p-4 border rounded-md">
                        <p>Anda belum membuat kategori kustom.</p>
                    </div>
                )}
                 <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => { closeCategorizeDialog(); handleOpenCategoryDialog(); }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Buat Kategori Baru
                </Button>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={closeCategorizeDialog}>Lewati</Button>
                <Button onClick={handleSaveCategorization}>Simpan Kategori</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
