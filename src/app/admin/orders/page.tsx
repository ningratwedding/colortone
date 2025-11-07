'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { products, users } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD001',
    customer: {
      name: 'Budi Santoso',
      email: 'budi.s@example.com',
      whatsapp: '+6281234567890',
    },
    product: products[0],
    total: products[0].price * 1.08,
    status: 'Selesai',
    date: new Date('2024-07-20T10:30:00'),
  },
  {
    id: 'ORD002',
    customer: {
      name: 'Citra Lestari',
      email: 'citra.l@example.com',
      whatsapp: '+6281122334455',
    },
    product: products[2],
    total: products[2].price * 1.08,
    status: 'Selesai',
    date: new Date('2024-07-20T14:00:00'),
  },
  {
    id: 'ORD003',
    customer: {
      name: 'Doni Firmansyah',
      email: 'doni.f@example.com',
      whatsapp: '+6285678901234',
    },
    product: products[4],
    total: products[4].price * 1.08,
    status: 'Diproses',
    date: new Date('2024-07-21T09:15:00'),
  },
];

type FormattedData = {
    [key: string]: {
        total: string;
        date: string;
    }
}

export default function OrdersPage() {

    const [formattedData, setFormattedData] = useState<FormattedData>({});

    useEffect(() => {
        const formatCurrency = (amount: number) => {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
        };
        
        const formatDate = (date: Date) => {
            return new Intl.DateTimeFormat('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(date);
        }

        const data: FormattedData = {};
        mockOrders.forEach(order => {
            data[order.id] = {
                total: formatCurrency(order.total),
                date: formatDate(order.date),
            }
        });
        setFormattedData(data);

    }, []);

  return (
    <div className="space-y-8">
      
      <Card>
        <CardHeader>
          <CardTitle>Pesanan Terbaru</CardTitle>
          <CardDescription>
            Lihat dan kelola pesanan yang masuk untuk produk Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead className="hidden md:table-cell">Produk</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Tanggal</TableHead>
                <TableHead>
                  <span className="sr-only">Tindakan</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                    <div className="text-sm text-muted-foreground">{order.customer.whatsapp}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{order.product.name}</TableCell>
                  <TableCell>{formattedData[order.id]?.total}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'Selesai' ? 'default' : 'secondary'} className={order.status === 'Selesai' ? 'bg-green-600' : ''}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{formattedData[order.id]?.date}</TableCell>
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
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem>Tandai Selesai</DropdownMenuItem>
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
