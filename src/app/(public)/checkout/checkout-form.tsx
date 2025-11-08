
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
import { products, type Product } from '@/lib/data';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Banknote, Edit, Mail, Terminal, Wallet, MessageSquare } from 'lucide-react';
import Link from 'next/link';

// Mock data for logged-in user
const loggedInUser = {
    email: 'dewi.lestari@example.com',
    whatsapp: '+6287654321098'
}

export default function CheckoutForm({ product }: { product?: Product }) {
  const [formattedSubtotal, setFormattedSubtotal] = useState('');
  const [formattedTax, setFormattedTax] = useState('');
  const [formattedTotal, setFormattedTotal] = useState('');
  const [formattedPrice, setFormattedPrice] = useState('');

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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Informasi Kontak</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account/settings">
                  <Edit className="h-3 w-3 mr-1" /> Ubah
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground"/>
                    <span>{loggedInUser.email}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                    <span>{loggedInUser.whatsapp}</span>
                </div>
            </CardContent>
          </Card>
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
                    src={product.imageAfter.imageUrl}
                    alt={product.name}
                    width={56}
                    height={37}
                    className="rounded-md"
                    data-ai-hint={product.imageAfter.imageHint}
                  />
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Oleh {product.creator.name}
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
