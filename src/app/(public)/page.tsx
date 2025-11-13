
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
import type { Product, Category, Software, Campaign } from "@/lib/data";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirestore } from "@/firebase/provider";
import { collection, query, where, QueryConstraint, limit } from "firebase/firestore";
import { useMemo, useState }from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

function CampaignBanner() {
    const firestore = useFirestore();

    const campaignQuery = useMemo(() => {
        if (!firestore) return undefined;
        return query(collection(firestore, "campaigns"), where('isActive', '==', true), limit(1));
    }, [firestore]);

    const { data: campaigns, loading, error } = useCollection<Campaign>(campaignQuery);

    if (error) {
        console.error("Failed to load campaign banner:", error);
        return null;
    }

    if (loading) {
        return <Skeleton className="aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1] w-full" />;
    }

    if (!campaigns || campaigns.length === 0) {
        return null;
    }

    const campaign = campaigns[0];

    return (
        <div className="relative aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1] w-full group">
            <Link href={campaign.linkUrl} className="group/link block absolute inset-0">
                <Image
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={campaign.imageHint}
                />
            </Link>
        </div>
    )
}

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 p-1">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 p-1">
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
      setFilters(prev => ({ 
          ...prev, 
          [filterName]: value,
          // Reset category if type changes
          ...(filterName === 'type' && { category: 'all-categories' }),
      }));
    };

    const categoriesQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'categories'));
    }, [firestore]);
    const { data: categories, loading: categoriesLoading } = useCollection<Category>(categoriesQuery);
    
    const filteredCategories = useMemo(() => {
        if (!categories) return [];
        if (filters.type === 'all-types') return categories;
        return categories.filter(cat => cat.type === filters.type || cat.type === 'semua');
    }, [categories, filters.type]);


    const softwareQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'software'));
    }, [firestore]);
    const { data: softwareList, loading: softwareLoading } = useCollection<Software>(softwareQuery);


  return (
    <div className="container mx-auto">
      <CampaignBanner />
      <div className="flex flex-col md:flex-row gap-2 justify-end p-2">
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
                filteredCategories?.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                    </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          {filters.type !== 'fisik' && (
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
                        {s.icon && <img src={s.icon} alt={s.name} className="h-4 w-4 object-contain" />}
                        <span>{s.name}</span>
                    </div>
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Separator />

      <section>
        <ProductGrid filters={filters} />
      </section>
    </div>
  );
}
