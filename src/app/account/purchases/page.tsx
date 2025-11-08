
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

export default function PurchasesPage() {
  // Mock data untuk produk yang dibeli. Di aplikasi nyata, ini akan datang dari database.
  const purchasedProducts = [products[0], products[2], products[4]];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Riwayat Pembelian</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchasedProducts.length > 0 ? (
          <div className="space-y-4">
            {purchasedProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-3 gap-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={product.imageAfter.imageUrl}
                    alt={product.name}
                    width={84}
                    height={56}
                    className="rounded-md object-cover aspect-[3/2]"
                    data-ai-hint={product.imageAfter.imageHint}
                  />
                  <div className="flex-1">
                    <Link href={`/product/${product.id}`} className="hover:underline">
                        <p className="font-semibold">{product.name}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Oleh{' '}
                      <Link href={`/creator/${product.creator.slug}`} className="hover:underline">
                        {product.creator.name}
                      </Link>
                    </p>
                  </div>
                </div>
                <Button asChild className="w-full sm:w-auto">
                   <Link href={`/checkout/confirmation?productId=${product.id}`}>
                     <Download className="mr-2 h-4 w-4" />
                     Unduh
                   </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Anda belum melakukan pembelian.</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/">Mulai Belanja</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
