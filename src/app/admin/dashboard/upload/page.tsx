import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, software } from "@/lib/data";
import { Upload } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="grid gap-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-headline">Unggah Produk Baru</h1>
        </div>
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Detail Produk</CardTitle>
            <CardDescription>
              Isi informasi untuk paket preset atau LUT baru Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Judul Produk</Label>
              <Input
                id="name"
                placeholder="misalnya, Preset Film Sinematik"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan apa yang membuat produk Anda unik..."
                className="min-h-[120px]"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="price">Harga</Label>
                    <Input id="price" type="number" placeholder="150000" />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="discount-price">Harga Diskon (Opsional)</Label>
                    <Input id="discount-price" type="number" placeholder="100000" />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="grid gap-2">
                <Label>Perangkat Lunak yang Kompatibel</Label>
                <p className="text-sm text-muted-foreground">Pilih semua yang berlaku.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {software.map(s => (
                        <Button key={s.id} variant="outline">{s.name}</Button>
                    ))}
                </div>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Media Produk</CardTitle>
                <CardDescription>Unggah gambar sebelum & sesudah, dan file produk Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Gambar "Sebelum"</Label>
                        <div className="flex items-center justify-center w-full">
                            <Label htmlFor="dropzone-file-before" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground"/>
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Klik untuk mengunggah</span></p>
                                    <p className="text-xs text-muted-foreground">Gambar asli</p>
                                </div>
                                <Input id="dropzone-file-before" type="file" className="hidden"/>
                            </Label>
                        </div> 
                    </div>
                    <div className="grid gap-2">
                        <Label>Gambar "Sesudah"</Label>
                        <div className="flex items-center justify-center w-full">
                            <Label htmlFor="dropzone-file-after" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground"/>
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Klik untuk mengunggah</span></p>
                                    <p className="text-xs text-muted-foreground">Gambar yang telah diedit</p>
                                </div>
                                <Input id="dropzone-file-after" type="file" className="hidden"/>
                            </Label>
                        </div> 
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label>File Produk (.zip)</Label>
                     <div className="flex items-center justify-center w-full">
                        <Label htmlFor="dropzone-file-product" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground"/>
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Klik untuk mengunggah</span> file .zip Anda</p>
                            </div>
                            <Input id="dropzone-file-product" type="file" className="hidden" accept=".zip"/>
                        </Label>
                    </div> 
                </div>
            </CardContent>
        </Card>
         <div className="flex items-center justify-end gap-2">
          <Button variant="outline">Simpan sebagai Draf</Button>
          <Button>Publikasikan Produk</Button>
        </div>
      </div>
    </div>
  );
}
