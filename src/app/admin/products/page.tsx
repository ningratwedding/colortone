
"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { products, type Product } from "@/lib/data";

export default function AdminProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [formattedPrices, setFormattedPrices] = useState<{ [key: string]: string }>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogAction, setDialogAction] = useState<'deactivate' | 'delete' | null>(null);

  useEffect(() => {
    const sortedProducts = [...products].sort((a, b) => b.sales - a.sales);
    setAllProducts(sortedProducts);

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const prices: { [key: string]: string } = {};
    products.forEach(product => {
      prices[product.id] = formatCurrency(product.price);
    });
    setFormattedPrices(prices);
  }, []);

  const handleActionClick = (product: Product, action: 'deactivate' | 'delete') => {
    setSelectedProduct(product);
    setDialogAction(action);
  };

  const closeDialog = () => {
    setSelectedProduct(null);
    setDialogAction(null);
  }

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
              {allProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.imageAfter.imageUrl}
                      width="64"
                      data-ai-hint={product.imageAfter.imageHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Link href={`/creator/${product.creator.slug}`} className="hover:underline">
                      {product.creator.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Aktif</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-primary">{formattedPrices[product.id]}</TableCell>
                  <TableCell>{product.sales.toLocaleString('id-ID')}</TableCell>
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
                            <Link href={`/product/${product.id}`}>Lihat Produk</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleActionClick(product, 'deactivate')}>Nonaktifkan</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={() => handleActionClick(product, 'delete')}>Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={dialogOpen} onOpenChange={closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
            <AlertDialogDescription>
                {dialogAction === 'deactivate' && `Tindakan ini akan menonaktifkan produk "${selectedProduct?.name}". Produk ini tidak akan terlihat oleh publik.`}
                {dialogAction === 'delete' && `Tindakan ini akan menghapus produk "${selectedProduct?.name}" secara permanen. Tindakan ini tidak dapat dibatalkan.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                // Logika aksi di sini
                closeDialog();
              }}
              className={dialogAction === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              Ya, {dialogAction === 'delete' ? 'Hapus' : 'Nonaktifkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
