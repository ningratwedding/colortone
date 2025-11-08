
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories, software } from '@/lib/data';
import { Upload, FileCheck2, Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/auth/use-user';
import { useStorage, useFirestore } from '@/firebase/provider';
import { uploadFile } from '@/firebase/storage/actions';
import { collection, addDoc } from 'firebase/firestore';

const formSchema = z.object({
  name: z.string().min(5, 'Judul produk minimal 5 karakter.'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter.'),
  price: z.coerce.number().min(1000, 'Harga minimal Rp 1.000.'),
  category: z.string().min(1, 'Kategori harus dipilih.'),
  compatibleSoftware: z.array(z.string()).min(1, 'Pilih minimal satu perangkat lunak.'),
  imageBefore: z.any().refine(file => file?.length == 1, 'Gambar "sebelum" harus diunggah.'),
  imageAfter: z.any().refine(file => file?.length == 1, 'Gambar "sesudah" harus diunggah.'),
  productFile: z.any().refine(file => file?.length == 1, 'File produk .zip harus diunggah.'),
});

type FormData = z.infer<typeof formSchema>;

const FileUploadDropzone = ({
  field,
  label,
  description,
  accept,
  icon: Icon
}: {
  field: any;
  label: string;
  description: string;
  accept: string;
  icon: React.ElementType;
}) => {
    const file = field.value?.[0];
    return (
        <div className="grid gap-1.5">
            <Label>{label}</Label>
            <div className="flex items-center justify-center w-full">
            <Label
                htmlFor={field.name}
                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
            >
                {file ? (
                    <div className="flex flex-col items-center justify-center text-center text-primary">
                        <FileCheck2 className="w-8 h-8 mb-2" />
                        <p className="font-semibold text-sm truncate max-w-full px-2">{file.name}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center px-2">
                        <Icon className="w-6 h-6 mb-2 text-muted-foreground" />
                        <p className="mb-1 text-xs text-muted-foreground">
                            <span className="font-semibold">Klik untuk mengunggah</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                )}
                <Input
                    id={field.name}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={(e) => field.onChange(e.target.files)}
                />
            </Label>
            </div>
        </div>
    );
}

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const storage = useStorage();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      compatibleSoftware: [],
    },
  });
  
  const selectedSoftware = watch('compatibleSoftware');

  const onSubmit = async (data: FormData) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Anda harus masuk untuk mengunggah produk.' });
        return;
    }
    setIsSubmitting(true);
    
    try {
        toast({ title: 'Mengunggah file...', description: 'Mohon tunggu, ini mungkin memerlukan waktu beberapa saat.' });

        const [imageBeforeUrl, imageAfterUrl, downloadUrl] = await Promise.all([
            uploadFile(storage, data.imageBefore[0], user.uid, 'product_images'),
            uploadFile(storage, data.imageAfter[0], user.uid, 'product_images'),
            uploadFile(storage, data.productFile[0], user.uid, 'product_files')
        ]);
        
        toast({ title: 'Menyimpan detail produk...' });

        const newProduct = {
            name: data.name,
            creatorId: user.uid,
            price: data.price,
            description: data.description,
            category: data.category,
            compatibleSoftware: data.compatibleSoftware,
            imageBeforeUrl: imageBeforeUrl,
            imageBeforeHint: 'product image',
            imageAfterUrl: imageAfterUrl,
            imageAfterHint: 'product image',
            downloadUrl: downloadUrl,
            sales: 0,
            tags: [], // Placeholder for tags
            createdAt: new Date(),
        };

        const docRef = await addDoc(collection(firestore, 'products'), newProduct);

        toast({
            title: 'Produk Berhasil Diterbitkan!',
            description: `Produk "${data.name}" Anda sekarang sudah tayang.`,
        });

        router.push(`/product/${docRef.id}`);

    } catch (error) {
        console.error('Error publishing product:', error);
        toast({
            variant: 'destructive',
            title: 'Gagal Menerbitkan Produk',
            description: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Detail Produk</CardTitle>
            <CardDescription>
              Lengkapi detail di bawah ini untuk produk digital baru Anda. Informasi ini akan ditampilkan di halaman produk.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Judul Produk</Label>
              <Input id="name" placeholder="misalnya, Preset Film Sinematik" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan apa yang membuat produk Anda unik..."
                className="min-h-[100px]"
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="price">Harga (IDR)</Label>
                <Input id="price" type="number" placeholder="150000" {...register('price')} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-1.5">
                    <Label htmlFor="category">Kategori</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                     {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                  </div>
                )}
              />
            </div>
            <Controller
                name="compatibleSoftware"
                control={control}
                render={({ field }) => (
                    <div className="grid gap-1.5">
                        <Label>Perangkat Lunak yang Kompatibel</Label>
                        <p className="text-xs text-muted-foreground">
                            Pilih semua yang berlaku.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {software.map((s) => (
                                <Button
                                    key={s.id}
                                    type="button"
                                    variant={selectedSoftware.includes(s.id) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        const newValue = selectedSoftware.includes(s.id)
                                        ? selectedSoftware.filter(id => id !== s.id)
                                        : [...selectedSoftware, s.id];
                                        field.onChange(newValue);
                                    }}
                                >
                                    {s.name}
                                </Button>
                            ))}
                        </div>
                        {errors.compatibleSoftware && <p className="text-xs text-destructive">{errors.compatibleSoftware.message}</p>}
                    </div>
                )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Media Produk</CardTitle>
            <CardDescription>
              Unggah gambar sebelum & sesudah, dan file produk Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Controller
                  name="imageBefore"
                  control={control}
                  render={({ field }) => (
                    <div>
                        <FileUploadDropzone 
                            field={field} 
                            label='Gambar "Sebelum"' 
                            description='Gambar asli' 
                            accept="image/*"
                            icon={ImageIcon}
                        />
                        {errors.imageBefore && <p className="text-xs text-destructive mt-1.5">{String(errors.imageBefore.message)}</p>}
                    </div>
                  )}
                />
                 <Controller
                  name="imageAfter"
                  control={control}
                  render={({ field }) => (
                     <div>
                        <FileUploadDropzone 
                            field={field} 
                            label='Gambar "Sesudah"' 
                            description='Gambar yang telah diedit' 
                            accept="image/*"
                            icon={ImageIcon}
                        />
                         {errors.imageAfter && <p className="text-xs text-destructive mt-1.5">{String(errors.imageAfter.message)}</p>}
                    </div>
                  )}
                />
            </div>
            <Controller
                name="productFile"
                control={control}
                render={({ field }) => (
                    <div>
                        <FileUploadDropzone 
                            field={field} 
                            label='File Produk (.zip)' 
                            description='Unggah file .zip Anda' 
                            accept=".zip"
                            icon={Upload}
                        />
                        {errors.productFile && <p className="text-xs text-destructive mt-1.5">{String(errors.productFile.message)}</p>}
                    </div>
                )}
            />
          </CardContent>
        </Card>
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" disabled={isSubmitting}>Simpan sebagai Draf</Button>
          <Button type="submit" disabled={isSubmitting || userLoading}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Menerbitkan...</> : 'Publikasikan Produk'}
          </Button>
        </div>
      </div>
    </form>
  );
}
