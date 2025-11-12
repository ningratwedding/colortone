'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Upload, FileCheck2, Loader2, Image as ImageIcon, Link as LinkIcon, Star, Box, Package, Weight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/auth/use-user';
import { useStorage, useFirestore } from '@/firebase/provider';
import { uploadFile } from '@/firebase/storage/actions';
import { collection, addDoc, query, serverTimestamp } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Category, Software } from '@/lib/data';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


const formSchema = z.object({
  name: z.string().min(5, 'Judul produk minimal 5 karakter.'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter.'),
  price: z.coerce.number().min(1000, 'Harga minimal Rp 1.000.'),
  category: z.string().min(1, 'Kategori harus dipilih.'),
  type: z.enum(['digital', 'fisik'], { required_error: 'Anda harus memilih jenis produk.' }),
  
  // Digital specific
  compatibleSoftware: z.array(z.string()).optional(),
  downloadUrl: z.string().optional(),
  productFile: z.any().optional(),

  // Physical specific
  stock: z.coerce.number().optional(),
  weight: z.coerce.number().optional(), // in grams
  
  // Media
  galleryImages: z.any().refine(files => files?.length >= 1, 'Unggah minimal satu gambar utama.'),
  imageBefore: z.any().optional(),
  imageAfter: z.any().optional(),

}).superRefine((data, ctx) => {
    if (data.type === 'digital') {
        if (!data.productFile && !data.downloadUrl) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Unggah file produk atau berikan URL unduhan.',
                path: ['productFile'],
            });
        }
         if (data.downloadUrl) {
            try { new URL(data.downloadUrl); } catch {
                 ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'URL unduhan tidak valid.', path: ['downloadUrl'] });
            }
        }
    } else if (data.type === 'fisik') {
        if (data.stock === undefined || data.stock < 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Stok harus 0 atau lebih.', path: ['stock']});
        }
        if (data.weight === undefined || data.weight <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Berat produk harus diisi (dalam gram).', path: ['weight']});
        }
    }
});

type FormData = z.infer<typeof formSchema>;

