
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, type Product } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, FileArchive } from 'lucide-react';
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

  return (
    <div className="flex flex-col items-center text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Pesanan Berhasil!</CardTitle>
          <CardDescription>
            Terima kasih telah melakukan pembelian. Anda sekarang dapat mengunduh produk Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 rounded-md border p-3 text-left">
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
            <Button size="icon" variant="outline" asChild>
                {/* Tautan unduhan palsu untuk demonstrasi */}
                <a href="/placeholder.zip" download={`${product.name.replace(/\s+/g, '-')}.zip`}>
                    <Download className="h-5 w-5" />
                    <span className="sr-only">Unduh</span>
                </a>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Sebuah salinan konfirmasi pesanan dan tautan unduhan telah dikirim ke email Anda.</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
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
