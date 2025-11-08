
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Download, FileArchive, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const tutorialSteps = [
  {
    icon: Download,
    title: '1. Unduh File Anda',
    description: 'Setelah pembelian berhasil, buka halaman "Pembelian Saya" di dasbor akun Anda dan unduh file .zip untuk produk yang Anda beli.',
  },
  {
    icon: FileArchive,
    title: '2. Ekstrak File .zip',
    description: 'Buka atau ekstrak file .zip yang telah diunduh di komputer atau perangkat seluler Anda untuk mengakses file preset atau LUT di dalamnya (misalnya, file .XMP, .DNG, atau .CUBE).',
  },
  {
    icon: Wand2,
    title: '3. Impor ke Perangkat Lunak Anda',
    description: 'Buka perangkat lunak editing Anda (seperti Lightroom, Photoshop, atau Premiere Pro) dan gunakan fitur impor untuk menambahkan preset atau LUT baru. Proses ini mungkin berbeda tergantung pada perangkat lunak yang Anda gunakan.',
  },
];

export default function InstallationTutorialPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader className="items-center text-center p-6">
          <div className="p-3 bg-primary/10 rounded-full mb-2">
            <Wand2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">
            Cara Instalasi & Penggunaan Produk
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-prose">
            Menggunakan preset atau LUT baru Anda sangatlah mudah. Ikuti panduan di bawah ini.
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
             <p className="text-muted-foreground mb-3">Butuh lebih banyak inspirasi?</p>
             <Button asChild size="lg">
                <Link href="/">Jelajahi Produk Lainnya</Link>
             </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
