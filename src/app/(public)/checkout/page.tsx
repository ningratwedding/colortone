'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/lib/data';
import CheckoutForm from './checkout-form';

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const product = products.find((p) => p.id === productId);

  return <CheckoutForm product={product} />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Memuat...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
