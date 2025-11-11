
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar as CalendarIcon, MoreHorizontal, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Order, UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

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

const getStatusBadge = (status: Order['status']) => {
    switch (status) {
        case 'Selesai':
            return <Badge className="bg-green-600 hover:bg-green-700">Selesai</Badge>;
        case 'Menunggu Pembayaran':
             return <Badge variant="secondary">Menunggu Pembayaran</Badge>;
        case 'Diproses':
            return <Badge variant="secondary">Diproses</Badge>;
        case 'Dibatalkan':
            return <Badge variant="destructive">Dibatalkan</Badge>;
        default:
            return <Badge variant="outline">Unknown</Badge>;
    }
};

export default function OrdersPage() {
  const [date, setDate] = useState<DateRange | undefined>();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Record<string, UserProfile>>({});
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !firestore) return;
      setOrdersLoading(true);

      try {
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        const allOrders: Order[] = [];
        const allCustomers: Record<string, UserProfile> = {};

        for (const userDoc of usersSnapshot.docs) {
          const userData = { id: userDoc.id, ...userDoc.data() } as UserProfile;
          allCustomers[userDoc.id] = userData;
          
          const ordersSnapshot = await getDocs(collection(firestore, `users/${userDoc.id}/orders`));
          ordersSnapshot.forEach(orderDoc => {
            const orderData = { id: orderDoc.id, ...orderDoc.data() } as Order;
            if (orderData.creatorId === user.uid) {
              allOrders.push(orderData);
            }
          });
        }
        
        allOrders.sort((a, b) => b.purchaseDate.seconds - a.purchaseDate.seconds);
        
        setOrders(allOrders);
        setCustomers(allCustomers);

      } catch (error) {
        console.error("Failed to fetch orders:", error);
         toast({ variant: 'destructive', title: 'Gagal Memuat Pesanan', description: 'Terjadi kesalahan saat mengambil data pesanan.' });
      } finally {
        setOrdersLoading(false);
      }
    }
    fetchOrders();
  }, [user, firestore, toast]);

  const handleCancelOrder = async () => {
    if (!orderToCancel || !firestore) return;

    try {
        const orderRef = doc(firestore, `users/${orderToCancel.userId}/orders`, orderToCancel.id);
        await updateDoc(orderRef, { status: 'Dibatalkan' });

        setOrders(prevOrders => prevOrders.map(o => o.id === orderToCancel.id ? { ...o, status: 'Dibatalkan' } : o));

        toast({ title: 'Pesanan Dibatalkan', description: `Pesanan dengan ID ${orderToCancel.id} telah dibatalkan.` });
    } catch (error) {
        console.error('Error cancelling order:', error);
        toast({ variant: 'destructive', title: 'Gagal Membatalkan', description: 'Terjadi kesalahan saat membatalkan pesanan.' });
    } finally {
        setIsCancelDialogOpen(false);
        setOrderToCancel(null);
    }
  };

  const openCancelDialog = (order: Order) => {
    setOrderToCancel(order);
    setIsCancelDialogOpen(true);
  };

  const loading = userLoading || ordersLoading;

  return (
    <>
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
              <TableRow key={order.id} className={cn(order.status === 'Dibatalkan' && 'bg-muted/50')}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{customers[order.userId]?.name || 'Memuat...'}</div>
                  <div className="text-sm text-muted-foreground">
                    {customers[order.userId]?.email || '...'}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {order.productName}
                </TableCell>
                <TableCell>{formatCurrency(order.amount)}</TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
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
                        disabled={order.status === 'Dibatalkan'}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Alihkan menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                       <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                       <DropdownMenuItem>Tandai Selesai</DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem 
                         className="text-destructive"
                         onSelect={() => openCancelDialog(order)}
                        >
                         <Trash2 className="mr-2 h-4 w-4" />
                         Tolak Pesanan
                       </DropdownMenuItem>
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

    <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                    Tindakan ini akan membatalkan pesanan <span className="font-semibold">{orderToCancel?.id}</span>. Status akan diubah menjadi "Dibatalkan" dan tidak dapat diubah kembali.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOrderToCancel(null)}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelOrder}>Ya, Batalkan Pesanan</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