const FileUploadDropzone = ({
  field,
  label,
  description,
  accept,
  icon: Icon,
  multiple = false
}: {
  field: any;
  label: string;
  description: string;
  accept: string;
  icon: React.ElementType;
  multiple?: boolean;
}) => {
    const files = field.value;
    const fileCount = files?.length || 0;

    return (
        <div className="grid gap-1.5">
            <Label>{label}</Label>
            <div className="flex items-center justify-center w-full">
            <Label
                htmlFor={field.name}
                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
            >
                {fileCount > 0 ? (
                    <div className="flex flex-col items-center justify-center text-center text-primary">
                        <FileCheck2 className="w-8 h-8 mb-2" />
                        <p className="font-semibold text-sm truncate max-w-full px-2">{fileCount} file dipilih</p>
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
                    multiple={multiple}
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
  
  const categoriesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'));
  }, [firestore]);
  const { data: categories, loading: categoriesLoading } = useCollection<Category>(categoriesQuery);
  
  const softwareQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'software'));
  }, [firestore]);
  const { data: softwareList, loading: softwareLoading } = useCollection<Software>(softwareQuery);
  
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
  
  const selectedSoftware = watch('compatibleSoftware') || [];
  const productType = watch('type');
  
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    if (!productType) return categories; // Show all if no type is selected yet
    return categories.filter(cat => cat.type === productType || cat.type === 'semua');
  }, [categories, productType]);


  const onSubmit = async (data: FormData) => {
    if (!user || !storage) {
        toast({ variant: 'destructive', title: 'Anda harus masuk untuk mengunggah produk.' });
        return;
    }
    setIsSubmitting(true);
    
    try {
        toast({ title: 'Mengunggah file...', description: 'Mohon tunggu, ini mungkin memerlukan waktu beberapa saat.' });

        let finalDownloadUrl: string | undefined = undefined;

        if (data.type === 'digital') {
            if (data.productFile?.[0]) {
                finalDownloadUrl = await uploadFile(storage, data.productFile[0], user.uid, 'product_files');
            } else {
                finalDownloadUrl = data.downloadUrl!;
            }
        }

        const galleryImageUploads = Array.from(data.galleryImages as FileList).map(file => 
            uploadFile(storage, file, user.uid, 'product_images')
        );

        const galleryImageUrls = await Promise.all(galleryImageUploads);

        const imageBeforeUrl = data.imageBefore?.[0] ? await uploadFile(storage, data.imageBefore[0], user.uid, 'product_images') : undefined;
        const imageAfterUrl = data.imageAfter?.[0] ? await uploadFile(storage, data.imageAfter[0], user.uid, 'product_images') : undefined;
        
        toast({ title: 'Menyimpan detail produk...' });

        const newProduct = {
            name: data.name,
            creatorId: user.uid,
            price: data.price,
            description: data.description,
            type: data.type,
            category: data.category,
            galleryImageUrls,
            galleryImageHints: galleryImageUrls.map(() => "product gallery image"),
            sales: 0,
            tags: [], // Placeholder for tags
            createdAt: serverTimestamp(),
            // Digital
            compatibleSoftware: data.type === 'digital' ? data.compatibleSoftware : [],
            downloadUrl: finalDownloadUrl,
            imageBeforeUrl: imageBeforeUrl,
            imageBeforeHint: imageBeforeUrl ? 'product image before' : undefined,
            imageAfterUrl: imageAfterUrl,
            imageAfterHint: imageAfterUrl ? 'product image after' : undefined,
            // Physical
            stock: data.type === 'fisik' ? data.stock : null,
            weight: data.type === 'fisik' ? data.weight : null,
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
              Lengkapi detail di bawah ini untuk produk baru Anda. Informasi ini akan ditampilkan di halaman produk.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Judul Produk</Label>
              <Input id="name" placeholder="misalnya, Kaos Edisi Terbatas" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
             <div className="grid gap-1.5">
                <Label>Jenis Produk</Label>
                 <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="digital" id="digital" /><Label htmlFor="digital">Digital</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="fisik" id="fisik" /><Label htmlFor="fisik">Fisik</Label></div>
                        </RadioGroup>
                    )}
                 />
                 {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={categoriesLoading || !productType}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder={!productType ? "Pilih jenis produk dulu" : "Pilih kategori"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? (
                            <SelectItem value="loading" disabled>Memuat kategori...</SelectItem>
                        ) : (
                            filteredCategories.map((c) => (
                            <SelectItem key={c.id} value={c.slug}>
                                {c.name}
                            </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                     {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                  </div>
                )}
              />
            </div>

            {productType === 'fisik' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="grid gap-1.5">
                        <Label htmlFor="stock">Jumlah Stok</Label>
                        <Input id="stock" type="number" placeholder="100" {...register('stock')} />
                        {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
                    </div>
                     <div className="grid gap-1.5">
                        <Label htmlFor="weight">Berat (gram)</Label>
                        <Input id="weight" type="number" placeholder="misal: 250" {...register('weight')} />
                        {errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}
                    </div>
                </div>
            )}

            {productType === 'digital' && (
                <Controller
                    name="compatibleSoftware"
                    control={control}
                    render={({ field }) => (
                        <div className="grid gap-1.5">
                            <Label>Perangkat Lunak yang Kompatibel</Label>
                            <TooltipProvider>
                                <div className="flex flex-wrap gap-2">
                                {softwareLoading ? Array.from({length: 4}).map((_, i) => <Button key={i} type="button" disabled variant="outline" size="icon" className="h-10 w-10"><Loader2 className="animate-spin h-4 w-4" /></Button>) :
                                    softwareList?.map((s) => (
                                        <Tooltip key={s.id}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant={selectedSoftware.includes(s.name) ? "default" : "outline"}
                                                    size="icon"
                                                    onClick={() => {
                                                        const newValue = selectedSoftware.includes(s.name)
                                                        ? selectedSoftware.filter(name => name !== s.name)
                                                        : [...selectedSoftware, s.name];
                                                        field.onChange(newValue);
                                                    }}
                                                    className="h-10 w-10"
                                                >
                                                    {s.icon ? (
                                                        <img src={s.icon} alt={s.name} className="h-5 w-5 object-contain" />
                                                    ) : (
                                                        <span className="text-xs">{s.name.substring(0, 2)}</span>
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{s.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </TooltipProvider>
                            {errors.compatibleSoftware && <p className="text-xs text-destructive">{errors.compatibleSoftware.message}</p>}
                        </div>
                    )}
                />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Media Produk</CardTitle>
            <CardDescription>
              Unggah gambar dan file produk Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Controller
                name="galleryImages"
                control={control}
                render={({ field }) => (
                    <div>
                        <FileUploadDropzone 
                            field={field} 
                            label='Gambar Galeri (Wajib)' 
                            description='Rasio aspek 3:2 direkomendasikan' 
                            accept="image/*"
                            icon={Star}
                            multiple={true}
                        />
                        {errors.galleryImages && <p className="text-xs text-destructive mt-1.5">{String(errors.galleryImages.message)}</p>}
                    </div>
                )}
                />
            {productType === 'digital' && (
                <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                    <div className="flex flex-col items-start">
                        <span className="font-medium">Gambar Perbandingan (Opsional)</span>
                        <span className="text-sm font-normal text-muted-foreground">Tambahkan gambar sebelum & sesudah untuk slider.</span>
                    </div>
                    </AccordionTrigger>
                    <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <Controller
                        name="imageBefore"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <FileUploadDropzone 
                                    field={field} 
                                    label='Gambar "Sebelum"' 
                                    description='Gambar asli untuk perbandingan' 
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
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            )}

            {productType === 'digital' && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-sm pt-4 border-t">File Produk Digital</h3>
                     <Controller
                        name="productFile"
                        control={control}
                        render={({ field }) => (
                        <div>
                            <FileUploadDropzone
                            field={field}
                            label="File Produk (.zip)"
                            description="Unggah file .zip Anda, atau berikan tautan di bawah"
                            accept=".zip"
                            icon={Upload}
                            />
                            {errors.productFile && (
                            <p className="text-xs text-destructive mt-1.5">
                                {String(errors.productFile.message)}
                            </p>
                            )}
                        </div>
                        )}
                    />
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-muted"></div>
                        <span className="flex-shrink mx-4 text-muted-foreground text-xs">ATAU</span>
                        <div className="flex-grow border-t border-muted"></div>
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="downloadUrl">Tautan Unduhan Eksternal</Label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="downloadUrl"
                                placeholder="https://contoh.com/produk-keren.zip"
                                {...register('downloadUrl')}
                                className="pl-10"
                            />
                        </div>
                        {errors.downloadUrl && (
                        <p className="text-xs text-destructive">
                            {errors.downloadUrl.message}
                        </p>
                        )}
                    </div>
                </div>
            )}
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
