
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileCheck, FileDown, Wand2, Monitor, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cara Instal Preset Desktop (XMP) di Lightroom & Photoshop',
    description: 'Panduan langkah demi langkah untuk menginstal preset .XMP di Adobe Lightroom Classic dan Adobe Photoshop Camera Raw untuk alur kerja editing foto profesional Anda.',
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


export default function DesktopPhotoInstallationPage() {
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
            <Monitor className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">
            Instalasi Desktop (Foto)
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-prose">
            Panduan untuk file preset .XMP di Adobe Lightroom Classic & Photoshop (Camera Raw).
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
             <div className="space-y-6 border-t pt-6">
                <Step icon={FileDown} title="1. Unduh & Ekstrak File">
                    <p>Setelah pembelian, unduh file .zip dari halaman "Pembelian Saya". Ekstrak file tersebut di komputer Anda untuk menemukan file preset dengan format <code className="bg-muted px-1 py-0.5 rounded text-xs">.xmp</code>.</p>
                </Step>
                <Step icon={Wand2} title="2. Instalasi di Adobe Lightroom Classic">
                    <ol className="list-decimal list-inside space-y-1">
                       <li>Buka Lightroom Classic.</li>
                       <li>Pindah ke modul <strong className="font-semibold">Develop</strong>.</li>
                       <li>Di panel kiri, cari panel <strong className="font-semibold">Presets</strong>, lalu klik ikon tambah (+).</li>
                       <li>Pilih <strong className="font-semibold">Import Presets...</strong> dari menu dropdown.</li>
                       <li>Arahkan ke folder tempat Anda mengekstrak file <code className="bg-muted px-1 py-0.5 rounded text-xs">.xmp</code>, pilih file-file tersebut, dan klik <strong className="font-semibold">Import</strong>.</li>
                       <li>Preset Anda sekarang akan muncul di bawah panel Presets.</li>
                    </ol>
                </Step>
                <Step icon={FileCheck} title="3. Instalasi di Adobe Photoshop (Camera Raw)">
                     <ol className="list-decimal list-inside space-y-1">
                       <li>Buka Photoshop dan buka sebuah gambar (RAW direkomendasikan).</li>
                       <li>Buka filter <strong className="font-semibold">Camera Raw Filter</strong> (Filter > Camera Raw Filter...).</li>
                       <li>Di panel kanan, pilih tab <strong className="font-semibold">Presets</strong> (ikon dua lingkaran bertumpuk).</li>
                       <li>Klik ikon tiga titik (...) di bagian atas panel Presets dan pilih <strong className="font-semibold">Import Profiles & Presets...</strong></li>
                       <li>Arahkan ke file <code className="bg-muted px-1 py-0.5 rounded text-xs">.xmp</code> yang sudah diekstrak dan impor.</li>
                    </ol>
                    <p className="mt-2 text-xs text-muted-foreground/80">Catatan: Preset .XMP yang diimpor di Lightroom Classic biasanya akan otomatis tersinkronisasi dengan Adobe Camera Raw di Photoshop jika Anda menggunakan akun Adobe Creative Cloud yang sama.</p>
                </Step>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
