
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
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar as CalendarIcon, MoreHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { collection, collectionGroup, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Order, UserProfile, Product } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

function formatCurrency(amount: number) {
    if (typeof amount !== 'number') return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

function formatDate(date: Date) {
    if (!date) return '';
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

export default function OrdersPage() {
  const [date, setDate] = useState<DateRange | undefined>();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Record<string, UserProfile>>({});
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !firestore) return;
      setOrdersLoading(true);

      // 1. Fetch all products for the current creator
      const productsQuery = query(collection(firestore, 'products'), where('creatorId', '==', user.uid));
      const productsSnapshot = await getDocs(productsQuery);
      const productIds = productsSnapshot.docs.map(doc => doc.id);

      if (productIds.length === 0) {
        setOrders([]);
        setOrdersLoading(false);
        return;
      }
      
      // 2. Fetch all orders where productId is in the creator's product list
      const ordersQuery = query(
        collectionGroup(firestore, 'orders'),
        where('productId', 'in', productIds)
      );
      const querySnapshot = await getDocs(ordersQuery);
      
      const fetchedOrders = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
      
      // Sort on the client-side
      fetchedOrders.sort((a, b) => b.purchaseDate.seconds - a.purchaseDate.seconds);
      
      setOrders(fetchedOrders);

      // 3. Fetch customer details
      if (fetchedOrders.length > 0) {
          const customerIds = [...new Set(fetchedOrders.map(o => o.userId))];
          const customerProfiles: Record<string, UserProfile> = {};
          
          const chunks = [];
          for (let i = 0; i < customerIds.length; i += 30) {
              chunks.push(customerIds.slice(i, i + 30));
          }
          
          for (const chunk of chunks) {
              if (chunk.length > 0) {
                 // Note: this assumes user IDs are globally unique, which they are.
                 const usersQuery = query(collection(firestore, 'users'), where('__name__', 'in', chunk.map(id => doc(firestore, 'users', id).path.substring(doc(firestore, 'users', id).path.indexOf('/')+1))));
                 const userDocs = await getDocs(usersQuery);
                 userDocs.forEach(doc => {
                    customerProfiles[doc.id] = doc.data() as UserProfile;
                 })
              }
          }
          setCustomers(customerProfiles);
      }
      
      setOrdersLoading(false);
    }
    fetchOrders();
  }, [user, firestore]);

  const loading = userLoading || ordersLoading;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Pesanan Terbaru</CardTitle>
          <CardDescription>
            Lihat dan kelola pesanan yang masuk untuk produk Anda.
          </CardDescription>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-[260px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'd LLL, y', { locale: id })} -{' '}
                    {format(date.to, 'd LLL, y', { locale: id })}
                  </>
                ) : (
                  format(date.from, 'd LLL, y', { locale: id })
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
            {loading && Array.from({length: 3}).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
            ))}
            {!loading && orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{customers[order.userId]?.name || '...'}</div>
                  <div className="text-sm text-muted-foreground">
                    {customers[order.userId]?.email || '...'}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {order.productName}
                </TableCell>
                <TableCell>{formatCurrency(order.amount)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === 'Selesai' ? 'default' : 'secondary'
                    }
                    className={order.status === 'Selesai' ? 'bg-green-600' : ''}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {formatDate(new Date(order.purchaseDate.seconds * 1000))}
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
                      <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                      <DropdownMenuItem>Tandai Selesai</DropdownMenuItem>
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
  );
}

    