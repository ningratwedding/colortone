
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
import { DollarSign, Link as LinkIcon, ShoppingCart, Users, Copy } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { useState, useEffect, useMemo } from 'react';
import { collectionGroup, query, where, getDocs } from 'firebase/firestore';
import type { Order } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const COMMISSION_RATE = 0.10; // 10%

export default function AffiliatePage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [referredOrders, setReferredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && firestore) {
      const fetchReferredOrders = async () => {
        setLoading(true);
        const ordersQuery = query(collectionGroup(firestore, 'orders'), where('affiliateId', '==', user.uid));
        try {
          const querySnapshot = await getDocs(ordersQuery);
          const orders = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
          orders.sort((a, b) => b.purchaseDate.seconds - a.purchaseDate.seconds);
          setReferredOrders(orders);
        } catch (error) {
          console.error("Error fetching referred orders: ", error);
          toast({ variant: 'destructive', title: 'Gagal Memuat Data', description: 'Tidak dapat mengambil data komisi afiliasi.' });
        } finally {
          setLoading(false);
        }
      };
      fetchReferredOrders();
    }
  }, [user, firestore, toast]);

  const stats = useMemo(() => {
    const totalSales = referredOrders.length;
    const totalRevenue = referredOrders.reduce((acc, order) => acc + order.amount, 0);
    const totalCommission = totalRevenue * COMMISSION_RATE;
    return { totalSales, totalCommission };
  }, [referredOrders]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  const copyAffiliateId = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.uid);
    toast({
        title: 'ID Afiliasi Disalin',
        description: 'Gunakan ID ini atau buat tautan afiliasi dari halaman produk.'
    });
  }

  if (userLoading || loading) {
    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 mb-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-64" />
        </div>
    )
  }

  return (
    <div className="space-y-4">
        <h1 className="font-headline text-2xl font-bold">Dasbor Afiliasi</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Komisi</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalCommission)}</div>
            <p className="text-xs text-muted-foreground">Estimasi total pendapatan dari komisi.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penjualan Ter-rujuk</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">Jumlah total produk yang terjual melalui tautan Anda.</p>
          </CardContent>
        </Card>
      </div>

       <Alert>
        <LinkIcon className="h-4 w-4" />
        <AlertTitle>Bagaimana Cara Kerjanya?</AlertTitle>
        <AlertDescription>
          Salin ID Afiliasi Anda dan tambahkan <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">?ref=ID_ANDA</code> di akhir URL produk apa pun, atau cukup gunakan tombol 'Buat Tautan Afiliasi' di halaman produk.
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-muted-foreground">ID Afiliasi Anda: <code className="font-mono">{user?.uid}</code></p>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={copyAffiliateId}>
                <Copy className="h-3 w-3" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Komisi</CardTitle>
          <CardDescription>Daftar penjualan yang berhasil Anda rujuk.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Produk</TableHead>
                <TableHead className="text-right">Harga Jual</TableHead>
                <TableHead className="text-right">Komisi (10%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referredOrders.length > 0 ? (
                referredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.productName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(order.amount)}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{formatCurrency(order.amount * COMMISSION_RATE)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Belum ada penjualan afiliasi. Bagikan tautan produk untuk memulai!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
