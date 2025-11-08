
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileCheck, FileDown, Wand2, Smartphone, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cara Instal Preset Mobile (DNG) di Lightroom Mobile',
    description: 'Panduan mudah untuk mengimpor dan menyimpan preset format .DNG di aplikasi Adobe Lightroom Mobile gratis di perangkat iOS atau Android Anda.',
};

const Step = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground flex-shrink-0 mt-1">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <h3 className="font-semibold text-base">{title}</h3>
            <div className="text-muted-foreground text-sm space-y-2">{children}</div>
        </div>
    </div>
);


export default function MobilePhotoInstallationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/tutorial/installation">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Semua Panduan
            </Link>
          </Button>
        </div>
      <Card>
        <CardHeader className="items-center text-center p-6">
          <div className="p-3 bg-primary/10 rounded-full mb-2">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">
            Instalasi Mobile (Foto)
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-prose">
            Panduan untuk file preset .DNG di aplikasi Adobe Lightroom Mobile.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
             <div className="space-y-6 border-t pt-6">
                <Step icon={FileDown} title="1. Unduh & Simpan File .DNG">
                    <p>Di perangkat seluler Anda, unduh file preset. Jika dalam format .zip, ekstrak terlebih dahulu. Anda akan mendapatkan file gambar dengan format <code className="bg-muted px-1 py-0.5 rounded text-xs">.dng</code>.</p>
                    <p>Simpan file .DNG tersebut ke galeri foto atau file di ponsel Anda.</p>
                </Step>
                <Step icon={Smartphone} title="2. Impor ke Lightroom Mobile">
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Buka aplikasi Lightroom Mobile.</li>
                        <li>Buat album baru untuk preset Anda (misalnya, "My Presets") agar tetap teratur.</li>
                        <li>Di dalam album baru tersebut, ketuk ikon "Tambah Foto" (biasanya ikon gambar dengan tanda +).</li>
                        <li>Pilih file <code className="bg-muted px-1 py-0.5 rounded text-xs">.dng</code> dari galeri atau file Anda untuk diimpor. Foto tersebut mungkin terlihat kosong atau aneh, itu normal.</li>
                    </ol>
                </Step>
                <Step icon={Wand2} title="3. Buat Preset dari File .DNG">
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Buka foto .DNG yang baru saja Anda impor.</li>
                        <li>Ketuk ikon tiga titik (...) di pojok kanan atas layar.</li>
                        <li>Pilih <strong className="font-semibold">Create Preset</strong>.</li>
                        <li>Beri nama preset Anda. Anda juga bisa memilih grup preset untuk menyimpannya.</li>
                        <li>Pastikan semua pengaturan (Profile, Light, Color, Effects, dll.) telah dicentang, lalu ketuk tanda centang untuk menyimpan.</li>
                        <li>Ulangi langkah ini untuk setiap file .DNG lainnya.</li>
                    </ol>
                </Step>
                 <Step icon={FileCheck} title="4. Gunakan Preset Anda">
                    <p>Buka foto mana pun yang ingin Anda edit, gulir ke panel <strong className="font-semibold">Presets</strong> di bagian bawah, dan temukan preset baru Anda di grup yang telah Anda buat.</p>
                </Step>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
