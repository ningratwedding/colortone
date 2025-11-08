
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, ShoppingCart, Contact, KeyRound, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const tutorialSteps = [
  {
    icon: ShoppingCart,
    title: '1. Pilih Produk Anda',
    description: 'Jelajahi marketplace kami dan temukan preset atau LUT yang Anda sukai. Klik tombol "Beli" atau lihat detail produk untuk melanjutkan.',
  },
  {
    icon: Contact,
    title: '2. Lengkapi Informasi Kontak',
    description: 'Di halaman checkout, masukkan alamat email dan nomor WhatsApp aktif Anda. Informasi ini penting agar kami dapat menghubungi Anda.',
  },
  {
    icon: KeyRound,
    title: '3. Terima Kode Unduhan Unik',
    description: 'Setelah pesanan dibuat, tim admin kami akan memverifikasi pembayaran Anda. Anda akan menerima sebuah kode unduhan unik yang dikirimkan secara manual ke nomor WhatsApp Anda.',
  },
  {
    icon: Download,
    title: '4. Verifikasi & Unduh',
    description: 'Kembali ke halaman konfirmasi pesanan, masukkan kode unik yang telah Anda terima, lalu klik "Verifikasi & Unduh" untuk mendapatkan file produk Anda.',
  },
];

export default function OrderTutorialPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <h2 className="text-3xl">🛍️</h2>
          </div>
          <CardTitle className="text-3xl font-bold font-headline">
            Cara Melakukan Pesanan
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Ikuti langkah-langkah mudah ini untuk membeli dan mengunduh produk dari kreator favorit Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-5">
            {tutorialSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                  <step.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ul>
           <div className="border-t pt-5 text-center">
             <p className="text-muted-foreground mb-3">Siap untuk memulai?</p>
             <Button asChild>
                <Link href="/">Jelajahi Produk Sekarang</Link>
             </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
