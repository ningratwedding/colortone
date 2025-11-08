
'use client';

import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Product } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

function formatCurrency(amount: number) {
    if (typeof amount !== 'number') return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function DashboardProductsPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();

    const productsQuery = useMemo(() => {
        if (!firestore) return null;
        // Query all products, we will filter on the client
        return query(collection(firestore, 'products'), orderBy('sales', 'desc'));
    }, [firestore]);

    const { data: allProducts, loading: productsLoading } = useCollection<Product>(productsQuery);

    const sellerProducts = useMemo(() => {
        if (!user || !allProducts) return [];
        // Filter products by creatorId on the client
        return allProducts.filter(p => p.creatorId === user.uid);
    }, [user, allProducts]);

    const loading = userLoading || productsLoading;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button asChild>
          <Link href="/creator/upload">Tambah Produk</Link>
        </Button>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Produk</CardTitle>
          <CardDescription>
            Kelola produk Anda dan lihat kinerja penjualannya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Gambar</span>
                </TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead className="hidden md:table-cell">
                  Total Penjualan
                </TableHead>
                <TableHead>
                  <span className="sr-only">Tindakan</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({length: 3}).map((_, i) => (
                <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
              {!loading && sellerProducts && sellerProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.imageAfterUrl}
                      width="64"
                      data-ai-hint={product.imageAfterHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Aktif</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-primary">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{product.sales.toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Alihkan menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                        <DropdownMenuItem>Ubah</DropdownMenuItem>
                        <DropdownMenuItem>Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && (!sellerProducts || sellerProducts.length === 0) && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        Anda belum memiliki produk.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {loading && Array.from({length: 3}).map((_, i) => (
             <Card key={i}><CardContent className="p-4"><Skeleton className="h-24 w-full" /></CardContent></Card>
        ))}
        {!loading && sellerProducts && sellerProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader className="flex flex-row items-start gap-4 p-4">
              <Image
                alt={product.name}
                className="aspect-square rounded-md object-cover"
                height="64"
                src={product.imageAfterUrl}
                width="64"
                data-ai-hint={product.imageAfterHint}
              />
              <div className="flex-grow">
                <CardTitle className="text-base leading-tight mb-1">
                  {product.name}
                </CardTitle>
                <div className="text-sm font-medium text-primary">
                  {formatCurrency(product.price)}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-haspopup="true"
                    size="icon"
                    variant="ghost"
                    className="-mt-1 -mr-1"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Alihkan menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                  <DropdownMenuItem>Ubah</DropdownMenuItem>
                  <DropdownMenuItem>Hapus</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4 pt-0 grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Penjualan</span>
                <span>{product.sales.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline">Aktif</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
         {!loading && (!sellerProducts || sellerProducts.length === 0) && (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    Anda belum memiliki produk.
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
