
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Product, UserProfile } from '@/lib/data';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState, useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Banknote, Terminal, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

export default function CheckoutForm({ product }: { product?: Product }) {
  const [formattedSubtotal, setFormattedSubtotal] = useState('');
  const [formattedTax, setFormattedTax] = useState('');
  const [formattedTotal, setFormattedTotal] = useState('');
  const [formattedPrice, setFormattedPrice] = useState('');
  
  const firestore = useFirestore();

  const creatorRef = useMemo(() => {
    if (!firestore || !product?.creatorId) return null;
    return doc(firestore, 'users', product.creatorId);
  }, [firestore, product?.creatorId]);
  
  const { data: creator } = useDoc<UserProfile>(creatorRef);

  useEffect(() => {
    if (!product) return;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const subtotal = product.price;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    setFormattedSubtotal(formatCurrency(subtotal));
    setFormattedTax(formatCurrency(tax));
    setFormattedTotal(formatCurrency(total));
    setFormattedPrice(formatCurrency(product.price));
  }, [product]);

  if (!product) {
    return (
        <div className="container mx-auto px-4 py-6">
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Produk tidak ditemukan!</AlertTitle>
                <AlertDescription>
                    Sepertinya Anda belum memilih produk. Silakan kembali ke halaman utama untuk memilih produk.
                    <Button asChild variant="link" className="p-0 h-auto ml-1">
                        <Link href="/">Kembali ke Beranda</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Metode Pembayaran</CardTitle>
              <CardDescription>
                Pilih metode pembayaran pilihan Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="grid gap-2">
                    <Button variant="outline" size="lg" className="justify-start">
                        <Banknote className="mr-3" />
                        Transfer Bank
                    </Button>
                    <Button variant="outline" size="lg" className="justify-start">
                        <Wallet className="mr-3" />
                        E-Wallet (QRIS)
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Dengan mengklik "Buat Pesanan", Anda akan diarahkan ke halaman konfirmasi.
                </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div
                key={product.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={product.imageAfterUrl}
                    alt={product.name}
                    width={56}
                    height={37}
                    className="rounded-md"
                    data-ai-hint={product.imageAfterHint}
                  />
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Oleh {creator?.name || '...'}
                    </p>
                  </div>
                </div>
                <span className="font-medium text-sm">{formattedPrice}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Pajak</span>
                <span>{formattedTax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formattedTotal}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/checkout/confirmation?productId=${product.id}`}>Buat Pesanan</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
