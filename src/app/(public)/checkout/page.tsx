
'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import CheckoutForm from './checkout-form';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Product } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const firestore = useFirestore();

  const productRef = useMemo(() => {
    if (!firestore || !productId) return null;
    return doc(firestore, 'products', productId);
  }, [firestore, productId]);

  const { data: product, loading } = useDoc<Product>(productRef);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
             <Skeleton className="h-48 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return <CheckoutForm product={product || undefined} />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6">Memuat...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
