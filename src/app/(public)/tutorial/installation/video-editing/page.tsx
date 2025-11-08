
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileDown, Monitor, Smartphone, Video, ArrowLeft } from 'lucide-react';

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


export default function VideoEditingInstallationPage() {
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
            <Video className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">
            Instalasi Video Editing
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-prose">
            Panduan untuk file LUT .CUBE di berbagai software editing video.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
             <div className="space-y-6 border-t pt-6">
                 <Step icon={FileDown} title="1. Unduh & Simpan File .CUBE">
                    <p>Unduh file .zip dari pembelian Anda dan ekstrak untuk menemukan file LUT dengan format <code className="bg-muted px-1 py-0.5 rounded text-xs">.cube</code>. Pindahkan atau simpan file ini ke lokasi yang mudah diakses di komputer atau ponsel Anda.</p>
                </Step>
                <Step icon={Monitor} title="2. Instalasi di Adobe Premiere Pro">
                     <ol className="list-decimal list-inside space-y-1">
                       <li>Buka Premiere Pro dan buka proyek Anda.</li>
                       <li>Buka panel <strong className="font-semibold">Lumetri Color</strong> (Window > Lumetri Color).</li>
                       <li>Di dalam tab <strong className="font-semibold">Creative</strong>, klik menu dropdown "Look".</li>
                       <li>Pilih <strong className="font-semibold">Browse...</strong>, lalu arahkan ke file <code className="bg-muted px-1 py-0.5 rounded text-xs">.cube</code> Anda untuk menerapkannya.</li>
                       <li>Untuk instalasi permanen, Anda perlu menyalin file .CUBE ke direktori instalasi Premiere Pro Anda (cari folder "LUTs" > "Creative").</li>
                    </ol>
                </Step>
                <Step icon={Monitor} title="3. Instalasi di DaVinci Resolve">
                    <ol className="list-decimal list-inside space-y-1">
                       <li>Buka DaVinci Resolve.</li>
                       <li>Klik ikon gerigi di pojok kanan bawah untuk membuka <strong className="font-semibold">Project Settings</strong>.</li>
                       <li>Pindah ke tab <strong className="font-semibold">Color Management</strong>.</li>
                       <li>Gulir ke bawah dan klik <strong className="font-semibold">Open LUT Folder</strong>. Ini akan membuka folder LUT di file explorer Anda.</li>
                       <li>Salin dan tempel file <code className="bg-muted px-1 py-0.5 rounded text-xs">.cube</code> Anda ke dalam folder ini.</li>
                       <li>Kembali ke DaVinci Resolve dan klik <strong className="font-semibold">Update Lists</strong>. LUT Anda sekarang akan tersedia di menu LUTs.</li>
                    </ol>
                </Step>
                <Step icon={Smartphone} title="4. Instalasi di CapCut (Mobile)">
                    <ol className="list-decimal list-inside space-y-1">
                       <li>Buka CapCut dan impor klip video Anda.</li>
                       <li>Geser toolbar bawah dan pilih <strong className="font-semibold">Adjust</strong>.</li>
                       <li>Geser lagi toolbar <em className="italic">Adjust</em> dan pilih <strong className="font-semibold">LUTs</strong>.</li>
                       <li>Ketuk <strong className="font-semibold">Add LUT</strong> dan arahkan ke file <code className="bg-muted px-1 py-0.5 rounded text-xs">.cube</code> yang telah Anda simpan di ponsel.</li>
                       <li>Setelah diimpor, Anda dapat memilih LUT tersebut dari daftar dan menyesuaikan intensitasnya.</li>
                    </ol>
                </Step>
                <Step icon={Smartphone} title="5. Instalasi di VN Video Editor (Mobile)">
                    <ol className="list-decimal list-inside space-y-1">
                       <li>Buka VN dan buat proyek baru dengan video Anda.</li>
                       <li>Geser toolbar bawah dan pilih <strong className="font-semibold">Filter</strong>.</li>
                       <li>Di bagian atas panel filter, ketuk ikon tambah (+).</li>
                       <li>Pilih <strong className="font-semibold">Import from File Manager</strong> dan pilih file <code className="bg-muted px-1 py-0.5 rounded text-xs">.cube</code> Anda.</li>
                       <li>Setelah diimpor, LUT akan muncul di tab "My Filter" dan siap digunakan.</li>
                    </ol>
                </Step>
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
