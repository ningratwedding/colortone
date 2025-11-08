

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
import { products, type Product, type User } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Calendar as CalendarIcon,
  MoreHorizontal,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Order = {
    id: string;
    customer: {
        name: string;
        email: string;
        whatsapp: string;
    },
    product: Product;
    total: number;
    status: 'Selesai' | 'Diproses' | 'Dibatalkan';
    date: Date;
}

const mockOrders: Order[] = [
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
  {
    id: 'ORD004',
    customer: {
      name: 'Eka Putri',
      email: 'eka.p@example.com',
      whatsapp: '+6287712345678',
    },
    product: products[1],
    total: products[1].price * 1.08,
    status: 'Selesai',
    date: new Date('2024-07-21T11:00:00'),
  },
];

type FormattedData = {
    [key: string]: {
        total: string;
        date: string;
    }
}

export default function AdminOrdersPage() {
    const [formattedData, setFormattedData] = useState<FormattedData>({});
    const [date, setDate] = useState<DateRange | undefined>();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

    const getStatusBadge = (status: Order['status']) => {
        switch (status) {
            case 'Selesai':
                return <Badge className="bg-green-600 hover:bg-green-700">Selesai</Badge>;
            case 'Diproses':
                return <Badge variant="secondary">Diproses</Badge>;
            case 'Dibatalkan':
                return <Badge variant="destructive">Dibatalkan</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };


  return (
    <div className="space-y-4">
      
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Semua Pesanan</CardTitle>
            <CardDescription>
              Lihat dan kelola semua pesanan yang masuk di platform.
            </CardDescription>
          </div>
           <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[260px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "d LLL, y", { locale: id })} -{" "}
                      {format(date.to, "d LLL, y", { locale: id })}
                    </>
                  ) : (
                    format(date.from, "d LLL, y", { locale: id })
                  )
                ) : (
                  <span>Pilih rentang tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={id}
              />
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Produk</TableHead>
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
                  <TableCell>
                    <div>{order.product.name}</div>
                    <div className="text-sm text-muted-foreground">
                        oleh{' '}
                        <Link href={`/creator/${order.product.creator.slug}`} className="hover:underline">
                            {order.product.creator.name}
                        </Link>
                    </div>
                  </TableCell>
                  <TableCell>{formattedData[order.id]?.total}</TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
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
                        <DropdownMenuItem onClick={() => setSelectedOrder(order)}>Lihat Detail Pesanan</DropdownMenuItem>
                        <DropdownMenuItem>Hubungi Pelanggan</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pesanan: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
                Tanggal: {selectedOrder && formattedData[selectedOrder.id]?.date}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-3 py-4">
              <div className="grid grid-cols-4 items-start gap-3">
                <p className="text-sm text-muted-foreground col-span-1">Status</p>
                <div className="col-span-3">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div className="grid grid-cols-4 items-start gap-3">
                <p className="text-sm text-muted-foreground col-span-1">Pelanggan</p>
                <div className="col-span-3">
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer.whatsapp}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-3">
                <p className="text-sm text-muted-foreground col-span-1">Produk</p>
                <div className="col-span-3">
                    <p className="font-medium">{selectedOrder.product.name}</p>
                    <p className="text-sm text-muted-foreground">oleh {selectedOrder.product.creator.name}</p>
                </div>
              </div>
               <div className="grid grid-cols-4 items-start gap-3">
                <p className="text-sm text-muted-foreground col-span-1">Total</p>
                <p className="font-semibold text-base col-span-3">{formattedData[selectedOrder.id]?.total}</p>
              </div>
               <div className="mt-2 flex gap-2">
                <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Kirim Email
                </Button>
                 <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Hubungi WhatsApp
                </Button>
               </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
