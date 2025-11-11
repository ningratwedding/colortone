
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirestore, useStorage } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, doc, updateDoc } from 'firebase/firestore';
import type { Product, Category, Software } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileCheck2, Image as ImageIcon, Link as LinkIcon, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/firebase/auth/use-user';
import { uploadFile } from '@/firebase/storage/actions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  name: z.string().min(5, 'Judul produk minimal 5 karakter.'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter.'),
  price: z.coerce.number().min(1000, 'Harga minimal Rp 1.000.'),
  category: z.string().min(1, 'Kategori harus dipilih.'),
  compatibleSoftware: z.array(z.string()).min(1, 'Pilih minimal satu perangkat lunak.'),
  thumbnail: z.any().optional(),
  imageBefore: z.any().optional(),
  imageAfter: z.any().optional(),
  uploadType: z.enum(['file', 'url'], { required_error: 'Anda harus memilih jenis produk.' }),
  productFile: z.any().optional(),
  downloadUrl: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.uploadType === 'url') {
        if (!data.downloadUrl) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'URL unduhan tidak boleh kosong.',
                path: ['downloadUrl'],
            });
        } else {
            try {
                new URL(data.downloadUrl);
            } catch {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'URL unduhan tidak valid.',
                    path: ['downloadUrl'],
                });
            }
        }
    }
});


type FormData = z.infer<typeof formSchema>;

interface EditProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: Product;
}

const FileEditInput = ({ field, label, description, accept, icon: Icon, currentImageUrl }: any) => {
  const file = field.value?.[0];
  const displayUrl = file ? URL.createObjectURL(file) : currentImageUrl;

  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        {displayUrl && (
          <Image
            src={displayUrl}
            alt={label}
            width={64}
            height={64}
            className="rounded-md aspect-square object-cover"
          />
        )}
        <div className="flex-1">
          <Input
            id={field.name}
            type="file"
            className="hidden"
            accept={accept}
            onChange={(e) => field.onChange(e.target.files)}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById(field.name)?.click()}>
            Ubah Gambar
          </Button>
          <p className="text-xs text-muted-foreground mt-1">{file ? file.name : description}</p>
        </div>
      </div>
    </div>
  );
};


