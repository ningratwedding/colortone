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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { products, type Product } from '@/lib/data';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

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
        <div className="container mx-auto px-4 py-8">
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">Pembayaran</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="email">Alamat Email</Label>
                <Input id="email" type="email" placeholder="anda@contoh.com" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Detail Pembayaran</CardTitle>
              <CardDescription>
                Semua transaksi aman dan terenkripsi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="card-number">Nomor Kartu</Label>
                <Input id="card-number" placeholder="**** **** **** ****" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="expiry-date">Tanggal Kedaluwarsa</Label>
                  <Input id="expiry-date" placeholder="BB / TT" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name-on-card">Nama pada Kartu</Label>
                <Input id="name-on-card" placeholder="John Doe" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                key={product.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={product.imageAfter.imageUrl}
                    alt={product.name}
                    width={64}
                    height={42}
                    className="rounded-md"
                    data-ai-hint={product.imageAfter.imageHint}
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Oleh {product.creator.name}
                    </p>
                  </div>
                </div>
                <span className="font-medium">{formattedPrice}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pajak</span>
                <span>{formattedTax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formattedTotal}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                Selesaikan Pembelian
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
