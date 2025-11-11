
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useFirestore } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, doc, updateDoc } from 'firebase/firestore';
import type { Product, Category, Software } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(5, 'Judul produk minimal 5 karakter.'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter.'),
  price: z.coerce.number().min(1000, 'Harga minimal Rp 1.000.'),
  category: z.string().min(1, 'Kategori harus dipilih.'),
  compatibleSoftware: z.array(z.string()).min(1, 'Pilih minimal satu perangkat lunak.'),
});

type FormData = z.infer<typeof formSchema>;

interface EditProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: Product;
}

export function EditProductDialog({ isOpen, onOpenChange, product }: EditProductDialogProps) {
  const { toast } = useToast();
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
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      compatibleSoftware: product.compatibleSoftware || [],
    },
  });

  // Reset form when product changes
  useEffect(() => {
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      compatibleSoftware: product.compatibleSoftware || [],
    });
  }, [product, reset]);

  const selectedSoftware = watch('compatibleSoftware');

  const onSubmit = async (data: FormData) => {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      const productRef = doc(firestore, 'products', product.id);
      await updateDoc(productRef, data);
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
          <ScrollArea className="h-[60vh] p-1">
          <div className="grid gap-4 py-4 pr-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Judul Produk</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                className="min-h-[100px]"
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Harga (IDR)</Label>
                <Input id="price" type="number" {...register('price')} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select onValueChange={field.onChange} value={field.value} disabled={categoriesLoading}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? (
                            <SelectItem value="loading" disabled>Memuat kategori...</SelectItem>
                        ) : (
                            categories?.map((c) => (
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
             <Controller
                name="compatibleSoftware"
                control={control}
                render={({ field }) => (
                    <div className="grid gap-2">
                        <Label>Perangkat Lunak yang Kompatibel</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                           {softwareLoading ? Array.from({length: 4}).map((_, i) => <Button key={i} type="button" disabled variant="outline" size="sm"><Loader2 className="animate-spin h-4 w-4" /></Button>) :
                            softwareList?.map((s) => (
                                <Button
                                    key={s.id}
                                    type="button"
                                    variant={selectedSoftware.includes(s.name) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        const newValue = selectedSoftware.includes(s.name)
                                        ? selectedSoftware.filter(name => name !== s.name)
                                        : [...selectedSoftware, s.name];
                                        field.onChange(newValue);
                                    }}
                                    className="flex items-center justify-center gap-2"
                                >
                                    {s.icon && <div className="h-4 w-4 flex-shrink-0" dangerouslySetInnerHTML={{ __html: s.icon }} />}
                                    <span className="truncate">{s.name}</span>
                                </Button>
                            ))}
                        </div>
                        {errors.compatibleSoftware && <p className="text-xs text-destructive">{errors.compatibleSoftware.message}</p>}
                    </div>
                )}
            />
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
