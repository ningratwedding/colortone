
'use client';

import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
import { products } from '@/lib/data';

export default function DashboardProductsPage() {
  const [sellerProducts] = useState(products.slice(0, 5));
  const [formattedPrices, setFormattedPrices] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const prices: { [key: string]: string } = {};
    sellerProducts.forEach((product) => {
      prices[product.id] = formatCurrency(product.price);
    });
    setFormattedPrices(prices);
  }, [sellerProducts]);

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
              {sellerProducts.map((product) => (
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
                    <Badge variant="outline">Aktif</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-primary">
                    {formattedPrices[product.id]}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">215</TableCell>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {sellerProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader className="flex flex-row items-start gap-4 p-4">
              <Image
                alt={product.name}
                className="aspect-square rounded-md object-cover"
                height="64"
                src={product.imageAfter.imageUrl}
                width="64"
                data-ai-hint={product.imageAfter.imageHint}
              />
              <div className="flex-grow">
                <CardTitle className="text-base leading-tight mb-1">
                  {product.name}
                </CardTitle>
                <div className="text-sm font-medium text-primary">
                  {formattedPrices[product.id]}
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
                <span>215</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline">Aktif</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
