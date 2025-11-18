

'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SellerCard } from '@/components/seller-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Users } from 'lucide-react';

export default function SellersPage() {
  const firestore = useFirestore();

  const sellersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), where('role', '==', 'seller'));
  }, [firestore]);

  const { data: sellers, loading } = useCollection<UserProfile>(sellersQuery);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Jelajahi Penjual Kami</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Temukan dan dukung para pelaku UMKM dan penjual berbakat di platform kami.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      ) : sellers && sellers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sellers.map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      ) : (
        <Alert>
            <Users className="h-4 w-4" />
            <AlertTitle>Belum Ada Penjual</AlertTitle>
            <AlertDescription>
                Saat ini belum ada penjual yang terdaftar. Jadilah yang pertama!
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
