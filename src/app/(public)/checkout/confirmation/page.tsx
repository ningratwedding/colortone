
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, type Product } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Image from 'next/image';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const product = products.find((p) => p.id === productId);

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

  const handleDownload = () => {
    // Di aplikasi nyata, ini akan memverifikasi otorisasi pengguna
    // dan kemudian memicu pengunduhan aman.
    const link = document.createElement('a');
    link.href = '/placeholder.zip'; // Placeholder file
    link.download = `${product.name.replace(/\s+/g, '-')}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col items-center text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Pembayaran Berhasil!</CardTitle>
          <CardDescription>
            Terima kasih atas pembelian Anda. Produk Anda sekarang siap untuk diunduh.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-3 text-left">
            <div className="flex items-center gap-4">
                <Image
                src={product.imageAfter.imageUrl}
                alt={product.name}
                width={72}
                height={48}
                className="rounded-md"
                data-ai-hint={product.imageAfter.imageHint}
                />
                <div className="flex-1">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">Oleh {product.creator.name}</p>
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


export default function ConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Memuat konfirmasi...</div>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
