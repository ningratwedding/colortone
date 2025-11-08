

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
import { useEffect, useState, useMemo } from 'react';
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
import { useFirestore } from '@/firebase/provider';
import { collectionGroup, query, getDocs, orderBy } from 'firebase/firestore';
import type { Order, UserProfile, Product } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminOrdersPage() {
    const firestore = useFirestore();
    const [date, setDate] = useState<DateRange | undefined>();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Record<string, UserProfile>>({});
    const [products, setProducts] = useState<Record<string, Product>>({});
    const [creators, setCreators] = useState<Record<string, UserProfile>>({});
    const [loading, setLoading] = useState(true);

    useMemo(async () => {
        if (!firestore) return;
        setLoading(true);

        // Fetch all orders from the collection group
        const ordersQuery = query(collectionGroup(firestore, 'orders'), orderBy('purchaseDate', 'desc'));
        const querySnapshot = await getDocs(ordersQuery);
        const fetchedOrders = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
        setOrders(fetchedOrders);

        // Batch fetch related data
        const userIds = [...new Set(fetchedOrders.flatMap(o => [o.userId, o.creatorId]))];
        const productIds = [...new Set(fetchedOrders.map(o => o.productId))];

        const [userDocs, productDocs] = await Promise.all([
            userIds.length ? getDocs(query(collectionGroup(firestore, 'users'), where('__name__', 'in', userIds.map(id => `users/${id}`)))) : Promise.resolve({ docs: [] }),
            productIds.length ? getDocs(query(collectionGroup(firestore, 'products'), where('__name__', 'in', productIds.map(id => `products/${id}`)))) : Promise.resolve({ docs: [] }),
        ]);

        const usersMap = Object.fromEntries(userDocs.docs.map(doc => [doc.id, { ...doc.data(), id: doc.id } as UserProfile]));
        const productsMap = Object.fromEntries(productDocs.docs.map(doc => [doc.id, { ...doc.data(), id: doc.id } as Product]));
        
        setCustomers(usersMap);
        setCreators(usersMap);
        setProducts(productsMap);

        setLoading(false);
    }, [firestore]);


    const handleOpenDialog = (order: Order) => {
        setSelectedOrder(order);
    }

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
    
    const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    const formatDate = (d: { seconds: number, nanoseconds: number }) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d.seconds * 1000));


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
              {loading && Array.from({length: 5}).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-20"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-40"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                    <TableCell><Skeleton className="h-6 w-20"/></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-32"/></TableCell>
                    <TableCell><Skeleton className="h-8 w-8"/></TableCell>
                </TableRow>
              ))}
              {!loading && orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{customers[order.userId]?.name || '...'}</div>
                    <div className="text-sm text-muted-foreground">{customers[order.userId]?.email || '...'}</div>
                  </TableCell>
                  <TableCell>
                    <div>{order.productName}</div>
                    <div className="text-sm text-muted-foreground">
                        oleh{' '}
                        <Link href={`/creator/${creators[order.creatorId]?.slug}`} className="hover:underline">
                            {creators[order.creatorId]?.name || '...'}
                        </Link>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(order.amount)}</TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDate(order.purchaseDate)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenDialog(order)}>Lihat Detail Pesanan</DropdownMenuItem>
                        <DropdownMenuItem>Hubungi Pelanggan</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {!loading && orders.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        Tidak ada pesanan yang ditemukan.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pesanan: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
                Tanggal: {selectedOrder && formatDate(selectedOrder.purchaseDate)}
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
                    <p className="font-medium">{customers[selectedOrder.userId]?.name}</p>
                    <p className="text-sm text-muted-foreground">{customers[selectedOrder.userId]?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-3">
                <p className="text-sm text-muted-foreground col-span-1">Produk</p>
                <div className="col-span-3">
                    <p className="font-medium">{selectedOrder.productName}</p>
                    <p className="text-sm text-muted-foreground">oleh {creators[selectedOrder.creatorId]?.name}</p>
                </div>
              </div>
               <div className="grid grid-cols-4 items-start gap-3">
                <p className="text-sm text-muted-foreground col-span-1">Total</p>
                <p className="font-semibold text-base col-span-3">{formatCurrency(selectedOrder.amount)}</p>
              </div>

               <div className="border-t pt-4 mt-2 flex gap-2">
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
