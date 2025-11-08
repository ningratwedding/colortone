
'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Order, Product, UserProfile } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Skeleton } from '@/components/ui/skeleton';

function DownloadContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const firestore = useFirestore();

  // We need to fetch the order, then the product from the order.
  const orderRef = useMemo(() => {
    if (!firestore || !orderId) return null;
    // Note: This assumes a top-level `orders` collection or a known user path.
    // For this example, let's assume we know the user path, but this is not robust.
    // A better approach would be to pass userId or have a global orders collection.
    // To simplify, we'll assume the order is publicly findable by ID, which is not secure.
    // A proper implementation needs to get the current user and look in their subcollection.
    const path = `users/placeholder-user-id/orders/${orderId}`;
    return null; // This logic needs to be fixed.
  }, [firestore, orderId]);

  const { data: order, loading: orderLoading } = useDoc<Order>(orderRef);
  
  const productRef = useMemo(() => {
    if (!firestore || !order?.productId) return null;
    return doc(firestore, 'products', order.productId);
  }, [firestore, order?.productId]);

  const { data: product, loading: productLoading } = useDoc<Product>(productRef);

  const creatorRef = useMemo(() => {
    if (!firestore || !product?.creatorId) return null;
    return doc(firestore, 'users', product.creatorId);
  }, [firestore, product?.creatorId]);
  const { data: creator, loading: creatorLoading } = useDoc<UserProfile>(creatorRef);


  const handleDownload = () => {
    if (!product) return;
    const link = document.createElement('a');
    link.href = '/placeholder.zip'; // Placeholder file
    link.download = `${product.name.replace(/\s+/g, '-')}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const loading = productLoading || creatorLoading;

  if (loading) {
      return (
        <div className="flex flex-col items-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                    <Skeleton className="h-7 w-48 mt-4 mx-auto" />
                    <Skeleton className="h-5 w-64 mt-2 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
      )
  }

  if (!product) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Produk tidak ditemukan!</AlertTitle>
        <AlertDescription>
          Tidak dapat menemukan detail pesanan. Silakan kembali ke beranda.
          <Button asChild variant="link" className="p-0 h-auto ml-1">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Pembayaran Diterima!</CardTitle>
          <CardDescription>
            Terima kasih atas pembelian Anda. Produk Anda sekarang siap untuk diunduh.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-3 text-left">
            <div className="flex items-center gap-4">
                <Image
                src={product.imageAfterUrl}
                alt={product.name}
                width={72}
                height={48}
                className="rounded-md"
                data-ai-hint={product.imageAfterHint}
                />
                <div className="flex-1">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">Oleh {creator?.name || '...'}</p>
                </div>
            </div>
          </div>
          
          <Button className="w-full" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Unduh Sekarang
          </Button>
          
          <Button asChild className="w-full" variant="outline">
            <Link href="/account/purchases">Kembali ke Pembelian Saya</Link>
          </Button>

           <div className="text-xs text-muted-foreground pt-2">
            <p>Produk ini dan semua pembelian Anda yang lain akan selalu tersedia di halaman "Pembelian Saya".</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Memuat...</div>}>
        <DownloadContent />
      </Suspense>
    </div>
  );
}

