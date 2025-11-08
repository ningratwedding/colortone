
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
import { products, type Product } from "@/lib/data";

export default function AdminProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [formattedPrices, setFormattedPrices] = useState<{ [key: string]: string }>({});

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
                    <Link href={`/creator/${product.creator.id}`} className="hover:underline">
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
                        <DropdownMenuItem>Nonaktifkan</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
