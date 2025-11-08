
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
import { useState, useMemo } from 'react';
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
import { useCollection } from '@/firebase/firestore/use-collection';
import { collectionGroup, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Order, UserProfile } from '@/lib/data';
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
  
  // Firestore does not support collection group queries with `onSnapshot` in the same way.
  // For real-time updates on orders for a creator, a more complex data structure (like a top-level `orders` collection with `creatorId`)
  // or cloud functions would be needed.
  // For now, we will fetch orders once on component mount.
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Record<string, UserProfile>>({});
  const [ordersLoading, setOrdersLoading] = useState(true);

  useMemo(async () => {
    if (!user || !firestore) return;
    setOrdersLoading(true);
    const ordersQuery = query(
      collectionGroup(firestore, 'orders'),
      where('creatorId', '==', user.uid),
      orderBy('purchaseDate', 'desc')
    );
    const querySnapshot = await getDocs(ordersQuery);
    const fetchedOrders = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
    setOrders(fetchedOrders);

    // Fetch customer data for each order
    const customerIds = [...new Set(fetchedOrders.map(o => o.userId))];
    const customerProfiles: Record<string, UserProfile> = {};
    for (const customerId of customerIds) {
      const userDoc = await getDocs(query(collection(firestore, 'users'), where('__name__', '==', customerId)));
      if (!userDoc.empty) {
        customerProfiles[customerId] = userDoc.docs[0].data() as UserProfile;
      }
    }
    setCustomers(customerProfiles);
    setOrdersLoading(false);
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
