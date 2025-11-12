
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
import { useUser } from '@/firebase/auth/use-user';

export default function CheckoutForm({ product }: { product?: Product }) {
  const { user, loading: userLoading } = useUser();
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
  
  const getCheckoutUrl = () => {
    if (userLoading) return "#";
    if (user) {
      return `/checkout/confirmation?productId=${product?.id}`;
    }
    return `/login?redirect=/checkout?productId=${product?.id}`;
  };

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
                Pembayaran akan dilakukan melalui transfer bank.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="border rounded-md p-4 flex items-center gap-3">
                    <Banknote className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <p className="font-semibold">Transfer Bank</p>
                        <p className="text-sm text-muted-foreground">Pembayaran melalui akun virtual.</p>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Dengan mengklik "Buat Pesanan", Anda akan diarahkan ke halaman konfirmasi pembayaran.
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
                    src={product.galleryImageUrls?.[0] || `https://picsum.photos/seed/${product.id}/56/37`}
                    alt={product.name}
                    width={56}
                    height={37}
                    className="rounded-md"
                    data-ai-hint={product.galleryImageHints?.[0]}
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
              <Button className="w-full" asChild disabled={userLoading}>
                <Link href={getCheckoutUrl()}>
                  {userLoading ? 'Memuat...' : 'Buat Pesanan'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
