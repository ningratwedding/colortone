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
import { Banknote, Terminal, Wallet } from 'lucide-react';
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
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Alamat Email</Label>
                  <Input id="email" type="email" placeholder="anda@contoh.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                  <Input id="whatsapp" type="tel" placeholder="+62 812-3456-7890" />
                </div>
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
            <CardContent className="space-y-4">
                <div className="grid gap-4">
                    <Button variant="outline" size="lg" className="justify-start">
                        <Banknote className="mr-4" />
                        Transfer Bank
                    </Button>
                    <Button variant="outline" size="lg" className="justify-start">
                        <Wallet className="mr-4" />
                        E-Wallet (QRIS)
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground pt-4">
                    Setelah mengklik "Buat Pesanan", Anda akan menerima instruksi pembayaran melalui email dan WhatsApp.
                </p>
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
                Buat Pesanan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
