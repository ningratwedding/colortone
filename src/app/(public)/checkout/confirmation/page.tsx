
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, type Product } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, KeyRound } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  const handleVerify = () => {
    // Di aplikasi nyata, di sini Anda akan memverifikasi kode dengan backend
    // dan kemudian memicu pengunduhan.
    // Untuk demonstrasi, kita akan men-trigger unduhan file placeholder.
    const link = document.createElement('a');
    link.href = '/placeholder.zip';
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
          <CardTitle className="mt-4 text-2xl font-bold">Pesanan Berhasil!</CardTitle>
          <CardDescription>
            Kode unduhan unik telah dikirim ke nomor WhatsApp Anda. Masukkan kode di bawah ini untuk mengunduh produk.
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
        
          <div className="grid w-full items-center gap-1.5 text-left">
            <Label htmlFor="download-code">Kode Unduhan</Label>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="download-code" placeholder="XYZ-123-ABC" className="pl-10" />
            </div>
          </div>
          
          <Button className="w-full" onClick={handleVerify}>
            <Download className="mr-2 h-4 w-4" />
            Verifikasi & Unduh
          </Button>
          
          <div className="text-xs text-muted-foreground pt-2">
            <p>Jika Anda tidak menerima kode dalam 5 menit, silakan periksa kembali nomor WhatsApp yang Anda masukkan atau hubungi dukungan.</p>
          </div>
          
          <Button asChild className="w-full" variant="outline">
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
