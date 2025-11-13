
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { collection, doc, query, updateDoc } from 'firebase/firestore';
import type { Product, UserProfile } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function FeaturedProductsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

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

  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (userProfile?.featuredProductIds) {
      setSelectedProducts(new Set(userProfile.featuredProductIds));
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
      await updateDoc(userProfileRef, {
        featuredProductIds: Array.from(selectedProducts)
      });
      toast({
        title: "Produk Unggulan Diperbarui",
        description: "Halaman profil publik Anda telah diperbarui dengan produk pilihan Anda.",
      });
    } catch (error) {
      console.error("Error saving featured products:", error);
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan pilihan Anda.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const loading = userLoading || profileLoading || productsLoading;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilih Produk Unggulan</CardTitle>
        <CardDescription>
          Pilih produk mana yang ingin Anda tampilkan di halaman profil afiliasi publik Anda. Pengunjung akan melihat produk-produk ini terlebih dahulu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
            ))}
          </div>
        ) : (
          allProducts && allProducts.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {allProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-3 rounded-md border p-3">
                  <Checkbox
                    id={`product-${product.id}`}
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={() => handleProductToggle(product.id)}
                  />
                  <Label htmlFor={`product-${product.id}`} className="font-normal cursor-pointer flex-1">
                    {product.name}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Tidak ada produk yang tersedia di platform saat ini.
            </div>
          )
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={loading || isSaving}>
          {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Menyimpan...</> : 'Simpan Pilihan'}
        </Button>
      </CardFooter>
    </Card>
  );
}