export function EditProductDialog({ isOpen, onOpenChange, product }: EditProductDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = useStorage();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoriesQuery = useMemo(() => firestore ? query(collection(firestore, 'categories')) : null, [firestore]);
  const { data: categories, loading: categoriesLoading } = useCollection<Category>(categoriesQuery);

  const softwareQuery = useMemo(() => firestore ? query(collection(firestore, 'software')) : null, [firestore]);
  const { data: softwareList, loading: softwareLoading } = useCollection<Software>(softwareQuery);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        compatibleSoftware: product.compatibleSoftware || [],
        downloadUrl: product.downloadUrl,
        // Determine upload type based on URL content
        uploadType: product.downloadUrl.includes('firebasestorage.googleapis.com') ? 'file' : 'url',
      });
    }
  }, [product, reset]);

  const selectedSoftware = watch('compatibleSoftware');
  const uploadType = watch('uploadType');

  const onSubmit = async (data: FormData) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    try {
      const productRef = doc(firestore, 'products', product.id);
      
      let finalDownloadUrl = product.downloadUrl;
      if (data.uploadType === 'file' && data.productFile?.[0]) {
        toast({ title: 'Mengunggah file produk baru...' });
        finalDownloadUrl = await uploadFile(storage, data.productFile[0], user.uid, 'product_files');
      } else if (data.uploadType === 'url') {
        finalDownloadUrl = data.downloadUrl!;
      }

      const updatedData: Partial<Product> = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        compatibleSoftware: data.compatibleSoftware,
        downloadUrl: finalDownloadUrl,
      };

      // Handle image uploads only if new files are selected
      if (data.thumbnail?.[0]) {
        toast({ title: 'Mengunggah gambar utama...' });
        updatedData.thumbnailUrl = await uploadFile(storage, data.thumbnail[0], user.uid, 'product_images');
      }
      if (data.imageBefore?.[0]) {
        toast({ title: 'Mengunggah gambar "sebelum"...' });
        updatedData.imageBeforeUrl = await uploadFile(storage, data.imageBefore[0], user.uid, 'product_images');
      }
      if (data.imageAfter?.[0]) {
        toast({ title: 'Mengunggah gambar "sesudah"...' });
        updatedData.imageAfterUrl = await uploadFile(storage, data.imageAfter[0], user.uid, 'product_images');
      }

      await updateDoc(productRef, updatedData);
      toast({
        title: 'Produk Diperbarui',
        description: `Perubahan pada "${data.name}" telah disimpan.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Memperbarui',
        description: 'Terjadi kesalahan saat menyimpan perubahan.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Ubah Detail Produk</DialogTitle>
            <DialogDescription>
              Lakukan perubahan pada produk Anda. Klik simpan jika sudah selesai.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] p-1">
          <div className="grid gap-4 py-4 pr-4">
            {/* General Details */}
            <div className="grid gap-2">
              <Label htmlFor="name">Judul Produk</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" className="min-h-[100px]" {...register('description')} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Harga (IDR)</Label>
                <Input id="price" type="number" {...register('price')} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <Controller name="category" control={control} render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select onValueChange={field.onChange} value={field.value} disabled={categoriesLoading}>
                      <SelectTrigger id="category"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? <SelectItem value="loading" disabled>Memuat...</SelectItem> :
                          categories?.map((c) => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                     {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                  </div>
                )}
              />
            </div>
             <Controller name="compatibleSoftware" control={control} render={({ field }) => (
                <div className="grid gap-2">
                    <Label>Perangkat Lunak yang Kompatibel</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {softwareLoading ? Array.from({length: 4}).map((_, i) => <Button key={i} type="button" disabled variant="outline" size="sm"><Loader2 className="animate-spin h-4 w-4" /></Button>) :
                        softwareList?.map((s) => (
                            <Button key={s.id} type="button" variant={selectedSoftware.includes(s.name) ? "default" : "outline"} size="sm" onClick={() => field.onChange(selectedSoftware.includes(s.name) ? selectedSoftware.filter(name => name !== s.name) : [...selectedSoftware, s.name])} className="flex items-center justify-center gap-2">
                                {s.icon && <div className="h-4 w-4 flex-shrink-0" dangerouslySetInnerHTML={{ __html: s.icon }} />}
                                <span className="truncate">{s.name}</span>
                            </Button>
                        ))}
                    </div>
                    {errors.compatibleSoftware && <p className="text-xs text-destructive">{errors.compatibleSoftware.message}</p>}
                </div>
              )}
            />

            {/* Media */}
            <h3 className="font-semibold text-sm mt-4 border-t pt-4">Media Produk</h3>
             <Controller name="thumbnail" control={control} render={({ field }) => <FileEditInput field={field} label='Gambar Utama' description='Akan digunakan sebagai sampul.' accept="image/*" icon={Star} currentImageUrl={product.thumbnailUrl} />} />
             {errors.thumbnail && <p className="text-xs text-destructive mt-1.5">{String(errors.thumbnail.message)}</p>}

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <span className="font-medium text-sm">Ubah Gambar Perbandingan (Opsional)</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <Controller name="imageBefore" control={control} render={({ field }) => <FileEditInput field={field} label='Gambar "Sebelum"' description='Gambar asli.' accept="image/*" icon={ImageIcon} currentImageUrl={product.imageBeforeUrl} />} />
                    <Controller name="imageAfter" control={control} render={({ field }) => <FileEditInput field={field} label='Gambar "Sesudah"' description='Gambar editan.' accept="image/*" icon={ImageIcon} currentImageUrl={product.imageAfterUrl} />} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Product File */}
            <h3 className="font-semibold text-sm mt-4 border-t pt-4">File Produk</h3>
            <Controller name="uploadType" control={control} render={({ field }) => (
                <div className="grid gap-2">
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="file" id="file" /><Label htmlFor="file">Unggah File Baru</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="url" id="url" /><Label htmlFor="url">Ganti Tautan Eksternal</Label></div>
                  </RadioGroup>
                  {errors.uploadType && <p className="text-xs text-destructive">{errors.uploadType.message}</p>}
                </div>
              )}
            />

            {uploadType === 'file' ? (
              <Controller name="productFile" control={control} render={({ field: { onChange, value, ...restField }}) => (
                  <div>
                    <div className="flex items-center justify-center w-full">
                      <Label htmlFor="product-file-edit" className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                        {value?.[0] ? <div className="text-center text-primary"><FileCheck2 className="w-8 h-8 mx-auto mb-2" /><p className="font-semibold text-sm truncate max-w-full px-2">{value[0].name}</p></div> : <div className="text-center px-2"><Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" /><p className="text-xs text-muted-foreground"><span className="font-semibold">Klik untuk mengganti</span> file .zip</p></div>}
                        <Input id="product-file-edit" type="file" className="hidden" accept=".zip" onChange={(e) => onChange(e.target.files)} {...restField} />
                      </Label>
                    </div>
                    {errors.productFile && <p className="text-xs text-destructive mt-1.5">{String(errors.productFile.message)}</p>}
                  </div>
                )}
              />
            ) : (
              <div className="grid gap-1.5">
                 <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="downloadUrl" placeholder="https://contoh.com/produk-keren.zip" {...register('downloadUrl')} className="pl-10"/>
                 </div>
                {errors.downloadUrl && <p className="text-xs text-destructive">{errors.downloadUrl.message}</p>}
              </div>
            )}
          </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Menyimpan...</> : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
