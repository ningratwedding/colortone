
'use client';

import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Product } from '@/lib/data';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase/provider';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'));
  }, [firestore]);

  const { data: allProducts, loading } = useCollection<Product>(productsQuery);
  const [formattedPrices, setFormattedPrices] = useState<{
    [key: string]: string;
  }>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogAction, setDialogAction] = useState<'deactivate' | 'delete' | null>(null);

  useEffect(() => {
    if (!allProducts) return;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const prices: { [key: string]: string } = {};
    allProducts.forEach((product) => {
      prices[product.id] = formatCurrency(product.price);
    });
    setFormattedPrices(prices);
  }, [allProducts]);

  const handleActionClick = (
    product: Product,
    action: 'deactivate' | 'delete'
  ) => {
    setSelectedProduct(product);
    setDialogAction(action);
  };

  const closeDialog = () => {
    setSelectedProduct(null);
    setDialogAction(null);
  };

  const dialogOpen = !!(selectedProduct && dialogAction);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Semua Produk</CardTitle>
          <CardDescription>
            Kelola semua produk di platform dan lihat kinerjanya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Gambar</span>
                </TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Kreator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Total Penjualan</TableHead>
                <TableHead>
                  <span className="sr-only">Tindakan</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-16 w-16 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))}
              {!loading && allProducts && allProducts.length > 0 ? (
                allProducts.map((product) => (
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
                      {/* TODO: Fetch creator name from creatorId */}
                      <span className="text-muted-foreground">{product.creatorId}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Aktif</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {formattedPrices[product.id]}
                    </TableCell>
                    <TableCell>
                      {product.sales.toLocaleString('id-ID')}
                    </TableCell>
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
                          <DropdownMenuItem asChild>
                            <Link href={`/product/${product.id}`}>
                              Lihat Produk
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => handleActionClick(product, 'deactivate')}
                          >
                            Nonaktifkan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={() => handleActionClick(product, 'delete')}
                          >
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                !loading && (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            Belum ada produk.
                        </TableCell>
                    </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === 'deactivate' &&
                `Tindakan ini akan menonaktifkan produk "${selectedProduct?.name}". Produk ini tidak akan terlihat oleh publik.`}
              {dialogAction === 'delete' &&
                `Tindakan ini akan menghapus produk "${selectedProduct?.name}" secara permanen. Tindakan ini tidak dapat dibatalkan.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // Logika aksi di sini
                closeDialog();
              }}
              className={
                dialogAction === 'delete'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : ''
              }
            >
              Ya, {dialogAction === 'delete' ? 'Hapus' : 'Nonaktifkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
