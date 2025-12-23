

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
import { collection, query, getDocs, doc, updateDoc, where, collectionGroup, documentId, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Order, UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { FirebaseError } from 'firebase/app';

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
  
  const [orders, setOrders] = useState<(Order & {path: string})[]>([]);
  const [customers, setCustomers] = useState<Record<string, UserProfile>>({});
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [orderToCancel, setOrderToCancel] = useState<(Order & {path: string}) | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid || !firestore) {
        if (!userLoading) setOrdersLoading(false);
        return;
      }
      setOrdersLoading(true);

      const ordersQuery = query(
        collectionGroup(firestore, 'orders'),
        where('creatorId', '==', user.uid),
        orderBy('purchaseDate', 'desc')
      );
      
      try {
        const ordersSnapshot = await getDocs(ordersQuery);
        const fetchedOrders = ordersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, path: doc.ref.path } as Order & { path: string }));
        setOrders(fetchedOrders);
        
        if (fetchedOrders.length > 0) {
            const customerIds = [...new Set(fetchedOrders.map(o => o.userId))].filter(Boolean);
            const customersData: Record<string, UserProfile> = {};

            if (customerIds.length > 0) {
                for (let i = 0; i < customerIds.length; i += 30) {
                    const chunk = customerIds.slice(i, i + 30);
                    const customersQuery = query(collection(firestore, 'users'), where(documentId(), 'in', chunk));
                    const customersSnapshot = await getDocs(customersQuery);
                    customersSnapshot.forEach(doc => {
                        customersData[doc.id] = { id: doc.id, ...doc.data() } as UserProfile;
                    });
                }
            }
            setCustomers(customersData);
        }
      } catch (error) {
          const firebaseError = error as FirebaseError;
          // This specific error code indicates a missing index.
          if (firebaseError.code === 'failed-precondition') {
              console.error(
                  'Firestore index missing. Please create it by visiting the link in the error message below.',
                  firebaseError.message
              );
              toast({
                  variant: "destructive",
                  title: "Indeks Firestore Diperlukan",
                  description: "Query memerlukan indeks komposit. Buka konsol browser (F12) untuk melihat tautan pembuatan indeks otomatis.",
                  duration: 15000,
              });
          }
          // Emit a more detailed permission error for debugging.
          const permissionError = new FirestorePermissionError({
              path: `orders (collectionGroup)`,
              operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
      } finally {
        setOrdersLoading(false);
      }
    }
    
    fetchOrders();
  }, [user, userLoading, firestore, toast]);

  const handleCancelOrder = async () => {
    if (!orderToCancel || !firestore) return;

    const orderRef = doc(firestore, orderToCancel.path);
    const updatedData = { status: 'Dibatalkan' };
    
    updateDoc(orderRef, updatedData)
        .then(() => {
            setOrders(prevOrders => prevOrders.map(o => o.id === orderToCancel.id ? { ...o, status: 'Dibatalkan' } : o));
            toast({ title: 'Pesanan Dibatalkan', description: `Pesanan #${orderToCancel.id} telah berhasil dibatalkan.` });
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: orderToCancel.path,
                operation: 'update',
                requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setIsCancelDialogOpen(false);
            setOrderToCancel(null);
        });
  };

  const openCancelDialog = (order: Order & {path: string}) => {
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
                      Tindakan ini akan membatalkan pesanan <span className="font-semibold">#{orderToCancel?.id}</span>. Status akan diubah menjadi "Dibatalkan" dan tidak dapat diubah kembali.
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
