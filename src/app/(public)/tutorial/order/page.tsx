
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShoppingCart, LogIn, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const tutorialSteps = [
  {
    icon: ShoppingCart,
    title: '1. Pilih Produk Anda',
    description: 'Jelajahi marketplace kami dan temukan preset atau LUT yang Anda sukai. Klik tombol "Beli" untuk melanjutkan ke halaman login atau checkout.',
  },
  {
    icon: LogIn,
    title: '2. Masuk atau Buat Akun',
    description: 'Anda akan diminta untuk masuk ke akun Anda. Jika belum punya, buatlah akun baru. Prosesnya cepat dan mudah!',
  },
  {
    icon: Download,
    title: '3. Bayar & Unduh',
    description: 'Selesaikan pembayaran, dan produk digital Anda akan langsung tersedia untuk diunduh di halaman "Pembelian Saya" di dasbor akun Anda.',
  },
];

export default function OrderTutorialPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader className="items-center text-center p-6">
          <div className="p-3 bg-primary/10 rounded-full mb-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">
            Cara Melakukan Pesanan
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-prose">
            Ikuti langkah-langkah mudah ini untuk membeli dan mengunduh produk dari kreator favorit Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="border-t pt-6">
            <ul className="space-y-6">
              {tutorialSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground flex-shrink-0">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
           <div className="border-t pt-6 mt-6 text-center">
             <p className="text-muted-foreground mb-3">Siap untuk memulai?</p>
             <Button asChild size="lg">
                <Link href="/">Jelajahi Produk Sekarang</Link>
             </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
