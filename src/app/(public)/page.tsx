
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
import { collection, query, where, QueryConstraint } from "firebase/firestore";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

function ProductGrid({ filters }: { filters: { category: string; software: string; type: string } }) {
  const firestore = useFirestore();

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    
    const constraints: QueryConstraint[] = [];
    if (filters.category && filters.category !== 'all-categories') {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.software && filters.software !== 'all-software') {
      constraints.push(where('compatibleSoftware', 'array-contains', filters.software));
    }
    if (filters.type && filters.type !== 'all-types') {
      constraints.push(where('type', '==', filters.type));
    }

    return query(collection(firestore, "products"), ...constraints);
  }, [firestore, filters]);

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
        Belum ada produk yang cocok dengan filter Anda.
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
    const [filters, setFilters] = useState({
      category: 'all-categories',
      software: 'all-software',
      type: 'all-types',
    });

    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
      setFilters(prev => ({ ...prev, [filterName]: value }));
    };

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
          Melek Digital
        </h1>
        <p className="mt-3 text-base text-muted-foreground max-w-2xl mx-auto">
          Misi kami adalah menjadi platform terdepan yang memberdayakan para kreator. Kami menyediakan ruang di mana Anda dapat berbagi karya, menginspirasi, dan mengubah gairah menjadi peluang, baik produk digital maupun fisik.
        </p>
      </header>

      <div className="mb-4 flex flex-col md:flex-row gap-2 justify-end">
        <div className="flex gap-2 w-full md:w-auto">
           <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger className="w-full md:w-[160px] bg-card">
              <SelectValue placeholder="Jenis Produk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">Semua Jenis</SelectItem>
              <SelectItem value="digital">Digital</SelectItem>
              <SelectItem value="fisik">Fisik</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
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
          <Select
            value={filters.software}
            onValueChange={(value) => handleFilterChange('software', value)}
          >
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
        <ProductGrid filters={filters} />
      </section>
    </div>
  );
}
