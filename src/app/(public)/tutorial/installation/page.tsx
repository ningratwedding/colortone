
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { FileCheck, FileDown, Wand2, Smartphone, Monitor, Video } from 'lucide-react';

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


export default function InstallationTutorialPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader className="items-center text-center p-6">
          <div className="p-3 bg-primary/10 rounded-full mb-2">
            <Wand2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">
            Panduan Instalasi Detail
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-prose">
            Temukan cara menginstal preset & LUT di perangkat lunak favorit Anda. Pilih tab di bawah ini yang sesuai dengan aplikasi Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <Tabs defaultValue="desktop-photo" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
              <TabsTrigger value="desktop-photo" className="py-2"><Monitor className="mr-2 h-4 w-4" /> Desktop (Foto)</TabsTrigger>
              <TabsTrigger value="mobile-photo" className="py-2"><Smartphone className="mr-2 h-4 w-4" /> Mobile (Foto)</TabsTrigger>
              <TabsTrigger value="video-editing" className="py-2"><Video className="mr-2 h-4 w-4" /> Video Editing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="desktop-photo" className="border rounded-b-md p-6 mt-0 border-t-0">
                <h2 className="text-xl font-bold mb-4 font-headline">Instalasi di Lightroom Classic & Photoshop (File .XMP)</h2>
                <div className="space-y-6">
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
            </TabsContent>

            <TabsContent value="mobile-photo" className="border rounded-b-md p-6 mt-0 border-t-0">
                <h2 className="text-xl font-bold mb-4 font-headline">Instalasi di Lightroom Mobile (File .DNG)</h2>
                <div className="space-y-6">
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
            </TabsContent>

            <TabsContent value="video-editing" className="border rounded-b-md p-6 mt-0 border-t-0">
                <h2 className="text-xl font-bold mb-4 font-headline">Instalasi LUTs di Editor Video (File .CUBE)</h2>
                 <div className="space-y-6">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

    