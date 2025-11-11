
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product-card";
import type { Product, Category, Software } from "@/lib/data";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirestore } from "@/firebase/provider";
import { collection, query } from "firebase/firestore";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

function ProductGrid() {
  const firestore = useFirestore();
  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"));
  }, [firestore]);
  const { data: products, loading, error } = useCollection<Product>(productsQuery);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Gagal Memuat Produk</AlertTitle>
            <AlertDescription>
                Saat ini terjadi masalah saat mengambil data produk. Tim kami sedang menanganinya.
            </AlertDescription>
        </Alert>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Belum ada produk yang tersedia.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}


export default function Home() {
    const firestore = useFirestore();

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


  return (
    <div className="container mx-auto px-4 py-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary font-headline">
          Mewadahi Kreativitas Visual
        </h1>
        <p className="mt-3 text-base text-muted-foreground max-w-2xl mx-auto">
          Misi kami adalah menjadi platform terdepan yang memberdayakan para pencerita visual. Kami menyediakan ruang di mana para kreator dapat berbagi karya, menginspirasi, dan mengubah gairah mereka menjadi peluang.
        </p>
      </header>

      <div className="mb-4 flex flex-col md:flex-row gap-2 justify-end">
        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue="all-categories">
            <SelectTrigger className="w-full md:w-[160px] bg-card">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">Semua Kategori</SelectItem>
              {categoriesLoading ? <SelectItem value="loading" disabled>Memuat...</SelectItem> :
                categories?.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                    </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          <Select defaultValue="all-software">
            <SelectTrigger className="w-full md:w-[160px] bg-card">
              <SelectValue placeholder="Perangkat Lunak" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-software">Semua Perangkat Lunak</SelectItem>
              {softwareLoading ? <SelectItem value="loading" disabled>Memuat...</SelectItem> :
                softwareList?.map((s) => (
                <SelectItem key={s.id} value={s.slug}>
                  <div className="flex items-center gap-2">
                    {s.icon && <div className="h-4 w-4" dangerouslySetInnerHTML={{ __html: s.icon }} />}
                    <span>{s.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="mb-4" />

      <section>
        <ProductGrid />
      </section>
    </div>
  );
}
